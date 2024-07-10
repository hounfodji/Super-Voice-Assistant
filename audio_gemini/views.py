from django.shortcuts import render

# Create your views here.
import os
import google.generativeai as genai
from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import speech_recognition as sr
from pydub import AudioSegment
import io

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-pro")
chat = model.start_chat(history=[])

def index(request):
    return render(request, 'audio_gemini/index.html')

@csrf_exempt
def record_audio(request):
    if request.method == 'POST':
        audio_file = request.FILES.get('audio')
        if audio_file:
            try:
                # Read the audio data
                audio_data = audio_file.read()
                
                # Convert the audio data to WAV format
                audio = AudioSegment.from_file(io.BytesIO(audio_data), format="webm")
                wav_data = io.BytesIO()
                audio.export(wav_data, format="wav")
                wav_data.seek(0)
                
                # Use speech recognition on the WAV data
                recognizer = sr.Recognizer()
                with sr.AudioFile(wav_data) as source:
                    audio = recognizer.record(source)
                
                text = recognizer.recognize_google(audio)
                return JsonResponse({'success': True, 'text': text})
            except sr.UnknownValueError:
                return JsonResponse({'success': False, 'error': 'Could not understand audio'})
            except sr.RequestError as e:
                return JsonResponse({'success': False, 'error': f'Error with the speech recognition service: {str(e)}'})
            except Exception as e:
                return JsonResponse({'success': False, 'error': f'An error occurred: {str(e)}'})
    
    return JsonResponse({'success': False, 'error': 'Invalid request'})


@csrf_exempt
@require_http_methods(["POST"])
def process_audio(request):
    if request.method == 'POST':
        text = request.POST.get('text')
        if text:
            response = chat.send_message(text)
            return JsonResponse({'success': True, 'response': response.text, 'should_speak': True})
    
    return JsonResponse({'success': False, 'error': 'Invalid request'})
