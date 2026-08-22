# Sarthi — Multilingual AI Government Benefits Copilot

> **Beyond a Generic Scheme Chatbot**: Empowering citizens with grounded policy resolution, proactive welfare matching, voice-first accessibility, multi-turn session profiling, and WhatsApp-native communication.

---

## Key Capabilities and Innovation Pillars

Sarthi is engineered to solve critical accessibility barriers in government welfare distribution:

### 1. 3-Mode Intelligent Conversational Engine
* **Mode 1 (Greeting and General Chat)**: Handles casual conversation and greetings via Groq LLM without dumping irrelevant scheme lists.
* **Mode 2 (Proactive Profiling First)**: Detects missing citizen demographics (Age, Category/Caste, State) on scheme inquiries and asks for missing parameters before displaying results.
* **Mode 3 (Customized Bifurcated Recommendations)**: Delivers personalized scheme matches, prioritizing **State Government Schemes first**, followed by **Central Government Schemes**.

### 2. Multi-Turn Session Memory (WhatsApp and Web)
* Tracks citizen profile updates across multiple conversation turns.
* Follow-up messages (e.g., "17 Punjab Gen") automatically merge into the user session state to unlock tailored scheme results.

### 3. Google Page Translate Integration
* Embedded translate dropdown accessible across every page via the top navigation bar (`SiteNav`).
* Supports real-time page translation into major Indian languages including Hindi, Punjabi, Bengali, Marathi, Gujarati, Tamil, Telugu, Malayalam, Kannada, Odia, Assamese, and Urdu.

### 4. WhatsApp-First Native Access
* Powered by Twilio Webhooks and TwiML formatting for instant rich-text WhatsApp interaction.
* Built for high reach among rural and low-income populations.

### 5. Voice-First Regional Q&A
* Direct speech-to-text input via browser Web Speech API (`en-IN` and `hi-IN`).
* Built for citizens with low literacy or regional language preferences.

### 6. Proactive Scheme Matching Engine
* Evaluates saved citizen profiles against newly launched policies.
* Automatically dispatches proactive WhatsApp and SMS alerts before application deadlines close.

### 7. "Explain Simply" Mode
* Rewrites dense legal policy clauses into 5th-grade reading level plain language.
* Converts technical eligibility rules into clear, actionable takeaways.

### 8. Docs and CSC Locator
* Finds the nearest physical Common Service Centre (CSC) by pincode or district.
* Provides exact addresses, VLE contact details, working hours, and navigation details.

### 9. Trust Signals and Policy Grounding
* **100% Grounded RAG Response**: Cites official policy clauses and official portal links (`myscheme.gov.in`).
* Displays verification dates, source guidelines, and physical verification disclaimers.

---

## Hugging Face Dataset Integration

Sarthi dynamically ingests official scheme datasets from Hugging Face:
- **Dataset**: [shrijayan/gov_myscheme](https://huggingface.co/datasets/shrijayan/gov_myscheme)
- Automatically indexes official policy guidelines and scheme metadata into TF-IDF vector embeddings on startup.

---

## Technology Stack

- **Frontend**: Next.js 16 (App Router), React, TailwindCSS, Lucide Icons, ReactMarkdown, Web Speech API
- **Backend API**: Python FastAPI, Uvicorn, Python-Multipart, PyYAML
- **AI / RAG Pipeline**: Groq LLaMA LLM (`groq/compound-mini`), Hybrid Vector Search (`SemanticSearchEngine`), scikit-learn TF-IDF
- **Communication and Infrastructure**: Twilio Webhooks (WhatsApp/SMS), Cloudflare Tunnels

---

## Quickstart and Local Setup

### 1. Clone and Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
pip install -r backend/requirements.txt
```

### 2. Configure Environment Variables (.env)

Create a `.env` file in the root directory:

```env
# Twilio Integration Secrets
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+18005550199
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Groq Fast LLM API Key (https://console.groq.com)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Backend Configuration
PORT=8000
HOST=0.0.0.0
CORS_ORIGINS=http://localhost:3000
```

### 3. Run Backend and Frontend Servers

**Terminal 1 — FastAPI Backend (Port 8000):**
```bash
python -m uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 — Next.js Frontend (Port 3000):**
```bash
npm run dev
```

**Terminal 3 — Cloudflare Tunnel (Twilio WhatsApp Webhook):**
```powershell
C:\Users\Lenovo\Desktop\cloudflared.exe tunnel --url http://localhost:8000
```
> Copy the generated tunnel URL (e.g., `https://<subdomain>.trycloudflare.com`) and update your Twilio WhatsApp Sandbox Webhook URL to:  
> `https://<subdomain>.trycloudflare.com/api/twilio/webhook`

---

## 7-Layer End-to-End System Diagnostic

Run the automated diagnostic suite to verify all system layers:

```bash
python test_system.py
```

### Diagnostic Results Summary
- **Test 1 (Env Keys)**: Groq and Twilio SID validation: PASSED
- **Test 2 (Data Store)**: Hugging Face `shrijayan/gov_myscheme` dynamic loader: PASSED
- **Test 3 (Vector Search)**: Semantic TF-IDF vector embeddings: PASSED
- **Test 4 (RAG Copilot)**: Groq LLM synthesis and 3-mode response generation: PASSED
- **Test 5 (CSC Locator)**: Nearest CSC center matching and proactive alerts: PASSED
- **Test 6 (Twilio Webhook)**: TwiML XML formatting and WhatsApp multi-turn session processing: PASSED
- **Test 7 (FastAPI App)**: All 34 backend API endpoints mounted: PASSED

---
#future scope 
 ** add telegram and other channels.
 
## License
MIT License. Built for Bharat Buildathon 2026.
