"""
Sarthi Backend Pydantic Data Models & Request/Response Schemas
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class CriterionSchema(BaseModel):
    label: str
    userValue: str
    requirement: str
    status: str  # 'pass' | 'fail' | 'unknown'
    why: str
    source: str
    page: str

class SchemeSchema(BaseModel):
    id: str
    name: str
    nameHi: Optional[str] = None
    department: str
    level: str
    state: str
    category: str
    benefit: str
    benefitDetail: str
    match: int
    status: str
    deadlineDays: Optional[int] = None
    deadlineLabel: str
    lastVerified: str
    applicationMode: str
    processingTime: str
    incomeLimit: str
    ageRange: str
    documents: List[str]
    summary: str
    criteria: Optional[List[Dict[str, Any]]] = None

class CitizenProfileSchema(BaseModel):
    name: Optional[str] = "Aayush Sharma"
    age: Optional[int] = 21
    gender: Optional[str] = "Male"
    state: Optional[str] = "Punjab"
    district: Optional[str] = "Ludhiana"
    occupation: Optional[str] = "Student"
    incomeValue: Optional[int] = 240000
    category: Optional[str] = "General"
    education: Optional[str] = "Undergraduate"
    landAcres: Optional[float] = 0.0
    uploadedDocuments: Optional[List[str]] = Field(default_factory=list)

class SearchQueryRequest(BaseModel):
    query: str
    category: Optional[str] = "All"
    state: Optional[str] = "All India"
    top_k: Optional[int] = 10

class EligibilityRequest(BaseModel):
    schemeId: str
    citizenProfile: CitizenProfileSchema

class EligibilityResponse(BaseModel):
    schemeId: str
    schemeName: str
    status: str
    match: int
    criteria: List[Dict[str, Any]]
    missingDocuments: List[str]
    requiredDocuments: List[str]

class ChatQueryRequest(BaseModel):
    message: str
    citizenProfile: Optional[CitizenProfileSchema] = None
    language: Optional[str] = "en"

class ChatResponse(BaseModel):
    reply: str
    topScheme: Optional[Dict[str, Any]] = None
    suggestedSchemes: List[Dict[str, Any]] = Field(default_factory=list)
    citations: List[Dict[str, Any]] = Field(default_factory=list)
    actionButtons: List[Dict[str, str]] = Field(default_factory=list)

class DocumentAnalyzeRequest(BaseModel):
    docType: str
    fileName: str
    issueDate: Optional[str] = None

class FamilyMemberSchema(BaseModel):
    id: str
    name: str
    relation: str
    age: int
    occupation: str
    state: Optional[str] = "Punjab"

class FamilyPlanRequest(BaseModel):
    familyMembers: List[FamilyMemberSchema]

class SimulationRequest(BaseModel):
    currentProfile: CitizenProfileSchema
    adjustedAttributes: Dict[str, Any]

class TwilioAlertRequest(BaseModel):
    phoneNumber: str
    schemeName: str
    deadlineDays: int
    isWhatsApp: Optional[bool] = False

class TwilioAlertResponse(BaseModel):
    status: str
    sid: str
    fromPhone: str
    toPhone: str
    body: str
    simulated: bool
