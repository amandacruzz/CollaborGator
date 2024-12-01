from django.urls import path
from . import views
from .views import UserProfileView


urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('projects/', views.project_list, name='projects'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),

]
