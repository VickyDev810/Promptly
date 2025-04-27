# TechNexus - Smart StackOverflow with AI

TechNexus is a modern, AI-powered technical Q&A platform that combines the intelligence of large language models with community expertise. This application provides instant answers to technical questions when possible, and escalates complex questions to human experts when needed.

![TechNexus Screenshot](screenshot.png)

## Features

- 🤖 **AI-Powered Answers**: Get instant responses to your technical questions using Google's Gemini 2.0 Flash
- 🧠 **Smart Confidence Assessment**: The AI evaluates its confidence, escalating complex questions
- 🏷️ **Automatic Tagging**: Questions are automatically categorized with relevant tags
- 👥 **Community Expertise**: Engage with experts for questions that require human insight
- 🌙 **Dark Futuristic UI**: Beautiful, modern interface with a dark theme
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Smart Escalation

One of the key features of TechNexus is its ability to determine when a question is best answered by AI or by human experts:

1. **High Confidence (>75%)**: The AI provides an immediate answer
2. **Low Confidence (<50%)**: The question is automatically flagged for community attention
3. **Medium Confidence (50-75%)**: The AI provides a response but flags it for potential review
4. **User Override**: Users can always escalate a question to the community if they're not satisfied with the AI response

## Tech Stack

- **Frontend**: React, TypeScript, Material-UI, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **AI Integration**: Google Gemini 2.0 Flash API
- **UI Theme**: Dark futuristic design with neon accents

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/technexus.git
cd technexus
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Configure the backend:
Create a `.env` file in the backend directory:
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

5. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

6. Open your browser and navigate to `http://localhost:3000`

## Future Enhancements

- User authentication and personalized dashboards
- Reputation and reward system for community contributors
- Advanced analytics for question topics and trends
- Integrated code editor for code snippets
- Integration with version control systems like GitHub

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Created for the Hackhazard project
- Inspired by the community-driven spirit of StackOverflow
- Powered by Google's Gemini 2.0 Flash
