"""
Sarthi API Router - Endpoints for Semantic Search, Eligibility, Chat Copilot, Document OCR, and Simulations.
"""

import sys
from fastapi import APIRouter, HTTPException, Query, Response, Form, Request
from typing import List, Dict, Any, Optional

from backend.models.schemas import (
    SearchQueryRequest,
    EligibilityRequest,
    EligibilityResponse,
    ChatQueryRequest,
    ChatResponse,
    DocumentAnalyzeRequest,
    FamilyPlanRequest,
    SimulationRequest,
    SchemeSchema,
    TwilioAlertRequest,
    TwilioAlertResponse
)

from ai_pipeline import (
    KnowledgeBase,
    SemanticSearchEngine,
    EligibilityEvaluator,
    RAGCopilot,
    DocumentProcessor,
    SimulatorEngine,
    TwilioService
)

router = APIRouter()

# Initialize AI Pipeline Services
kb = KnowledgeBase()
search_engine = SemanticSearchEngine(kb)
evaluator = EligibilityEvaluator(kb)
copilot = RAGCopilot(kb, search_engine)
doc_processor = DocumentProcessor()
simulator = SimulatorEngine(kb, evaluator)
twilio_service = TwilioService(kb, search_engine)


@router.get("/schemes", response_model=List[Dict[str, Any]])
def get_all_schemes():
    """Returns all government schemes from the knowledge base."""
    return kb.get_all_schemes()


@router.get("/schemes/{scheme_id}", response_model=Dict[str, Any])
def get_scheme_by_id(scheme_id: str):
    """Fetches details for a specific scheme by ID."""
    scheme = kb.get_scheme_by_id(scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme


@router.post("/schemes/search", response_model=List[Dict[str, Any]])
def search_schemes(req: SearchQueryRequest):
    """Executes semantic search over scheme metadata using hybrid vector embeddings."""
    return search_engine.search_schemes(
        query=req.query,
        category_filter=req.category,
        state_filter=req.state,
        top_k=req.top_k
    )


@router.post("/eligibility/evaluate", response_model=EligibilityResponse)
def evaluate_eligibility(req: EligibilityRequest):
    """Evaluates a citizen's profile against scheme requirements."""
    res = evaluator.evaluate_citizen_for_scheme(req.citizenProfile.dict(), req.schemeId)
    if "error" in res:
        raise HTTPException(status_code=400, detail=res["error"])
    return res


@router.post("/chat/copilot", response_model=ChatResponse)
def chat_with_copilot(req: ChatQueryRequest):
    """RAG AI Copilot endpoint for natural language query resolution with policy citations."""
    profile_dict = req.citizenProfile.dict() if req.citizenProfile else None
    return copilot.process_query(
        user_message=req.message,
        citizen_profile=profile_dict,
        language=req.language
    )


@router.post("/documents/analyze", response_model=Dict[str, Any])
def analyze_document(req: DocumentAnalyzeRequest):
    """Performs AI document OCR scanning, metadata extraction, and expiry validation."""
    return doc_processor.analyze_document(
        doc_type=req.docType,
        file_name=req.fileName,
        issue_date_str=req.issueDate
    )


@router.post("/family/planner", response_model=Dict[str, Any])
def plan_family_benefits(req: FamilyPlanRequest):
    """Computes total household benefit coverage and eligible scheme recommendations across family members."""
    members_data = [m.dict() for m in req.familyMembers]
    return simulator.calculate_family_entitlements(members_data)


@router.post("/simulator/what-if", response_model=Dict[str, Any])
def simulate_what_if(req: SimulationRequest):
    """Simulates how updating citizen parameters unlocks additional scheme benefits."""
    return simulator.simulate_what_if_scenario(
        current_profile=req.currentProfile.dict(),
        adjusted_attributes=req.adjustedAttributes
    )


@router.post("/readiness/score", response_model=Dict[str, Any])
def calculate_readiness(req: EligibilityRequest):
    """Calculates overall application readiness score based on profile and document vault."""
    profile_dict = req.citizenProfile.dict()
    docs = profile_dict.get("uploadedDocuments", [])
    return simulator.compute_readiness_score(profile_dict, docs)


@router.post("/twilio/alert", response_model=TwilioAlertResponse)
def send_twilio_alert(req: TwilioAlertRequest):
    """Dispatches SMS or WhatsApp scheme alert notification via Twilio."""
    res = twilio_service.send_scheme_alert(
        to_phone=req.phoneNumber,
        scheme_name=req.schemeName,
        deadline_days=req.deadlineDays,
        is_whatsapp=req.isWhatsApp
    )
    return TwilioAlertResponse(
        status=res["status"],
        sid=res["sid"],
        fromPhone=res["from"],
        toPhone=res["to"],
        body=res["body"],
        simulated=res["simulated"]
    )


import logging
logger = logging.getLogger("uvicorn.error")

@router.api_route("/twilio/webhook", methods=["GET", "POST"])
async def twilio_incoming_webhook(request: Request):
    """
    Twilio HTTP Webhook Callback endpoint for incoming SMS/WhatsApp queries.
    Parses both form-data and raw query parameters and returns XML TwiML response.
    """
    msg_body = ""
    sender = ""

    try:
        form_data = await request.form()
        msg_body = form_data.get("Body") or form_data.get("body") or ""
        sender = form_data.get("From") or form_data.get("from") or ""
    except Exception:
        pass

    if not msg_body:
        msg_body = request.query_params.get("Body", "Hi")
    if not sender:
        sender = request.query_params.get("From", "WhatsApp Citizen")

    log_banner = (
        f"\n{'='*75}\n"
        f"📱 [TWILIO WHATSAPP / SMS RECEIVED]\n"
        f"   👤 From: {sender}\n"
        f"   💬 Query: {msg_body}\n"
        f"{'='*75}"
    )
    logger.info(log_banner)
    print(log_banner, flush=True)

    twiml_xml = twilio_service.process_incoming_query(incoming_body=msg_body, sender_number=sender)

    resp_banner = (
        f"🤖 [SARTHI RAG RESPONSE GENERATED]\n"
        f"{twiml_xml}\n"
        f"{'='*75}\n"
    )
    logger.info(resp_banner)
    print(resp_banner, flush=True)
    sys.stdout.flush()

    return Response(content=twiml_xml, media_type="application/xml")
