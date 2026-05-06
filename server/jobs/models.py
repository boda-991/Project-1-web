from django.db import models
from django.conf import settings

class Job(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    responsibilities = models.JSONField(default=list)
    skills = models.JSONField(default=list)
    date = models.DateTimeField(auto_now_add=True)
    working_hours = models.CharField(max_length=100)
    experience = models.IntegerField()