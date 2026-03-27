from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from medical.models import ChildProfile

from .models import User
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        headers = self.get_success_headers(serializer.data)
        payload = {
            "message": "Compte cree avec succes.",
            "user": UserSerializer(user).data,
            "children": [
                {
                    "id": child.id,
                    "first_name": child.first_name,
                    "last_name": child.last_name,
                }
                for child in ChildProfile.objects.filter(parent=user)
            ],
        }
        return Response(payload, status=status.HTTP_201_CREATED, headers=headers)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return Response(
            {
                "message": "Connexion reussie.",
                "user": UserSerializer(serializer.validated_data["user"]).data,
                "tokens": serializer.validated_data["tokens"],
            }
        )


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        children = ChildProfile.objects.filter(parent=request.user)
        return Response(
            {
                "user": UserSerializer(request.user).data,
                "children": [
                    {
                        "id": child.id,
                        "first_name": child.first_name,
                        "last_name": child.last_name,
                        "birth_date": child.birth_date,
                        "gender": child.gender,
                    }
                    for child in children
                ],
            }
        )
