from django.urls import path
from . import views
urlpatterns = [
    path('login_register',views.RegisterView.as_view(),name='Login_register'),

    path('', views.landing, name='landing'),
    path('login-register/', views.login_register, name='login-register_page'),  
    
]