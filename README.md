# 🇮🇳 Sarthi — Multilingual AI Government Benefits Copilot

> **Beyond a Generic Scheme Chatbot**: Empowering 1.4 Billion citizens with grounded policy resolution, proactive welfare matching, voice-first accessibility, and WhatsApp-native communication.

---

## 🌟 Key Capabilities & Innovation Pillars

Sarthi is engineered to solve critical accessibility barriers in government welfare distribution:

### 1. 📱 WhatsApp-First Native Access
* Higher reach in rural/low-income populations than standalone apps or web portals.
* Powered by **Twilio Webhooks** & TwiML formatting for instant rich-text WhatsApp interaction.

### 2. 🎙️ Voice-First Regional Q&A
* Direct speech-to-text input via browser Web Speech API (`en-IN` & `hi-IN`).
* Built for citizens with low literacy or regional accent nuances.

### 3. ⚡ Proactive Scheme Matching Engine
* Evaluates saved citizen profiles against newly launched policies.
* Automatically dispatches proactive WhatsApp & SMS alerts before application deadlines close.

### 4. 💡 "Explain Simply" Mode
* Rewrites dense legal policy clauses into 5th-grade reading level plain language.
* Converts technical eligibility rules into simple, actionable takeaways.

### 5. 📍 Docs + CSC Locator
* Finds the nearest physical **Common Service Centre (CSC)** by pincode or district.
* Provides exact addresses, VLE contact details, working hours, and Google Maps direction links.

### 6. 🛡️ Trust Signals & Policy Grounding
* **100% Grounded RAG Response**: Every answer cites exact official policy clauses.
* Includes official portal links (`myscheme.gov.in`), `Last-Verified Date`, and physical verification disclaimers.

---

## 🤗 Hugging Face Dataset Integration

Sarthi dynamically ingests official scheme datasets from **Hugging Face**:
- **Dataset**: [`shrijayan/gov_myscheme`](https://huggingface.co/datasets/shrijayan/gov_myscheme)
- Automatically indexes official PDF policy guidelines & scheme metadata into TF-IDF vector embeddings on startup.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router), React, TailwindCSS, Lucide Icons, Web Speech API
- **Backend API**: Python FastAPI, Uvicorn, Python-Multipart
- **AI / RAG Pipeline**: Groq LLaMA 3.3 LLM (`groq/compound-mini`), Hybrid Vector Search (`SemanticSearchEngine`), scikit-learn TF-IDF
- **Communication & Infra**: Twilio Webhooks (WhatsApp/SMS), Cloudflare Tunnels

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
pip install -r backend/requirements.txt
```

### 2. Configure Environment Variables (`.env`)

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

### 3. Run Backend & Frontend Servers

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
# Using the local Cloudflare binary on Desktop:
C:\Users\Lenovo\Desktop\cloudflared.exe tunnel --url http://localhost:8000
```
> Copy the output tunnel URL (e.g. `https://<subdomain>.trycloudflare.com`) and set your Twilio WhatsApp Webhook URL in Twilio Console to:  
> `https://<subdomain>.trycloudflare.com/api/twilio/webhook`

---

## 🧪 7-Layer End-to-End System Diagnostic

Run the automated diagnostic suite to verify all system layers:

```bash
python test_system.py
```

### Diagnostic Results Summary
- **Test 1 (Env Keys)**: Groq & Twilio SID validation ✅
- **Test 2 (Data Store)**: Hugging Face `shrijayan/gov_myscheme` dynamic loader ✅
- **Test 3 (Vector Search)**: Semantic TF-IDF vector embeddings ✅
- **Test 4 (RAG Copilot)**: Groq LLM synthesis & "Explain Simply" mode ✅
- **Test 5 (CSC Locator)**: Nearest CSC center matching & proactive alerts ✅
- **Test 6 (Twilio Webhook)**: TwiML XML formatting & WhatsApp response ✅
- **Test 7 (FastAPI App)**: All 34 backend API endpoints mounted ✅

---

## 📜 License
MIT License. Built for Bharat Buildathon 2026.
