from django.urls import path
from .views import AdminJobListCreateView, AdminJobStatsView, JobDetailView, JobListView
from . import views
urlpatterns = [
    path('adminAction/', AdminJobListCreateView.as_view(), name='admin-job-list-create'),
    path('admin/stats/', AdminJobStatsView.as_view(), name='admin-job-stats'),
    path('', JobListView.as_view(), name='job-list'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    
    path('adminDashboard/',views.adminDashboard,name='admin-dashboard'),
    
    path('add-job/',views.add_job,name='add-job'),
    path('edit-job/',views.edit_job,name='edit-job'),
    path('add-edit-job/',views.add_edit_job,name='add-edit-job'),
    
    path('job-details/',views.job_details,name='job-details'),
    path('jobs/',views.jobs,name='jobs'),
    path('my-jobs/',views.my_jobs,name='my-jobs'),
]
