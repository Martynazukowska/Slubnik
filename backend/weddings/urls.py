from django.urls import path
from . import views


urlpatterns = [
    path(
        "create/",
        views.create_wedding_view,
        name="create-wedding",
    ),

    path(
        "current/",
        views.current_wedding_view,
        name="current-wedding",
    ),

    path(
        "current/edit/",
        views.update_wedding_view,
        name="update-wedding",
    ),

    path(
        "current/delete/",
        views.delete_wedding_view,
        name="delete-wedding",
    ),
]