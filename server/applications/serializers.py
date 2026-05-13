from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    job_title = serializers.ReadOnlyField(source='job.title')
    job_company = serializers.ReadOnlyField(source='job.company')
    class Meta:
        model = Application
        fields = ['id', 'job', 'job_title', 'job_company', 'username', 'date', 'form_data', 'status']