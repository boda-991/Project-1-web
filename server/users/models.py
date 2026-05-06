from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    company = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False)
    REQUIRED_FIELDS = ['email']