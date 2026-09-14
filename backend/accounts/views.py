import json

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from .models import Profile


User = get_user_model()


def serialize_user(user):
    try:
        profile = user.profile
        partner_name = profile.partner_name
    except Profile.DoesNotExist:
        partner_name = ""

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "profile": {
            "partner_name": partner_name,
        },
    }


@ensure_csrf_cookie
@require_GET
def csrf_view(request):
    return JsonResponse({
        "detail": "CSRF cookie set",
    })


@csrf_protect
@require_POST
def login_view(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {
                "detail": "Nieprawidłowe dane.",
            },
            status=400,
        )

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return JsonResponse(
            {
                "detail": "Podaj nazwę użytkownika i hasło.",
            },
            status=400,
        )

    # LOGIN NICZEGO NIE TWORZY.
    try:
        User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse(
            {
                "detail": "Nie znaleziono użytkownika o takiej nazwie.",
            },
            status=404,
        )

    user = authenticate(
        request=request,
        username=username,
        password=password,
    )

    if user is None:
        return JsonResponse(
            {
                "detail": "Nieprawidłowe hasło.",
            },
            status=401,
        )

    login(request, user)

    return JsonResponse(
        serialize_user(user),
        status=200,
    )


@csrf_protect
@require_POST
def register_view(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(
            {
                "detail": "Nieprawidłowe dane.",
            },
            status=400,
        )

    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    password_repeat = data.get("password_repeat", "")

    if not username:
        return JsonResponse(
            {
                "detail": "Podaj nazwę użytkownika.",
            },
            status=400,
        )

    if not email:
        return JsonResponse(
            {
                "detail": "Podaj adres e-mail.",
            },
            status=400,
        )

    if not password:
        return JsonResponse(
            {
                "detail": "Podaj hasło.",
            },
            status=400,
        )

    if password != password_repeat:
        return JsonResponse(
            {
                "detail": "Hasła nie są takie same.",
            },
            status=400,
        )

    if User.objects.filter(username=username).exists():
        return JsonResponse(
            {
                "detail": "Użytkownik o takiej nazwie już istnieje.",
            },
            status=409,
        )

    if User.objects.filter(email=email).exists():
        return JsonResponse(
            {
                "detail": "Konto z tym adresem e-mail już istnieje.",
            },
            status=409,
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
    )

    # NIE tworzymy tutaj Profile.
    # Profile powinien utworzyć signal z Issue #5.

    return JsonResponse(
        {
            "detail": "Konto zostało utworzone.",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        },
        status=201,
    )


@require_GET
def current_user_view(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {
                "detail": "Użytkownik nie jest zalogowany.",
            },
            status=401,
        )

    return JsonResponse(
        serialize_user(request.user),
        status=200,
    )


@csrf_protect
@require_POST
def logout_view(request):
    logout(request)

    return JsonResponse({
        "detail": "Wylogowano.",
    })