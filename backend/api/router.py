"""
Sarthi API Router - Endpoints for Semantic Search, Eligibility, Chat Copilot, Document OCR, and Simulations.
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any

from backend.models.schemas import (
    SearchQueryRequest,
    EligibilityRequest,
    EligibilityResponse,
    ChatQueryRequest,
    ChatResponse,
    DocumentAnalyzeRequest,
    FamilyPlanRequest,
    SimulationRequest,
    SchemeSchema
)

from ai_pipeline import (
    KnowledgeBase,
    SemanticSearchEngine,
    EligibilityEvaluator,
    RAGCopilot,
    DocumentProcessor,
    SimulatorEngine
)

router = APIRouter()

# Initialize AI Pipeline Services
kb = KnowledgeBase()
search_engine = SemanticSearchEngine(kb)
evaluator = EligibilityEvaluator(kb)
copilot = RAGCopilot(kb, search_engine)
doc_processor = DocumentProcessor()
simulator = SimulatorEngine(kb, evaluator)


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
