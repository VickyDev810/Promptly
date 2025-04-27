# Promptly Backend

This is the backend server for the Promptly application, which integrates with Google's Gemini 2.0 Flash model to provide AI-powered responses to technical questions.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file at the root of the backend directory with the following variables:
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Questions

- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get a question by ID
- `POST /api/questions` - Ask a new question

### Post Question Request Format

```json
{
  "question": "Your technical question here"
}
```

### Response Format

```json
{
  "confidence": 0.92,
  "answer": "Detailed answer to the question...",
  "escalate_to_human": false,
  "tags": ["javascript", "react", "hooks"]
}
```

## Technology Stack

- Node.js with Express
- TypeScript
- Google Generative AI SDK for Gemini integration 