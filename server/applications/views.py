from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Application
from .serializers import ApplicationSerializer
from users.permissions import IsOwner

class ApplicationListCreate(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    
    def get_permissions(self):
        # Only authenticated users can see or create applications
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            # Admins see applications for jobs they posted
            return Application.objects.filter(job__user=user)
        # Regular users see only their own applications
        return Application.objects.filter(user=user)

    def perform_create(self, serializer):
        if Application.objects.filter(user=self.request.user, job_id=self.request.data.get('job')).exists():
            raise ValidationError({"detail": "You have already applied for this job."})
    
        serializer.save(user=self.request.user)

class ApplicationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsOwner]