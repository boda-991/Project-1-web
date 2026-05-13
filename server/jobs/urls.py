from django.urls import path
from .views import AdminJobListView, AdminJobStatsView, JobDetailView, JobListView

urlpatterns = [
    path('admin/', AdminJobListView.as_view(), name='admin-job-list'),
    path('admin/stats/', AdminJobStatsView.as_view(), name='admin-job-stats'),
    path('', JobListView.as_view(), name='job-list'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
]
