from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class RegistrationForm(forms.ModelForm):
    password = forms.CharField(strip=False)
    password_repeat = forms.CharField(strip=False)
    email = forms.EmailField(max_length=254, required=True)

    class Meta:
        model = User
        fields = ("username", "email")

    def clean_email(self):
        email = User.objects.normalize_email(self.cleaned_data["email"])
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError("Konto z tym adresem e-mail już istnieje.")
        return email

    def clean(self):
        cleaned = super().clean()
        password = cleaned.get("password")
        if password and password != cleaned.get("password_repeat"):
            self.add_error("password_repeat", "Hasła nie są takie same.")
        if password:
            candidate = User(username=cleaned.get("username", ""), email=cleaned.get("email", ""))
            try:
                validate_password(password, candidate)
            except forms.ValidationError as error:
                self.add_error("password", error)
        return cleaned
