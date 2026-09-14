"""Isolated tests: no PostgreSQL connection or real credentials required."""
import os

os.environ.setdefault("DJANGO_SECRET_KEY", "test-only-not-for-deployment")

from .settings import *  # noqa: F403, E402

SECRET_KEY = "test-only-not-for-deployment"
DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}}
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
