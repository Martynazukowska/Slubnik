from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone


def serialize_wedding(wedding):
    amounts = wedding.budget_items.aggregate(
        planned=Sum("planned_amount"), spent=Sum("paid_amount"),
    )
    planned = amounts["planned"] or Decimal("0")
    spent = amounts["spent"] or Decimal("0")
    return {
        "id": wedding.pk,
        "wedding_date": wedding.wedding_date.isoformat(),
        "city": wedding.city,
        "guest_count": wedding.guest_count,
        "planned_budget": format(wedding.planned_budget, ".2f"),
        "created_by": {
            "id": wedding.created_by_id,
            "username": wedding.created_by.username,
        },
        "created_at": wedding.created_at.isoformat(),
        "days_until_wedding": (wedding.wedding_date - timezone.localdate()).days,
        "budget_summary": {
            "planned": format(planned, ".2f"),
            "spent": format(spent, ".2f"),
            # Remaining allocation, not the unpaid balance.
            "remaining": format(wedding.planned_budget - planned, ".2f"),
        },
    }
