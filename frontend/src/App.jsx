import { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState([]);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = handleAudioData;
      
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing the microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioData = async () => {
    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const response = await axios.post('http://localhost:8000/api/record/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        addMessageToConversation('user', response.data.text);
        await processAudio(response.data.text);
      } else {
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    audioChunks.current = [];
  };

  const processAudio = async (text) => {
    try {
      const response = await axios.post('http://localhost:8000/api/process/', { text });
      
      if (response.data.success) {
        addMessageToConversation('ai', response.data.response);
        if (response.data.should_speak) {
          speakText(response.data.response);
        }
      } else {
        console.error("Error:", response.data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addMessageToConversation = (sender, message) => {
    setConversation(prev => [...prev, { sender, message }]);
  };

  const speakText = (text) => {
    const synthesis = window.speechSynthesis;
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    synthesis.speak(utterance);
  };

  return (
    <div className="container">
      <h1>Voice Assistant</h1>
      <div className="controls">
        <button id="startRecording" onClick={startRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button id="stopRecording" onClick={stopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
      </div>
      <div id="conversation">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}-message`}>
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;