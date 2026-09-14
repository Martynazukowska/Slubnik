from django.contrib.auth import get_user_model
from django.db import transaction

from .models import Wedding


class WeddingAlreadyExists(Exception):
    pass


@transaction.atomic
def create_wedding(*, user, cleaned_data):
    # Lock a row that exists even before the first wedding. PostgreSQL serializes
    # concurrent requests for the same owner without changing the approved model.
    owner = get_user_model().objects.select_for_update().get(pk=user.pk)
    if Wedding.objects.filter(created_by=owner).exists():
        raise WeddingAlreadyExists
    return Wedding.objects.create(created_by=owner, **cleaned_data)
