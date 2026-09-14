import json

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.db import IntegrityError, transaction
from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from .forms import RegistrationForm
from .serializers import serialize_user

User = get_user_model()


def read_json(request, fields):
    try:
        data = json.loads(request.body)
    except (ValueError, UnicodeDecodeError):
        return None
    if not isinstance(data, dict):
        return None
    if any(not isinstance(data.get(field, ""), str) for field in fields):
        return None
    return data


@never_cache
@ensure_csrf_cookie
@require_GET
def csrf_view(request):
    return JsonResponse({"detail": "CSRF cookie set"})


@never_cache
@csrf_protect
@require_POST
def login_view(request):
    data = read_json(request, ("username", "password"))
    if data is None:
        return JsonResponse({"detail": "Nieprawidłowe dane."}, status=400)
    username = data.get("username", "").strip()
    password = data.get("password", "")
    if not username or not password:
        return JsonResponse({"detail": "Podaj nazwę użytkownika i hasło."}, status=400)
    user = authenticate(request=request, username=username, password=password)
    if user is None:
        return JsonResponse({"detail": "Nieprawidłowa nazwa użytkownika lub hasło."}, status=401)
    login(request, user)
    return JsonResponse(serialize_user(user))


@never_cache
@csrf_protect
@require_POST
def register_view(request):
    data = read_json(request, ("username", "email", "password", "password_repeat"))
    if data is None:
        return JsonResponse({"detail": "Nieprawidłowe dane."}, status=400)
    form = RegistrationForm(data)
    if not form.is_valid():
        return JsonResponse({
            "detail": " ".join(message for messages in form.errors.values() for message in messages),
            "errors": form.errors.get_json_data(),
        }, status=400)
    try:
        with transaction.atomic():
            user = User.objects.create_user(
                username=form.cleaned_data["username"],
                email=form.cleaned_data["email"],
                password=form.cleaned_data["password"],
            )
    except IntegrityError:
        return JsonResponse({"detail": "Nie udało się utworzyć konta. Dane mogą być już zajęte."}, status=409)
    return JsonResponse({"detail": "Konto zostało utworzone.", "user": serialize_user(user)}, status=201)


@never_cache
@require_GET
def current_user_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Użytkownik nie jest zalogowany."}, status=401)
    return JsonResponse(serialize_user(request.user))


@never_cache
@csrf_protect
@require_POST
def logout_view(request):
    logout(request)
    return JsonResponse({"detail": "Wylogowano."})
