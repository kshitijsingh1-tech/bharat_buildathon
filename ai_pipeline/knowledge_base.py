"""
Sarthi AI Pipeline - Knowledge Base & Scheme Store
Manages scheme data, official policy clauses, criteria rules, and document requirements.
"""

from typing import List, Dict, Any, Optional

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
        "lastVerified": "20 Aug 2026",
        "applicationMode": "Online / CSC",
        "processingTime": "30–45 days",
        "incomeLimit": "≤ ₹3,00,000",
        "ageRange": "18–60 years",
        "documents": ["Aadhaar", "Bank account", "Land record", "Photograph", "Income certificate"],
        "summary": "Capital subsidy for small and marginal farmers in Punjab purchasing approved farm machinery, with a higher subsidy slab for holdings under 5 acres.",
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
            },
            {
                "label": "Occupation",
                "requirement": "Farmer / cultivator",
                "allowedOccupations": ["Farmer", "Cultivator", "Agriculture worker"],
                "why": "Applicants must be recorded as cultivators in the state land record system.",
                "source": "Punjab Agriculture Equipment Subsidy Guidelines 2026",
                "page": "Page 3, Clause 4.2"
            },
            {
                "label": "Annual household income",
                "requirement": "≤ ₹3,00,000",
                "maxIncome": 300000,
                "why": "The income ceiling directs the subsidy towards small and marginal farming households.",
                "source": "Punjab Agriculture Equipment Subsidy Guidelines 2026",
                "page": "Page 4, Clause 5.1"
            },
            {
                "label": "Land holding",
                "requirement": "≤ 5 acres",
                "maxLandAcres": 5.0,
                "why": "Holdings above 5 acres are covered by a separate commercial mechanisation window.",
                "source": "Punjab Agriculture Equipment Subsidy Guidelines 2026",
                "page": "Page 4, Clause 5.4"
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
        "lastVerified": "20 Aug 2026",
        "applicationMode": "Online / CSC",
        "processingTime": "15–30 days",
        "incomeLimit": "No income ceiling",
        "ageRange": "18+ years",
        "documents": ["Aadhaar", "Bank account", "Land record"],
        "summary": "Central income support for landholding farmer families across India, with exclusions for institutional landholders and income-tax payers.",
        "criteria": [
            {
                "label": "Landholding family",
                "requirement": "Owns cultivable land",
                "minLandAcres": 0.1,
                "why": "Benefit is tied to a landholding family record in the state land registry.",
                "source": "PM-KISAN Operational Guidelines",
                "page": "Page 4, Clause 3"
            },
            {
                "label": "Income-tax status",
                "requirement": "Not an income-tax payer",
                "mustNotBeTaxPayer": True,
                "why": "Households where any member paid income tax in the last assessment year are excluded.",
                "source": "PM-KISAN Operational Guidelines",
                "page": "Page 6, Exclusion 4(e)"
            },
            {
                "label": "Aadhaar-linked bank account",
                "requirement": "Mandatory",
                "requiresAadhaarBank": True,
                "why": "Payments are made only through Aadhaar-seeded direct benefit transfer.",
                "source": "PM-KISAN Operational Guidelines",
                "page": "Page 9, Clause 7.2"
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
        "lastVerified": "19 Aug 2026",
        "applicationMode": "Online",
        "processingTime": "45–60 days",
        "incomeLimit": "≤ ₹2,50,000",
        "ageRange": "17–30 years",
        "documents": ["Aadhaar", "Income certificate", "Marksheet", "Institution certificate", "Bank account"],
        "summary": "Tuition and maintenance support for students enrolled in recognised post-matriculation courses in Punjab.",
        "criteria": [
            {
                "label": "Age",
                "requirement": "17–30 years",
                "minAge": 17,
                "maxAge": 30,
                "why": "The scheme targets students in post-matric education.",
                "source": "Punjab Post-Matric Scholarship Guidelines",
                "page": "Page 2, Clause 3.1"
            },
            {
                "label": "Enrolment",
                "requirement": "Recognised institution",
                "allowedOccupations": ["Student"],
                "why": "Only courses at institutions recognised by the state or UGC are covered.",
                "source": "Punjab Post-Matric Scholarship Guidelines",
                "page": "Page 3, Clause 4.2"
            },
            {
                "label": "Annual household income",
                "requirement": "≤ ₹2,50,000",
                "maxIncome": 250000,
                "why": "Income ceiling keeps the scholarship targeted at lower-income households.",
                "source": "Punjab Post-Matric Scholarship Guidelines",
                "page": "Page 4, Clause 5.1"
            }
        ]
    },
    {
        "id": "ayushman-health-cover",
        "name": "Health Cover Scheme",
        "nameHi": "स्वास्थ्य बीमा योजना",
        "department": "National Health Authority",
        "level": "Central",
        "state": "All India",
        "category": "Healthcare",
        "benefit": "₹5,00,000 / family / year",
        "benefitDetail": "Cashless secondary and tertiary hospitalisation cover",
        "match": 76,
        "status": "likely",
        "deadlineDays": None,
        "deadlineLabel": "Open all year",
        "lastVerified": "16 Aug 2026",
        "applicationMode": "Online / CSC",
        "processingTime": "7–15 days",
        "incomeLimit": "SECC-based selection",
        "ageRange": "All ages",
        "documents": ["Aadhaar", "Ration card", "Residence certificate"],
        "summary": "Family floater health cover for eligible households, usable at empanelled public and private hospitals without cash payment.",
        "criteria": [
            {
                "label": "Household eligibility",
                "requirement": "SECC deprivation category",
                "why": "Entitlement is determined by the deprivation categories recorded in the SECC database.",
                "source": "Health Cover Scheme Guidelines",
                "page": "Page 3, Clause 2.2"
            }
        ]
    },
    {
        "id": "senior-pension",
        "name": "Old Age Pension Scheme",
        "nameHi": "वृद्धावस्था पेंशन योजना",
        "department": "Department of Social Security, Government of Punjab",
        "level": "State",
        "state": "Punjab",
        "category": "Social Welfare",
        "benefit": "₹1,500 / month",
        "benefitDetail": "Monthly pension credited to a bank account",
        "match": 91,
        "status": "eligible",
        "deadlineDays": None,
        "deadlineLabel": "Open all year",
        "lastVerified": "17 Aug 2026",
        "applicationMode": "Online / CSC",
        "processingTime": "30–45 days",
        "incomeLimit": "≤ ₹60,000",
        "ageRange": "60+ years",
        "documents": ["Aadhaar", "Age proof", "Bank account", "Income certificate"],
        "summary": "Monthly social security pension for senior citizens in Punjab with limited independent income.",
        "criteria": [
            {
                "label": "Age",
                "requirement": "60+ years",
                "minAge": 60,
                "why": "Pension is a old-age social security benefit and starts at 60.",
                "source": "Punjab Social Security Pension Rules",
                "page": "Page 2, Clause 3.1"
            },
            {
                "label": "Independent income",
                "requirement": "≤ ₹60,000 / year",
                "maxIncome": 60000,
                "why": "Pension supports seniors without adequate independent income.",
                "source": "Punjab Social Security Pension Rules",
                "page": "Page 3, Clause 4.2"
            }
        ]
    }
]

class KnowledgeBase:
    def __init__(self):
        self.schemes = SCHEMES_KNOWLEDGE_BASE

    def get_all_schemes(self) -> List[Dict[str, Any]]:
        return self.schemes

    def get_scheme_by_id(self, scheme_id: str) -> Optional[Dict[str, Any]]:
        for scheme in self.schemes:
            if scheme["id"] == scheme_id:
                return scheme
        return None

    def search_by_category(self, category: str) -> List[Dict[str, Any]]:
        return [s for s in self.schemes if s.get("category", "").lower() == category.lower()]
