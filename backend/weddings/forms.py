from decimal import Decimal

from django import forms
from django.utils import timezone

from .models import Wedding


class WeddingForm(forms.ModelForm):
    wedding_date = forms.DateField(input_formats=["%Y-%m-%d"])
    guest_count = forms.IntegerField(min_value=1, max_value=2147483647)
    planned_budget = forms.DecimalField(
        min_value=Decimal("0.01"), max_digits=12, decimal_places=2,
    )

    class Meta:
        model = Wedding
        fields = ("wedding_date", "city", "guest_count", "planned_budget")

    def clean_wedding_date(self):
        value = self.cleaned_data["wedding_date"]
        if value <= timezone.localdate():
            raise forms.ValidationError("Data ślubu musi być w przyszłości.")
        return value
