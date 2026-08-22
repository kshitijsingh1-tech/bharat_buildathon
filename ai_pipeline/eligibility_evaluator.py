"""
Sarthi AI Pipeline - Smart Eligibility Evaluator Engine
Analyzes citizen profile parameters against government scheme criteria rules.
"""

from typing import Dict, Any, List
from ai_pipeline.knowledge_base import KnowledgeBase

class EligibilityEvaluator:
    def __init__(self, kb: KnowledgeBase):
        self.kb = kb

    def evaluate_citizen_for_scheme(self, citizen_profile: Dict[str, Any], scheme_id: str) -> Dict[str, Any]:
        """
        Evaluates a single citizen profile against a target scheme.
        Returns match percentage, eligibility status, evaluated criteria rules, and missing documents.
        """
        scheme = self.kb.get_scheme_by_id(scheme_id)
        if not scheme:
            return {"error": f"Scheme with ID '{scheme_id}' not found."}

        evaluated_criteria = []
        pass_count = 0
        fail_count = 0
        unknown_count = 0

        user_age = citizen_profile.get("age")
        user_income = citizen_profile.get("incomeValue") or citizen_profile.get("income")
        user_state = citizen_profile.get("state")
        user_occupation = citizen_profile.get("occupation")
        user_gender = citizen_profile.get("gender")
        user_land = citizen_profile.get("landAcres", 0)

        for rule in scheme.get("criteria", []):
            status = "pass"
            user_val_str = "Not declared"

            # Check age condition
            if "minAge" in rule or "maxAge" in rule:
                if user_age is not None:
                    user_val_str = f"{user_age} years"
                    if ("minAge" in rule and user_age < rule["minAge"]) or ("maxAge" in rule and user_age > rule["maxAge"]):
                        status = "fail"
                else:
                    status = "unknown"

            # Check income condition
            elif "maxIncome" in rule:
                if user_income is not None:
                    user_val_str = f"₹{user_income:,}" if isinstance(user_income, (int, float)) else str(user_income)
                    if isinstance(user_income, (int, float)) and user_income > rule["maxIncome"]:
                        status = "fail"
                else:
                    status = "unknown"

            # Check state of residence
            elif "allowedStates" in rule:
                if user_state:
                    user_val_str = user_state
                    if user_state not in rule["allowedStates"] and "All India" not in rule["allowedStates"]:
                        status = "fail"
                else:
                    status = "unknown"

            # Check occupation
            elif "allowedOccupations" in rule:
                if user_occupation:
                    user_val_str = user_occupation
                    if not any(occ.lower() in user_occupation.lower() for occ in rule["allowedOccupations"]):
                        status = "fail"
                else:
                    status = "unknown"

            # Check land holding
            elif "maxLandAcres" in rule or "minLandAcres" in rule:
                user_val_str = f"{user_land} acres"
                if "maxLandAcres" in rule and user_land > rule["maxLandAcres"]:
                    status = "fail"
                elif "minLandAcres" in rule and user_land < rule["minLandAcres"]:
                    status = "fail"

            if status == "pass":
                pass_count += 1
            elif status == "fail":
                fail_count += 1
            else:
                unknown_count += 1

            evaluated_criteria.append({
                "label": rule["label"],
                "userValue": user_val_str,
                "requirement": rule["requirement"],
                "status": status,
                "why": rule["why"],
                "source": rule["source"],
                "page": rule["page"]
            })

        # Overall Status Determination
        if fail_count > 0:
            overall_status = "not-eligible"
            match_score = max(40, int(pass_count / max(len(evaluated_criteria), 1) * 70))
        elif unknown_count > 0:
            overall_status = "missing-info"
            match_score = 80
        elif pass_count == len(evaluated_criteria):
            overall_status = "eligible"
            match_score = 95
        else:
            overall_status = "likely"
            match_score = 88

        user_docs = set(citizen_profile.get("uploadedDocuments", []))
        required_docs = scheme.get("documents", [])
        missing_docs = [doc for doc in required_docs if doc not in user_docs]

        return {
            "schemeId": scheme["id"],
            "schemeName": scheme["name"],
            "status": overall_status,
            "match": match_score,
            "criteria": evaluated_criteria,
            "missingDocuments": missing_docs,
            "requiredDocuments": required_docs
        }
