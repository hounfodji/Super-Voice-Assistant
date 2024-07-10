from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('record/', views.record_audio, name='record_audio'),
    path('process/', views.process_audio, name='process_audio'),
]