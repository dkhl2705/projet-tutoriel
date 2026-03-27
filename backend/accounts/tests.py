from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthenticationFlowTests(APITestCase):
    def test_register_then_login(self):
        register_payload = {
            "email": "parent@example.com",
            "password": "secret123",
            "confirm_password": "secret123",
            "first_name": "Amina",
            "last_name": "Mbarga",
            "role": "parent",
            "phone": "+237600000000",
            "city": "Douala",
            "child": {
                "first_name": "Sophie",
                "last_name": "Mbarga",
                "birth_date": "2024-01-10",
                "gender": "fille",
                "blood_type": "O+",
                "allergies": "",
                "notes": "",
            },
        }
        register_response = self.client.post(reverse("register"), register_payload, format="json")
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(register_response.data["user"]["email"], "parent@example.com")
        self.assertEqual(len(register_response.data["children"]), 1)

        login_response = self.client.post(
            reverse("login"),
            {"email": "parent@example.com", "password": "secret123"},
            format="json",
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn("access", login_response.data["tokens"])
        self.assertEqual(login_response.data["user"]["role"], "parent")
