# Sarthi AI & Backend Service

Production-ready FastAPI backend & AI Pipeline powering the **Sarthi - Government Benefits Copilot** platform.

## Features
- **Semantic & Hybrid Vector Search**: Fast scheme retrieval based on query relevance and user intent.
- **Rule-Based Eligibility Engine**: Match citizen profile attributes (Age, Income, Occupation, State, Land holding) against scheme criteria with exact pass/fail rationale.
- **Multilingual RAG AI Copilot**: Grounded response generation with official government document citations.
- **Smart Document OCR & Expiry Intelligence**: Scans documents, extracts metadata, and alerts citizens of expiring certificates.
- **Benefit Simulator & Family Planner**: Calculates total household entitlement coverage and simulates 'what-if' policy scenarios.

## Quickstart

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Start the Backend Server
From the project root directory (`d:\bharat_buildathon`):
```bash
python -m uvicorn backend.main:app --reload --port 8000
```

### 3. API Documentation
Once running, interactive API docs are available at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/schemes` | Fetch all schemes |
| `POST` | `/api/schemes/search` | Perform semantic search over schemes |
| `POST` | `/api/eligibility/evaluate` | Evaluate citizen profile against scheme criteria |
| `POST` | `/api/chat/copilot` | Process natural language RAG copilot queries |
| `POST` | `/api/documents/analyze` | Scan document and extract expiry/authenticity metadata |
| `POST` | `/api/family/planner` | Calculate family benefit coverage |
| `POST` | `/api/simulator/what-if` | Run profile update simulation |
| `POST` | `/api/readiness/score` | Compute application readiness score |
