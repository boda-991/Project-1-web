from django.contrib import admin
from users.models import User
from applications.models import Application
from jobs.models import Job
# Register your models here.
admin.site.register(User)
admin.site.register(Application)
admin.site.register(Job)