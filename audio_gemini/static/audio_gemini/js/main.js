let mediaRecorder;
let audioChunks = [];
let synthesis = window.speechSynthesis;

$(document).ready(function() {
    $('#startRecording').click(startRecording);
    $('#stopRecording').click(stopRecording);
});

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorder.start();

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            $('#startRecording').prop('disabled', true);
            $('#stopRecording').prop('disabled', false);
        });
}

function stopRecording() {
    mediaRecorder.stop();
    $('#stopRecording').prop('disabled', true);
    $('#startRecording').prop('disabled', false);

    mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        $.ajax({
            url: '/record/',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                if (data.success) {
                    addMessageToConversation('user', data.text);
                    processAudio(data.text);
                } else {
                    $('#result').text("Error: " + data.error);
                }
            }
        });

        audioChunks = [];
    });
}

function processAudio(text) {
    $.ajax({
        url: '/process/',
        type: 'POST',
        data: { text: text },
        success: function(data) {
            if (data.success) {
                addMessageToConversation('ai', data.response);
                if (data.should_speak) {
                    speakText(data.response);
                }
            } else {
                $('#result').append("<br>Error: " + data.error);
            }
        }
    });
}

function speakText(text) {
    synthesis.cancel();
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    synthesis.speak(utterance);
}

function addMessageToConversation(sender, message) {
    const messageElement = $('<div>').addClass(sender + '-message').text(message);
    $('#conversation').append(messageElement);
    $('#conversation').scrollTop($('#conversation')[0].scrollHeight);
}