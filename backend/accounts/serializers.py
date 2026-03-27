from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from medical.models import ChildProfile

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "phone",
            "city",
            "profession",
            "hospital_code",
        ]


class ChildProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChildProfile
        fields = [
            "id",
            "first_name",
            "last_name",
            "birth_date",
            "gender",
            "blood_type",
            "allergies",
            "notes",
            "hospital",
            "assigned_doctor",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)
    child = ChildProfileSerializer(required=False)

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "confirm_password",
            "first_name",
            "last_name",
            "role",
            "phone",
            "city",
            "profession",
            "hospital_code",
            "child",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("confirm_password"):
            raise serializers.ValidationError({"confirm_password": "Les mots de passe ne correspondent pas."})
        return attrs

    def create(self, validated_data):
        child_data = validated_data.pop("child", None)
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)

        if child_data and user.role == User.Role.PARENT:
            ChildProfile.objects.create(parent=user, **child_data)

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        request = self.context.get("request")
        user = authenticate(request=request, username=attrs["email"], password=attrs["password"])

        if not user:
            raise serializers.ValidationError({"detail": "Identifiants invalides."})
        if not user.is_active:
            raise serializers.ValidationError({"detail": "Compte inactif."})

        refresh = RefreshToken.for_user(user)
        attrs["user"] = user
        attrs["tokens"] = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        return attrs
