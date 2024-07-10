from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
from django.conf import settings
import speech_recognition as sr
from pydub import AudioSegment
import io

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-pro")
chat = model.start_chat(history=[])

class RecordAudioView(APIView):
    def post(self, request):
        audio_file = request.FILES.get('audio')
        if audio_file:
            try:
                audio_data = audio_file.read()
                audio = AudioSegment.from_file(io.BytesIO(audio_data), format="webm")
                wav_data = io.BytesIO()
                audio.export(wav_data, format="wav")
                wav_data.seek(0)
                
                recognizer = sr.Recognizer()
                with sr.AudioFile(wav_data) as source:
                    audio = recognizer.record(source)
                
                text = recognizer.recognize_google(audio)
                return Response({'success': True, 'text': text})
            except Exception as e:
                return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'success': False, 'error': 'No audio file provided'}, status=status.HTTP_400_BAD_REQUEST)

class ProcessAudioView(APIView):
    def post(self, request):
        text = request.data.get('text')
        if text:
            response = chat.send_message(text)
            return Response({'success': True, 'response': response.text, 'should_speak': True})
        
        return Response({'success': False, 'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)