from rest_framework.generics import ListAPIView
from .models import Job
from .serializers import JobSerializer

class JobListView(ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer #convert from python to json 
