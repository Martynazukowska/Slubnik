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

class AuthApiTests(TestCase):
    def post_json(self, endpoint, data):
        import json
        return self.client.post("/api/auth/" + endpoint + "/", json.dumps(data),
                                content_type="application/json")

    def registration(self, **changes):
        data = dict(username="martyna", email="martyna@example.com",
                    password="Very-Strong-Wedding-482!", password_repeat="Very-Strong-Wedding-482!")
        data.update(changes)
        return self.post_json("register", data)

    def test_register_login_session_logout(self):
        self.assertEqual(self.registration().status_code, 201)
        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 401)
        response = self.post_json("login", dict(username="martyna", password="Very-Strong-Wedding-482!"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.client.get("/api/auth/me/").json()["username"], "martyna")
        self.assertEqual(self.post_json("logout", {}).status_code, 200)
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 401)

    def test_invalid_payloads_return_400(self):
        for endpoint in ("login", "register"):
            for data in (None, [], "text", {"username": 12}, {"password": None}):
                with self.subTest(endpoint=endpoint, data=data):
                    self.assertEqual(self.post_json(endpoint, data).status_code, 400)
            response = self.client.post("/api/auth/" + endpoint + "/", "{", content_type="application/json")
            self.assertEqual(response.status_code, 400)

    def test_invalid_registration_does_not_create_user(self):
        for changes in (
            {"email": "invalid"}, {"username": "bad name"},
            {"username": "a" * 151}, {"password": "123", "password_repeat": "123"},
            {"password_repeat": "different"},
        ):
            with self.subTest(changes=changes):
                self.assertEqual(self.registration(**changes).status_code, 400)
                self.assertEqual(User.objects.count(), 0)

    def test_duplicate_email_ignores_case(self):
        self.assertEqual(self.registration().status_code, 201)
        self.assertEqual(self.registration(username="other", email="MARTYNA@example.com").status_code, 400)
        self.assertEqual(User.objects.count(), 1)

    def test_login_failure_does_not_disclose_account_existence(self):
        self.registration()
        missing = self.post_json("login", {"username": "missing", "password": "wrong"})
        existing = self.post_json("login", {"username": "martyna", "password": "wrong"})
        self.assertEqual(missing.status_code, 401)
        self.assertEqual(existing.status_code, 401)
        self.assertEqual(missing.json(), existing.json())

    def test_csrf_required_and_valid_token_accepted(self):
        from django.test import Client
        client = Client(enforce_csrf_checks=True)
        for endpoint in ("login", "register", "logout"):
            self.assertEqual(client.post("/api/auth/" + endpoint + "/", {}, content_type="application/json").status_code, 403)
        response = client.get("/api/auth/csrf/")
        self.assertIn("csrftoken", response.cookies)
        response = client.post("/api/auth/logout/", {}, content_type="application/json",
                               HTTP_X_CSRFTOKEN=client.cookies["csrftoken"].value)
        self.assertEqual(response.status_code, 200)
