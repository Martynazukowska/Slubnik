import json
from decimal import Decimal, InvalidOperation
from datetime import date

from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.http import require_http_methods

from .forms import WeddingForm
from .models import Wedding
from .serializers import serialize_wedding
from .services import WeddingAlreadyExists, create_wedding

def validation_error(errors):
    return JsonResponse(
        {"detail": "Sprawdź zaznaczone pola.", "errors": errors}, status=400,
    )


@never_cache
@csrf_protect
@require_POST
def create_wedding_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Musisz być zalogowany."}, status=401)
    if request.content_type != "application/json":
        return JsonResponse({"detail": "Wymagany format application/json."}, status=415)
    try:
        data = json.loads(request.body, parse_float=Decimal)
    except (ValueError, UnicodeDecodeError):
        return JsonResponse({"detail": "Nieprawidłowy JSON."}, status=400)
    if not isinstance(data, dict):
        return JsonResponse({"detail": "Prześlij obiekt JSON."}, status=400)

    types = {
        "wedding_date": (str,), "city": (str,),
        "guest_count": (str, int), "planned_budget": (str, int, Decimal),
    }
    errors = {
        field: ["Nieprawidłowy typ wartości."]
        for field, allowed in types.items()
        if field in data and (isinstance(data[field], bool) or not isinstance(data[field], allowed))
    }
    if errors:
        return validation_error(errors)

    form = WeddingForm(data)
    if not form.is_valid():
        return validation_error({field: list(messages) for field, messages in form.errors.items()})
    try:
        wedding = create_wedding(user=request.user, cleaned_data=form.cleaned_data)
    except WeddingAlreadyExists:
        return JsonResponse({"detail": "Masz już utworzone wesele."}, status=409)
    return JsonResponse(serialize_wedding(wedding), status=201)


@never_cache
@require_GET
def current_wedding_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Musisz być zalogowany."}, status=401)
    wedding = Wedding.objects.select_related("created_by").filter(
        created_by=request.user,
    ).order_by("pk").first()
    if wedding is None:
        return JsonResponse({"detail": "Nie masz jeszcze utworzonego wesela."}, status=404)
    return JsonResponse(serialize_wedding(wedding))

@csrf_protect
@require_http_methods(["PATCH"])
def update_wedding_view(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {
                "detail": "Musisz być zalogowany.",
            },
            status=401,
        )

    wedding = Wedding.objects.filter(
        created_by=request.user,
    ).first()

    if wedding is None:
        return JsonResponse(
            {
                "detail": "Nie masz utworzonego wesela.",
            },
            status=404,
        )

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {
                "detail": "Nieprawidłowe dane.",
            },
            status=400,
        )

    wedding_date_raw = data.get("wedding_date")
    city = data.get("city", "").strip()
    guest_count_raw = data.get("guest_count")
    planned_budget_raw = data.get("planned_budget")

    if not wedding_date_raw:
        return JsonResponse(
            {
                "detail": "Podaj datę ślubu.",
            },
            status=400,
        )

    try:
        wedding_date = date.fromisoformat(
            wedding_date_raw,
        )
    except ValueError:
        return JsonResponse(
            {
                "detail": "Nieprawidłowa data ślubu.",
            },
            status=400,
        )

    if not city:
        return JsonResponse(
            {
                "detail": "Podaj miasto.",
            },
            status=400,
        )

    try:
        guest_count = int(
            guest_count_raw,
        )
    except (TypeError, ValueError):
        return JsonResponse(
            {
                "detail": "Podaj poprawną liczbę gości.",
            },
            status=400,
        )

    if guest_count <= 0:
        return JsonResponse(
            {
                "detail": (
                    "Liczba gości musi być większa od 0."
                ),
            },
            status=400,
        )

    try:
        planned_budget = Decimal(
            str(planned_budget_raw),
        )
    except (
        InvalidOperation,
        TypeError,
        ValueError,
    ):
        return JsonResponse(
            {
                "detail": "Podaj poprawny budżet.",
            },
            status=400,
        )

    if planned_budget <= 0:
        return JsonResponse(
            {
                "detail": "Budżet musi być większy od 0.",
            },
            status=400,
        )

    wedding.wedding_date = wedding_date
    wedding.city = city
    wedding.guest_count = guest_count
    wedding.planned_budget = planned_budget

    wedding.save(
        update_fields=[
            "wedding_date",
            "city",
            "guest_count",
            "planned_budget",
        ]
    )

    return JsonResponse(
        serialize_wedding(wedding),
        status=200,
    )

@csrf_protect
@require_http_methods(["DELETE"])
def delete_wedding_view(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {
                "detail": "Musisz być zalogowany.",
            },
            status=401,
        )

    wedding = Wedding.objects.filter(
        created_by=request.user,
    ).first()

    if wedding is None:
        return JsonResponse(
            {
                "detail": "Nie masz utworzonego wesela.",
            },
            status=404,
        )

    wedding.delete()

    return JsonResponse(
        {
            "detail": "Wesele zostało usunięte.",
        },
        status=200,
    )