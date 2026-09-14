from django.conf import settings
from django.db import models


class Wedding(models.Model):
    wedding_date = models.DateField()

    city = models.CharField(
        max_length=150,
    )

    guest_count = models.PositiveIntegerField()

    planned_budget = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="weddings",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.city} - {self.wedding_date}"


class BudgetItem(models.Model):
    wedding = models.ForeignKey(
        Wedding,
        on_delete=models.CASCADE,
        related_name="budget_items",
    )

    name = models.CharField(
        max_length=200,
    )

    planned_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    paid_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )