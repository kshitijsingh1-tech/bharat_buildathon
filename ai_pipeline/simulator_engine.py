"""
Sarthi AI Pipeline - Benefit Simulator & Family Welfare Optimizer Engine
Calculates total financial benefit entitlements, simulates 'what-if' profile changes, and computes application readiness scores.
"""

from typing import Dict, Any, List
from ai_pipeline.knowledge_base import KnowledgeBase
from ai_pipeline.eligibility_evaluator import EligibilityEvaluator

class SimulatorEngine:
    def __init__(self, kb: KnowledgeBase, evaluator: EligibilityEvaluator):
        self.kb = kb
        self.evaluator = evaluator

    def calculate_family_entitlements(self, family_members: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates total financial benefits and eligible scheme counts across all family members.
        """
        family_results = []
        total_eligible_schemes = 0
        total_potential_annual_benefit = 0

        for member in family_members:
            # Simulate matching schemes for each family member profile
            member_profile = {
                "age": member.get("age"),
                "occupation": member.get("occupation"),
                "state": member.get("state", "Punjab"),
                "income": 0 if member.get("age", 0) > 60 else 240000
            }

            all_schemes = self.kb.get_all_schemes()
            eligible_count = 0

            for s in all_schemes:
                res = self.evaluator.evaluate_citizen_for_scheme(member_profile, s["id"])
                if res.get("status") in ["eligible", "likely"]:
                    eligible_count += 1

            total_eligible_schemes += eligible_count

            # Standard sample benefit calculation (₹5,000 - ₹50,000 range)
            est_benefit = eligible_count * 12000

            total_potential_annual_benefit += est_benefit

            family_results.append({
                "id": member.get("id"),
                "name": member.get("name"),
                "relation": member.get("relation"),
                "eligibleSchemesCount": eligible_count,
                "estimatedAnnualBenefit": f"₹{est_benefit:,}"
            })

        return {
            "totalFamilyMembers": len(family_members),
            "totalEligibleSchemes": total_eligible_schemes,
            "totalPotentialAnnualBenefit": f"₹{total_potential_annual_benefit:,}",
            "memberBreakdown": family_results
        }

    def simulate_what_if_scenario(self, current_profile: Dict[str, Any], adjusted_attributes: Dict[str, Any]) -> Dict[str, Any]:
        """
        Simulates how profile updates (e.g. obtaining income certificate, land change, or course enrolment) unlock new schemes.
        """
        simulated_profile = dict(current_profile)
        simulated_profile.update(adjusted_attributes)

        all_schemes = self.kb.get_all_schemes()
        before_eligible = []
        after_eligible = []

        for s in all_schemes:
            res_before = self.evaluator.evaluate_citizen_for_scheme(current_profile, s["id"])
            if res_before.get("status") in ["eligible", "likely"]:
                before_eligible.append(s)

            res_after = self.evaluator.evaluate_citizen_for_scheme(simulated_profile, s["id"])
            if res_after.get("status") in ["eligible", "likely"]:
                after_eligible.append(s)

        newly_unlocked = [s for s in after_eligible if s["id"] not in [b["id"] for b in before_eligible]]

        return {
            "previousEligibleCount": len(before_eligible),
            "newEligibleCount": len(after_eligible),
            "unlockedSchemes": newly_unlocked,
            "summary": f"By updating your profile parameters ({', '.join(adjusted_attributes.keys())}), you unlock {len(newly_unlocked)} additional schemes."
        }

    def compute_readiness_score(self, citizen_profile: Dict[str, Any], uploaded_docs: List[str]) -> Dict[str, Any]:
        """
        Calculates an application readiness score out of 100 based on verified documents and profile completeness.
        """
        required_core_docs = ["Aadhaar", "Income certificate", "Residence certificate", "Bank account"]
        present_docs = [doc for doc in required_core_docs if doc in uploaded_docs]

        doc_score = (len(present_docs) / len(required_core_docs)) * 60
        profile_completeness = 40 if (citizen_profile.get("age") and citizen_profile.get("state") and citizen_profile.get("income")) else 20

        total_readiness = int(doc_score + profile_completeness)

        return {
            "readinessScore": total_readiness,
            "verifiedDocumentCount": len(present_docs),
            "totalRequiredCoreDocs": len(required_core_docs),
            "missingCoreDocs": [d for d in required_core_docs if d not in uploaded_docs],
            "statusLabel": "High Readiness" if total_readiness >= 85 else ("Medium Readiness" if total_readiness >= 60 else "Action Required")
        }
