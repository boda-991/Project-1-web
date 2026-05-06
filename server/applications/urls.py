from django.urls import path
from .views import ApplicationListCreate, ApplicationDetail

urlpatterns = [
    path('', ApplicationListCreate.as_view(), name='app-list'),
    path('<int:pk>/', ApplicationDetail.as_view(), name='app-detail'),
]