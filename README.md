# 🚀 Promptly

**Promptly** is a modular AI-driven question intelligence system that ingests developer questions from sources like Reddit, Stack Overflow, GitHub Issues, and internal logs. It classifies, clusters, and ranks questions in real-time — with structured JSON responses and LLM-based insights. Powered by Fluvio/Kafka and OLLAMA, Promptly helps identify documentation gaps, improve support workflows, and auto-triage questions.

---

## 🧠 Features

- **Structured LLM Analysis** (via Ollama or Gemini):
  - Confidence scoring
  - Intelligent auto-escalation
  - Contextual tags (technology, topic, OS, etc.)

- **Few-shot Learning**
  - Uses few-shot examples to teach the model how to respond reliably

- **Fluvio (or Kafka) Streaming Support**
  - Real-time question ingestion and streaming pipeline
  - Custom SmartModules for classification, ranking, and clustering

- **JSON Output Format**
  - Consistent, machine-readable output for downstream automation

- **Modular Design**
  - `.env` driven config
  - Easy switch between local Ollama and Gemini APIs

---

## 📁 Project Structure

```
promptly/
│
├── llm_core/
│   ├── prompt_builder.py         # Few-shot prompt + prompt generator
│   ├── llm_client.py             # LLM query logic (Ollama / Gemini)
│   └── analyzer.py               # End-to-end handler: builds prompt, queries, parses
│
├── main.py                       # CLI interface to test LLM analysis
├── .env                          # Configuration file
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/promptly.git
cd promptly
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Create a `.env` file in the root:

```dotenv
# .env
OLLAMA_URL=http://localhost:11434/api/generate
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
GEMINI_API_KEY=your_api_key_here
USE_PROVIDER=ollama   # or gemini
MODEL_NAME=mistral    # change to llama2, gemma, etc.
```

---

