from rest_framework import permissions
from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from applications.models import Application
from .models import Job
from .serializers import JobSerializer
from users.permissions import IsAdmin

class JobListView(ListAPIView):
    serializer_class = JobSerializer #convert from python to json 
    
    def get_queryset(self):
        return Job.objects.filter(deleted=False)

class JobDetailView(RetrieveDestroyAPIView):
    serializer_class = JobSerializer

    def get_queryset(self):
        if self.request.method == 'GET':
            return Job.objects.filter(deleted=False)
        return Job.objects.filter(user=self.request.user)

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [permissions.IsAuthenticated(), IsAdmin()]
        return [permissions.AllowAny()]

    def perform_destroy(self, instance):
        instance.deleted = True
        instance.status = 'Closed'
        instance.save(update_fields=['deleted', 'status'])

class AdminJobListView(ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_queryset(self):
        return Job.objects.filter(user=self.request.user, deleted=False).order_by('-date')

class AdminJobStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        jobs = Job.objects.filter(user=request.user)
        active_jobs = jobs.filter(deleted=False)
        closed_jobs = jobs.filter(deleted=True) | jobs.filter(status__iexact='Closed')
        total_applications = Application.objects.filter(job__user=request.user).count()

        return Response({
            'totalJobs': jobs.count(),
            'openJobs': active_jobs.exclude(status__iexact='Closed').count(),
            'closedJobs': closed_jobs.distinct().count(),
            'totalApplications': total_applications,
        })
