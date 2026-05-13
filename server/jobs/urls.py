from django.urls import path
from .views import AdminJobListCreateView, AdminJobStatsView, JobDetailView, JobListView

urlpatterns = [
    path('admin/', AdminJobListCreateView.as_view(), name='admin-job-list-create'),
    path('admin/stats/', AdminJobStatsView.as_view(), name='admin-job-stats'),
    path('', JobListView.as_view(), name='job-list'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
]
