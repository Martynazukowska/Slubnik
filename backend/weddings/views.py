import json
from decimal import Decimal

from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.http import require_GET, require_POST, require_http_methods

from .forms import WeddingForm
from .models import Wedding
from .serializers import serialize_wedding
from .services import WeddingAlreadyExists, create_wedding


def validation_error(errors):
    return JsonResponse(
        {
            "detail": "Sprawdź zaznaczone pola.",
            "errors": errors,
        },
        status=400,
    )


def unauthorized():
    return JsonResponse(
        {"detail": "Musisz być zalogowany."},
        status=401,
    )


def get_user_wedding(user):
    return (
        Wedding.objects
        .select_related("created_by")
        .filter(created_by=user)
        .order_by("pk")
        .first()
    )


def parse_json(request):
    if request.content_type != "application/json":
        return None, JsonResponse(
            {"detail": "Wymagany format application/json."},
            status=415,
        )

    try:
        data = json.loads(request.body, parse_float=Decimal)
    except (ValueError, UnicodeDecodeError):
        return None, JsonResponse(
            {"detail": "Nieprawidłowy JSON."},
            status=400,
        )

    if not isinstance(data, dict):
        return None, JsonResponse(
            {"detail": "Prześlij obiekt JSON."},
            status=400,
        )

    return data, None


def validate_wedding_data(data):
    types = {
        "wedding_date": (str,),
        "city": (str,),
        "guest_count": (str, int),
        "planned_budget": (str, int, Decimal),
    }

    type_errors = {
        field: ["Nieprawidłowy typ wartości."]
        for field, allowed in types.items()
        if field in data
        and (
            isinstance(data[field], bool)
            or not isinstance(data[field], allowed)
        )
    }

    if type_errors:
        return None, validation_error(type_errors)

    form = WeddingForm(data)

    if not form.is_valid():
        errors = {
            field: list(messages)
            for field, messages in form.errors.items()
        }
        return None, validation_error(errors)

    return form.cleaned_data, None


@never_cache
@csrf_protect
@require_POST
def create_wedding_view(request):
    if not request.user.is_authenticated:
        return unauthorized()

    data, error = parse_json(request)
    if error:
        return error

    cleaned_data, error = validate_wedding_data(data)
    if error:
        return error

    try:
        wedding = create_wedding(
            user=request.user,
            cleaned_data=cleaned_data,
        )
    except WeddingAlreadyExists:
        return JsonResponse(
            {"detail": "Masz już utworzone wesele."},
            status=409,
        )

    return JsonResponse(
        serialize_wedding(wedding),
        status=201,
    )


@never_cache
@require_GET
def current_wedding_view(request):
    if not request.user.is_authenticated:
        return unauthorized()

    wedding = get_user_wedding(request.user)

    if wedding is None:
        return JsonResponse(
            {"detail": "Nie masz jeszcze utworzonego wesela."},
            status=404,
        )

    return JsonResponse(serialize_wedding(wedding))


@csrf_protect
@require_http_methods(["PATCH"])
def update_wedding_view(request):
    if not request.user.is_authenticated:
        return unauthorized()

    wedding = get_user_wedding(request.user)

    if wedding is None:
        return JsonResponse(
            {"detail": "Nie masz utworzonego wesela."},
            status=404,
        )

    data, error = parse_json(request)
    if error:
        return error

    cleaned_data, error = validate_wedding_data(data)
    if error:
        return error

    for field in (
        "wedding_date",
        "city",
        "guest_count",
        "planned_budget",
    ):
        setattr(wedding, field, cleaned_data[field])

    wedding.save(
        update_fields=[
            "wedding_date",
            "city",
            "guest_count",
            "planned_budget",
        ]
    )

    return JsonResponse(serialize_wedding(wedding))


@csrf_protect
@require_http_methods(["DELETE"])
def delete_wedding_view(request):
    if not request.user.is_authenticated:
        return unauthorized()

    wedding = get_user_wedding(request.user)

    if wedding is None:
        return JsonResponse(
            {"detail": "Nie masz utworzonego wesela."},
            status=404,
        )

    wedding.delete()

    return JsonResponse(
        {"detail": "Wesele zostało usunięte."},
        status=200,
    )