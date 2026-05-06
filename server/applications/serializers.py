from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Application
        fields = ['id', 'job', 'username', 'date', 'form_data']