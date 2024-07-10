# Django-Voice-Assistant
## Description
Django-Voice-Assistant is a full-stack web application that creates a customizable voice assistant. It combines a Django backend with a React frontend, allowing users to interact with an AI-powered assistant through audio recordings. The application leverages the power of a chosen AI solution (e.g., Gemini or others) to foster engaging conversational experiences.
## Features
- Audio recording and playback
- Speech-to-text conversion
- AI-powered responses
- Text-to-speech output
- Real-time chat interface
## Prerequisites
Before you begin, ensure you have met the following requirements:
- **Python 3.x:** Download and install from [python.org](https://www.python.org/downloads/)
- **Node.js and npm:** Download and install from [nodejs.org](https://nodejs.org/)
- **Git:** Download and install from [git-scm.com](https://git-scm.com/)
## Installation
### Backend (Django)
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Django-Voice-Assistant.git
   cd Django-Voice-Assistant
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your environment variables:
   Create a `.env` file in the root directory and add your AI API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
### Frontend (React)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required npm packages:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
## Usage
1. Open your web browser and go to `http://localhost:5173` to access the React frontend.
2. Click the "Start Recording" button to begin recording your voice.
3. Speak your query or command.
4. Click "Stop Recording" when you're done speaking.
5. The application will process your audio, convert it to text, send it to the AI for processing, and display the response.
6. The AI's response will be displayed in the chat interface and spoken aloud.
## API Endpoints
- `POST /api/record/`: Accepts audio recordings and returns the transcribed text.
- `POST /api/process/`: Accepts text input and returns the AI-generated response.
## Contributing
Contributions to the Django-Voice-Assistant project are welcome. Please follow these steps:
1. Fork the repository.
2. Create a new branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.
Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).
## License
This project uses the following license: [MIT License](https://opensource.org/licenses/MIT).
## Contact
If you want to contact me, you can reach me at <hospicehounfodjil@gmail.com>.
## Acknowledgements
- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)
- [Google Generative AI](https://ai.google.dev/)