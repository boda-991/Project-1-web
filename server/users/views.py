from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import render

User = get_user_model()



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class UserInfoView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({
            'username': user.username,
            'is_admin': user.is_admin,
            'company': user.company,
        })
        
def login_register(request):
    return render(request, 'Login_register.html')

def landing(request):
    return render(request, 'landing.html')