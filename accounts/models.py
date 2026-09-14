from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class User(AbstractUser): 
    pass

class Profile(models.Model): 
    user = models.OneToOneField( 
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="profile", 
        ) 
    partner_name = models.CharField( 
        max_length=100, 
        blank=True, 
        ) 
    created_at = models.DateTimeField( 
        auto_now_add=True, 
        ) 
    updated_at = models.DateTimeField( 
        auto_now=True, 
        ) 
    
    def __str__(self): 
        return f"Profile: {self.user.username}"