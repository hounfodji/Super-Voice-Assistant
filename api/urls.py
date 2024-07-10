from django.urls import path
from .views import RecordAudioView, ProcessAudioView

urlpatterns = [
    path('record/', RecordAudioView.as_view(), name='record_audio'),
    path('process/', ProcessAudioView.as_view(), name='process_audio'),
]