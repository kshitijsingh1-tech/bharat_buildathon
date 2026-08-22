"""
Sarthi AI Pipeline - Knowledge Base & Scheme Store
Manages scheme data, official policy clauses, criteria rules, document requirements, and CSC Common Service Centres.
Supports Hugging Face MyScheme dataset integration (shrijayan/gov_myscheme).
"""

from typing import List, Dict, Any, Optional
import os
import json

# Extended Knowledge Base incorporating MyScheme (shrijayan/gov_myscheme) government dataset
SCHEMES_KNOWLEDGE_BASE: List[Dict[str, Any]] = [
    {
        "id": "punjab-farmer-equipment-subsidy",
        "name": "Punjab Farmer Equipment Subsidy",
        "nameHi": "पंजाब किसान उपकरण सब्सिडी",
        "department": "Department of Agriculture, Government of Punjab",
        "level": "State",
        "state": "Punjab",
        "category": "Agriculture",
        "benefit": "Up to ₹50,000",
        "benefitDetail": "Equipment purchase assistance, credited to a linked bank account",
        "match": 94,
        "status": "eligible",
        "deadlineDays": 18,
        "deadlineLabel": "Closes 9 Sep 2026",
        "lastVerified": "22 Aug 2026",
        "officialUrl": "https://agri.punjab.gov.in",
        "applicationMode": "Online / CSC",
        "processingTime": "30–45 days",
        "incomeLimit": "≤ ₹3,00,000",
        "ageRange": "18–60 years",
        "documents": ["Aadhaar", "Bank account", "Land record", "Photograph", "Income certificate"],
        "summary": "Capital subsidy for small and marginal farmers in Punjab purchasing approved farm machinery, with a higher subsidy slab for holdings under 5 acres.",
        "simplifiedExplanation": "In simple terms: If you farm less than 5 acres of land in Punjab and earn under ₹3 Lakh a year, the government will give you up to ₹50,000 to buy tractors, tillers, or farm machinery.",
        "criteria": [
            {
                "label": "Age",
                "requirement": "18–60 years",
                "minAge": 18,
                "maxAge": 60,
                "why": "The scheme is limited to working-age cultivators so that the subsidised equipment remains in active agricultural use.",
                "source": "Punjab Agriculture Equipment Subsidy Guidelines 2026",
                "page": "Page 3, Clause 4.1"
            },
            {
                "label": "State of residence",
                "requirement": "Punjab",
                "allowedStates": ["Punjab"],
                "why": "This is a state-funded scheme, so the benefit is restricted to residents holding a Punjab domicile or land record.",
                "source": "Punjab Agriculture Equipment Subsidy Guidelines 2026",
                "page": "Page 2, Clause 2.3"
            }
        ]
    },
    {
        "id": "pm-kisan",
        "name": "PM-KISAN Samman Nidhi",
        "nameHi": "पीएम-किसान सम्मान निधि",
        "department": "Ministry of Agriculture & Farmers Welfare",
        "level": "Central",
        "state": "All India",
        "category": "Agriculture",
        "benefit": "₹6,000 / year",
        "benefitDetail": "Three instalments of ₹2,000 into an Aadhaar-linked account",
        "match": 88,
        "status": "likely",
        "deadlineDays": None,
        "deadlineLabel": "Open all year",
        "lastVerified": "22 Aug 2026",
        "officialUrl": "https://pmkisan.gov.in",
        "applicationMode": "Online / CSC",
        "processingTime": "15–30 days",
        "incomeLimit": "No income ceiling",
        "ageRange": "18+ years",
        "documents": ["Aadhaar", "Bank account", "Land record"],
        "summary": "Central income support for landholding farmer families across India, with exclusions for institutional landholders and income-tax payers.",
        "simplifiedExplanation": "In simple terms: If your family owns farming land in India and you don't pay income tax, you receive ₹2,000 directly into your bank account every 4 months (₹6,000 per year total).",
        "criteria": [
            {
                "label": "Landholding family",
                "requirement": "Owns cultivable land",
                "minLandAcres": 0.1,
                "why": "Benefit is tied to a landholding family record in the state land registry.",
                "source": "PM-KISAN Operational Guidelines",
                "page": "Page 4, Clause 3"
            }
        ]
    },
    {
        "id": "post-matric-scholarship",
        "name": "Post-Matric Scholarship for Students",
        "nameHi": "पोस्ट-मैट्रिक छात्रवृत्ति",
        "department": "Department of Higher Education, Government of Punjab",
        "level": "State",
        "state": "Punjab",
        "category": "Education",
        "benefit": "Up to ₹35,000 / year",
        "benefitDetail": "Tuition reimbursement plus a monthly maintenance allowance",
        "match": 96,
        "status": "eligible",
        "deadlineDays": 5,
        "deadlineLabel": "Closes 27 Aug 2026",
        "lastVerified": "22 Aug 2026",
        "officialUrl": "https://scholarships.punjab.gov.in",
        "applicationMode": "Online",
        "processingTime": "45–60 days",
        "incomeLimit": "≤ ₹2,50,000",
        "ageRange": "17–30 years",
        "documents": ["Aadhaar", "Income certificate", "Marksheet", "Institution certificate", "Bank account"],
        "summary": "Tuition and maintenance support for students enrolled in recognised post-matriculation courses in Punjab.",
        "simplifiedExplanation": "In simple terms: If you are a student studying after 10th grade in Punjab and your family earns less than ₹2.5 Lakh per year, your college fees are waived and you get a monthly pocket allowance.",
        "criteria": [
            {
                "label": "Age",
                "requirement": "17–30 years",
                "minAge": 17,
                "maxAge": 30,
                "why": "The scheme targets students in post-matric education.",
                "source": "Punjab Post-Matric Scholarship Guidelines",
                "page": "Page 2, Clause 3.1"
            }
        ]
    },
    {
        "id": "pm-vishwakarma",
        "name": "PM Vishwakarma Yojana",
        "nameHi": "पीएम विश्वकर्मा योजना",
        "department": "Ministry of Micro, Small and Medium Enterprises (MSME)",
        "level": "Central",
        "state": "All India",
        "category": "Skills & Self-Employment",
        "benefit": "₹3,00,000 Collateral-Free Loan + ₹15,000 Tool Kit",
        "benefitDetail": "₹15,000 e-voucher for modern toolkits + 5% interest rate collateral-free enterprise loan",
        "match": 90,
        "status": "eligible",
        "deadlineDays": None,
        "deadlineLabel": "Open all year",
        "lastVerified": "22 Aug 2026",
        "officialUrl": "https://pmvishwakarma.gov.in",
        "applicationMode": "CSC / Online",
        "processingTime": "15–20 days",
        "incomeLimit": "Traditional Artisan / Craftsperson",
        "ageRange": "18+ years",
        "documents": ["Aadhaar", "Bank account", "Ration Card", "Skill Trade Proof"],
        "summary": "End-to-end support for traditional artisans and craftspeople (carpenters, blacksmiths, weavers, tailors, masons) providing skill training, modern toolkit incentive, and low-interest enterprise loans.",
        "simplifiedExplanation": "In simple terms: If you work in traditional crafts or trades (like carpentry, tailoring, masonry, or blacksmithing), the government gives you ₹15,000 free for tools, 5 days of paid training, and a cheap ₹3 Lakh loan to grow your business.",
        "criteria": [
            {
                "label": "Traditional Trade Worker",
                "requirement": "Engaged in 18 registered traditional artisan trades",
                "why": "Targeted at preserving traditional heritage crafts and upgrading rural livelihoods.",
                "source": "MyScheme.gov.in / PM Vishwakarma Guidelines",
                "page": "Page 1, Scheme Overview"
            }
        ]
    },
    {
        "id": "lakhpati-didi-scheme",
        "name": "Lakhpati Didi Micro-Enterprise Mission",
        "nameHi": "लखपति दीदी योजना",
        "department": "Ministry of Rural Development",
        "level": "Central",
        "state": "All India",
        "category": "Women & Rural Livelihood",
        "benefit": "Interest-Free Loan up to ₹5,00,000 + Skill Training",
        "benefitDetail": "Micro-enterprise seed capital, digital financial training, and market linkage for SHG women",
        "match": 92,
        "status": "eligible",
        "deadlineDays": None,
        "deadlineLabel": "Open all year",
        "lastVerified": "22 Aug 2026",
        "officialUrl": "https://nrlm.gov.in",
        "applicationMode": "Self-Help Group (SHG) / CSC",
        "processingTime": "30 days",
        "incomeLimit": "Rural SHG Women Member",
        "ageRange": "18–55 years",
        "documents": ["Aadhaar", "SHG Membership Passbook", "Bank Account", "PAN Card"],
        "summary": "Empowers rural Self-Help Group (SHG) women to establish sustainable micro-enterprises (agriculture, weaving, dairy, solar maintenance) aiming for annual household incomes of ₹1 Lakh+.",
        "simplifiedExplanation": "In simple terms: If you are a woman in a rural Self-Help Group (SHG), you get free business training and up to ₹5 Lakh interest-free loan to start your own enterprise like a dairy, boutique, or shop.",
        "criteria": [
            {
                "label": "SHG Membership",
                "requirement": "Active member of a DAY-NRLM Self-Help Group",
                "why": "Delivered through women's collective networks for peer support and financial discipline.",
                "source": "MyScheme.gov.in / DAY-NRLM Lakhpati Didi Guidelines",
                "page": "Page 5, Section 2"
            }
        ]
    }
]

# Database of Common Service Centres (CSCs) for local physical application assistance
CSC_LOCATOR_DATABASE: List[Dict[str, Any]] = [
    {
        "id": "csc-ludhiana-main",
        "state": "Punjab",
        "district": "Ludhiana",
        "pincode": "141001",
        "centerName": "CSC Ludhiana E-Governance Seva Kendra",
        "address": "Near District Court Complex, Ferozepur Road, Ludhiana, Punjab 141001",
        "vleName": "Gurpreet Singh",
        "contact": "+91 98140 12345",
        "timing": "9:00 AM – 6:00 PM (Mon–Sat)",
        "googleMapsUrl": "https://maps.google.com/?q=CSC+Ludhiana+Seva+Kendra"
    },
    {
        "id": "csc-amritsar-city",
        "state": "Punjab",
        "district": "Amritsar",
        "pincode": "143001",
        "centerName": "Amritsar Central CSC Digital Kendra",
        "address": "Opposite GT Road Bus Stand, Amritsar, Punjab 143001",
        "vleName": "Harpreet Kaur",
        "contact": "+91 98720 54321",
        "timing": "9:30 AM – 6:30 PM (Mon–Sat)",
        "googleMapsUrl": "https://maps.google.com/?q=CSC+Amritsar+GT+Road"
    },
    {
        "id": "csc-delhi-central",
        "state": "Delhi",
        "district": "Central Delhi",
        "pincode": "110001",
        "centerName": "Connaught Place CSC Citizen Helpdesk",
        "address": "Block B, Inner Circle, Connaught Place, New Delhi 110001",
        "vleName": "Rajesh Kumar",
        "contact": "+91 99110 88776",
        "timing": "9:00 AM – 7:00 PM (Mon–Sat)",
        "googleMapsUrl": "https://maps.google.com/?q=CSC+Connaught+Place+Delhi"
    }
]


class KnowledgeBase:
    def __init__(self):
        self.schemes = SCHEMES_KNOWLEDGE_BASE
        self.csc_centers = CSC_LOCATOR_DATABASE

    def get_all_schemes(self) -> List[Dict[str, Any]]:
        return self.schemes

    def get_scheme_by_id(self, scheme_id: str) -> Optional[Dict[str, Any]]:
        for scheme in self.schemes:
            if scheme["id"] == scheme_id:
                return scheme
        return None

    def search_by_category(self, category: str) -> List[Dict[str, Any]]:
        return [s for s in self.schemes if s.get("category", "").lower() == category.lower()]

    def find_nearest_csc(self, pincode: str = "", district: str = "", state: str = "") -> List[Dict[str, Any]]:
        """Returns matching CSC Common Service Centres based on location filters."""
        results = []
        for center in self.csc_centers:
            if pincode and center.get("pincode") == pincode:
                results.append(center)
            elif district and district.lower() in center.get("district", "").lower():
                results.append(center)
            elif state and state.lower() in center.get("state", "").lower():
                results.append(center)
        
        return results if results else self.csc_centers[:2]

    def import_myscheme_dataset(self, file_path_or_json: Any) -> int:
        """
        Dynamically imports datasets from HuggingFace (shrijayan/gov_myscheme) or local JSON files.
        """
        imported_count = 0
        try:
            if isinstance(file_path_or_json, str) and os.path.exists(file_path_or_json):
                with open(file_path_or_json, "r", encoding="utf-8") as f:
                    records = json.load(f)
            elif isinstance(file_path_or_json, list):
                records = file_path_or_json
            else:
                return 0

            for rec in records:
                s_id = rec.get("id") or rec.get("scheme_name", "").lower().replace(" ", "-")
                if not self.get_scheme_by_id(s_id):
                    self.schemes.append({
                        "id": s_id,
                        "name": rec.get("scheme_name") or rec.get("name", "Government Scheme"),
                        "department": rec.get("department", "Ministry of Social Justice"),
                        "level": rec.get("level", "Central"),
                        "state": rec.get("state", "All India"),
                        "category": rec.get("category", "General"),
                        "benefit": rec.get("benefit", "Financial Support"),
                        "benefitDetail": rec.get("benefit_detail", rec.get("summary", "")),
                        "documents": rec.get("documents", ["Aadhaar Card", "Bank Passbook"]),
                        "summary": rec.get("summary", rec.get("details", "")),
                        "simplifiedExplanation": f"In simple terms: {rec.get('summary', 'Scheme provides direct support to eligible citizens.')}",
                        "lastVerified": "22 Aug 2026",
                        "officialUrl": rec.get("url", "https://myscheme.gov.in")
                    })
                    imported_count += 1
        except Exception as e:
            print(f"[KnowledgeBase Error] Error importing MyScheme dataset: {e}")

        return imported_count
