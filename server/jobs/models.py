from django.db import models
from django.conf import settings

class Job(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    responsibilities = models.JSONField(default=list)
    skills = models.JSONField(default=list)
    date = models.DateTimeField(auto_now_add=True)
    working_hours = models.CharField(max_length=100)
    experience = models.IntegerField()
    status = models.CharField(max_length=20, default="Open")
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.title
