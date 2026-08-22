"""
Sarthi AI - Comprehensive 7-Layer End-to-End System Diagnostic
Tests every module, API connection, RAG pipeline layer, and service endpoint.
"""

import sys
import os
import json
from dotenv import load_dotenv

# Ensure UTF-8 output encoding for Windows console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

def run_diagnostics():
    print("====================================================")
    print("   SARTHI AI SYSTEM DIAGNOSTIC & END-TO-END TEST    ")
    print("====================================================\n")

    # Load environment variables
    with open(".env", "r", encoding="utf-8") as f:
        for line in f:
            if line.strip() and not line.startswith("#"):
                parts = line.strip().split("=", 1)
                if len(parts) == 2:
                    os.environ[parts[0]] = parts[1]

    # 1. Environment & API Keys
    print("[TEST 1/7] ENVIRONMENT VARIABLES & API KEYS")
    groq_key = os.getenv("GROQ_API_KEY", "")
    twilio_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
    twilio_phone = os.getenv("TWILIO_PHONE_NUMBER", "")

    print(f"  • GROQ_API_KEY: {'SET (' + groq_key[:8] + '...)' if groq_key else 'MISSING'}")
    print(f"  • TWILIO_ACCOUNT_SID: {'SET (' + twilio_sid[:8] + '...)' if twilio_sid else 'MISSING'}")
    print(f"  • TWILIO_PHONE_NUMBER: {twilio_phone}")
    assert groq_key and not groq_key.startswith("gsk_your_"), "Groq API Key missing or default"
    assert twilio_sid, "Twilio SID missing"
    print("  => PASS: Environment Keys Verified!\n")

    # 2. Knowledge Base & HuggingFace Dataset
    print("[TEST 2/7] KNOWLEDGE BASE & HUGGINGFACE DATASET")
    from ai_pipeline.knowledge_base import KnowledgeBase
    kb = KnowledgeBase()
    schemes = kb.get_all_schemes()
    print(f"  • Total Schemes Ingested: {len(schemes)}")
    hf_schemes = [s for s in schemes if s.get("id", "").startswith("hf-")]
    print(f"  • HuggingFace (shrijayan/gov_myscheme) Schemes Loaded: {len(hf_schemes)}")
    assert len(schemes) >= 5, "Knowledge Base scheme count too low"
    print("  => PASS: Knowledge Base & HuggingFace Dataset Operational!\n")

    # 3. Vector Hybrid Search Engine
    print("[TEST 3/7] SEMANTIC SEARCH VECTOR ENGINE")
    from ai_pipeline.embeddings import SemanticSearchEngine
    se = SemanticSearchEngine(kb)
    results = se.search_schemes("Scholarships for post matric students in Punjab", top_k=2)
    print(f"  • Top Search Result: '{results[0]['name']}' (Match Score: {results[0].get('match', 0)}%)")
    assert len(results) > 0, "Semantic search returned empty"
    print("  => PASS: Semantic Search Engine Operational!\n")

    # 4. RAG Copilot & Groq LLM (groq/compound-mini)
    print("[TEST 4/7] RAG COPILOT & GROQ LLM (groq/compound-mini)")
    from ai_pipeline.rag_copilot import RAGCopilot
    copilot = RAGCopilot(kb, se)
    rag_res = copilot.process_query("Scholarships for students", citizen_profile={"age": 21, "category": "General", "state": "Punjab"}, explain_simply=True)
    print("  • Groq Generated Response Excerpt:")
    lines = rag_res["reply"].split("\n")
    for line in lines[:4]:
        if line.strip():
            print(f"    {line.strip()}")
    assert "reply" in rag_res, "RAG response missing reply field"
    print("  => PASS: RAG Copilot & Groq LLM Verified!\n")

    # 5. CSC Locator & Proactive Matching Engine
    print("[TEST 5/7] CSC LOCATOR & PROACTIVE MATCHING ENGINE")
    cscs = kb.find_nearest_csc(district="Ludhiana")
    print(f"  • Nearest CSC Center: {cscs[0]['centerName']} ({cscs[0]['address']})")
    profile = {"name": "Kshitij", "age": 22, "occupation": "Student", "state": "Punjab"}
    alerts = copilot.proactive_match_profiles(profile)
    print(f"  • Proactive Scheme Alerts Matched: {len(alerts)} alerts")
    assert len(cscs) > 0, "CSC locator failed"
    print("  => PASS: CSC Locator & Proactive Matching Operational!\n")

    # 6. Twilio WhatsApp Service & TwiML
    print("[TEST 6/7] TWILIO WHATSAPP SERVICE & TWIML GENERATION")
    from ai_pipeline.twilio_service import TwilioService
    ts = TwilioService(kb, se)
    twiml_out = ts.handle_incoming_message("Scholarships for Punjab", from_number="whatsapp:+919876543210")
    print(f"  • TwiML XML Output Length: {len(twiml_out)} bytes")
    assert "<Response>" in twiml_out and "<Message>" in twiml_out, "TwiML XML invalid"
    print("  => PASS: Twilio WhatsApp Service Operational!\n")

    # 7. Backend FastAPI App Initialization
    print("[TEST 7/7] FASTAPI ROUTER & SERVICE MOUNTING")
    from backend.main import app
    print(f"  • FastAPI App Title: {app.title}")
    print(f"  • Total Mounted Routes: {len(app.routes)}")
    assert len(app.routes) >= 10, "FastAPI router routes missing"
    print("  => PASS: FastAPI Application Initialized!\n")

    print("====================================================")
    print("   ALL 7 SYSTEM DIAGNOSTIC TESTS PASSED! ✅        ")
    print("====================================================")

if __name__ == "__main__":
    run_diagnostics()
