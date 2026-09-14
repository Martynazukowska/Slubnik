from .models import Profile


def serialize_user(user):
    try:
        partner_name = user.profile.partner_name
    except Profile.DoesNotExist:
        partner_name = ""
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "profile": {"partner_name": partner_name},
    }
