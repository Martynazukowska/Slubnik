from django.contrib.auth import get_user_model 
from django.test import TestCase 
from .models import Profile 

User = get_user_model() 

class ProfileModelTests(TestCase): 
    def test_profile_is_created_when_user_is_created(self): 
        user = User.objects.create_user( 
            username="testuser", 
            password="Test12345!", 
            ) 
        self.assertTrue( Profile.objects.filter(user=user).exists() ) 
    def test_user_can_access_profile(self): 
        user = User.objects.create_user( 
            username="testuser", 
            password="Test12345!", 
            ) 
        self.assertEqual( user.profile.user, user, )