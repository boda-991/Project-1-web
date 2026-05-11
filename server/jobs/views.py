from rest_framework.generics import ListAPIView, RetrieveAPIView
from .models import Job
from .serializers import JobSerializer

class JobListView(ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer #convert from python to json 

class JobDetailView(RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
