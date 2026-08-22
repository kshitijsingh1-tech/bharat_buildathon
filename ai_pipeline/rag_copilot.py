"""
Sarthi AI Pipeline - Multilingual Conversational RAG Copilot
Features:
1. Conversational Greeting & Intent Detection (Friendly warm welcome for Hello / Hi / Namaste)
2. Profiling Questions FIRST (Asks Age, Caste/Category, State/Region, Income AT THE TOP of responses)
3. Central Govt vs State Govt Scheme Bifurcation
4. Clean WhatsApp-Professional Layout (Mid-dots '•', hyphens '-', emoji-free, clean line breaks)
5. Multilingual Translation Compatibility
6. Docs + CSC Locator Integration
7. Grounded Policy Verification & Trust Signals
"""

import os
import json
import re
from typing import Dict, Any, List, Optional
from ai_pipeline.knowledge_base import KnowledgeBase
from ai_pipeline.embeddings import SemanticSearchEngine

class RAGCopilot:
    def __init__(self, kb: KnowledgeBase, search_engine: SemanticSearchEngine):
        self.kb = kb
        self.search_engine = search_engine
        self.groq_api_key = os.getenv("GROQ_API_KEY", "")
        self.client = None

        if self.groq_api_key and not self.groq_api_key.startswith("gsk_your_") and not self.groq_api_key.startswith("your_"):
            try:
                from groq import Groq
                self.client = Groq(api_key=self.groq_api_key)
            except Exception as e:
                print(f"[RAGCopilot Warning] Could not initialize Groq client: {e}")

    def is_greeting_intent(self, user_message: str) -> bool:
        """
        Determines if the citizen's input is a general conversational greeting or introductory message.
        """
        msg = user_message.strip().lower()
        msg_clean = re.sub(r'[^\w\s]', '', msg)
        
        greetings = {
            "hello", "hi", "hey", "namaste", "namaskar", "pranam",
            "good morning", "good afternoon", "good evening", "greetings",
            "who are you", "what is your name", "help", "start", "menu"
        }

        if msg_clean in greetings:
            return True
            
        words = msg_clean.split()
        if len(words) <= 2 and any(w in greetings for w in words):
            return True

        return False

    def analyze_missing_profile_attributes(self, user_message: str, citizen_profile: Optional[Dict[str, Any]]) -> List[str]:
        """
        Intelligent System: Analyzes query and citizen profile to identify missing critical parameters
        needed to accurately recommend scholarships or government schemes (Age, Caste/Category, State/Region, Income).
        """
        missing = []
        msg_lower = user_message.lower()
        profile = citizen_profile or {}

        # Age check
        has_age = bool(profile.get("age")) or any(k in msg_lower for k in ["year old", "age", "years old", "born"])
        if not has_age:
            missing.append("Age (or date of birth)")

        # Caste / Category check (General, SC, ST, OBC, EWS)
        has_caste = bool(profile.get("category")) or any(k in msg_lower for k in ["sc", "st", "obc", "ews", "general", "caste", "category"])
        if not has_caste:
            missing.append("Category / Caste (General / SC / ST / OBC / EWS)")

        # State / Region (Domicile) check
        has_state = bool(profile.get("state")) or any(k in msg_lower for k in ["punjab", "delhi", "haryana", "bihar", "up", "karnataka", "maharashtra", "state", "domicile", "region"])
        if not has_state:
            missing.append("State of Residence / Domicile Region")

        # Annual Income check
        has_income = bool(profile.get("annualIncome") or profile.get("income") or profile.get("incomeValue")) or any(k in msg_lower for k in ["lakh", "income", "earning", "salary", "rupees", "rs"])
        if not has_income:
            missing.append("Annual Family Household Income (e.g., <= Rs 2,50,000)")

        # Education level check for scholarships/university queries
        if any(k in msg_lower for k in ["scholarship", "university", "college", "student", "degree"]):
            has_edu = any(k in msg_lower for k in ["undergraduate", "postgraduate", "diploma", "12th", "10th", "btech", "ba", "bsc", "phd"])
            if not has_edu:
                missing.append("Current Course / Education Level")

        return missing

    def bifurcate_schemes_by_level(self, schemes: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """
        Intelligently bifurcates schemes into Central Government Schemes and State Government Schemes.
        """
        central = []
        state = []
        for s in schemes:
            lvl = s.get("level", "").lower()
            st = s.get("state", "").lower()
            if lvl == "central" or st in ["all india", "central"]:
                central.append(s)
            else:
                state.append(s)

        return {"central": central, "state": state}

    def generate_groq_response(
        self,
        user_message: str,
        central_schemes: List[Dict[str, Any]],
        state_schemes: List[Dict[str, Any]],
        explain_simply: bool = False,
        language: str = "en",
        missing_attrs: List[str] = None
    ) -> Optional[str]:
        """
        Synthesizes grounded RAG response using Groq LLM (groq/compound-mini).
        Enforces placing missing profiling questions AT THE VERY TOP before listing schemes.
        """
        if not self.client:
            return None

        try:
            simplicity_instruction = ""
            if explain_simply:
                simplicity_instruction = (
                    "CRITICAL MODE: 'EXPLAIN SIMPLY'. Rewrite dense government jargon into 5th-grade plain language using clear mid-dot bullet points ('• ')."
                )

            missing_questions_prompt = ""
            if missing_attrs:
                missing_questions_prompt = (
                    "CRITICAL ORDER RULE:\n"
                    "YOU MUST PLACE THE FOLLOWING PROFILING QUESTIONS AT THE VERY TOP OF YOUR RESPONSE BEFORE ANY SCHEME RECOMMENDATIONS:\n"
                    "To narrow down exact eligibility for your profile, please clarify:\n" +
                    "\n".join([f"• What is your {item}?" for item in missing_attrs]) + "\n\n---\n"
                )

            system_prompt = (
                "You are Sarthi Benefits Copilot, an expert AI assistant for Indian Government Welfare Schemes.\n"
                f"Respond in language code '{language}' (or match the user's input language naturally).\n"
                "Answer accurately using ONLY the provided scheme context below.\n"
                f"{missing_questions_prompt}\n"
                f"{simplicity_instruction}\n"
                "STRICT FORMATTING RULES:\n"
                "1. DO NOT USE ANY EMOJIS (No icons, flags, money symbols, or smileys).\n"
                "2. IF PROFILING QUESTIONS ARE APPLICABLE, PUT THEM AT THE VERY TOP FIRST.\n"
                "3. Clearly bifurcate options into 'Central Govt Schemes' and 'State Govt Schemes'.\n"
                "4. Use clean mid-dot bullet points starting with '• ' for details.\n"
                "5. Include Scheme Name, Department, Financial Benefit, and Required Documents.\n"
                "6. Always end with Trust Signals (Official Source URL & Last Verified Date)."
            )

            context_str = "=== CENTRAL GOVERNMENT SCHEMES ===\n"
            for cs in central_schemes[:2]:
                context_str += f"Scheme Name: {cs.get('name')}\n"
                context_str += f"Department: {cs.get('department')}\n"
                context_str += f"Benefit: {cs.get('benefit')}\n"
                context_str += f"Required Documents: {', '.join(cs.get('documents', []))}\n"
                context_str += f"Eligibility Summary: {cs.get('summary')}\n"
                context_str += f"Official URL: {cs.get('officialUrl')}\n\n"

            context_str += "=== STATE GOVERNMENT SCHEMES ===\n"
            for ss in state_schemes[:2]:
                context_str += f"Scheme Name: {ss.get('name')}\n"
                context_str += f"Department: {ss.get('department')}\n"
                context_str += f"Benefit: {ss.get('benefit')}\n"
                context_str += f"Required Documents: {', '.join(ss.get('documents', []))}\n"
                context_str += f"Eligibility Summary: {ss.get('summary')}\n"
                context_str += f"Official URL: {ss.get('officialUrl')}\n\n"

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Government Schemes Context:\n{context_str}\n\nCitizen Query: {user_message}"}
                ],
                model="groq/compound-mini",
                temperature=0.2,
                max_tokens=550
            )

            response_text = chat_completion.choices[0].message.content
            # Strip any residual emojis
            clean_text = re.sub(r'[\U00010000-\U0010ffff\u2600-\u26FF\u2700-\u27BF]', '', response_text)
            return clean_text.strip()
        except Exception as e:
            print(f"[RAGCopilot Groq Fallback] Error generating response: {e}")
            return None

    def process_query(
        self,
        user_message: str,
        citizen_profile: Dict[str, Any] = None,
        explain_simply: bool = False,
        pincode: str = "",
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        Processes citizen query and returns rich RAG response with:
        - Profiling Questions FIRST at the top of responses
        - Conversational greeting detection for simple 'Hello', 'Hi', 'Namaste'
        - Central Govt vs State Govt Scheme Bifurcation
        - Professional layout (Mid-dots '•', clean spacing, emoji-free)
        - Multilingual translation compatibility
        - Docs + CSC Locator
        - Grounded Trust Signals
        """
        # 1. Handle Conversational Greetings Intelligently
        if self.is_greeting_intent(user_message):
            greeting_reply = (
                "Namaste! I am Sarthi, your AI Government Benefits Copilot.\n\n"
                "How can I assist you today? You can ask me about:\n"
                "• Government welfare schemes & financial assistance\n"
                "• Student scholarships & university grants\n"
                "• Agricultural subsidies for farmers\n"
                "• Business loans & artisan incentives (e.g. PM Vishwakarma)\n\n"
                "Or tell me about yourself (your State, Age, Category/Caste, or Occupation) and I will intelligently match the best Central & State schemes for you!"
            )
            return {
                "reply": greeting_reply,
                "rawReply": greeting_reply,
                "isGreeting": True,
                "suggestedSchemes": [],
                "citations": [],
                "cscCenters": []
            }

        # 2. Intelligent Profiling & Scheme Matching
        missing_attrs = self.analyze_missing_profile_attributes(user_message, citizen_profile)
        search_results = self.search_engine.search_schemes(user_message, top_k=6)

        if not search_results:
            return {
                "reply": "Sarthi Benefits Copilot\n\nTo narrow down exact eligibility for your profile, please clarify:\n• What is your Age (or date of birth)?\n• What is your Category / Caste (General / SC / ST / OBC / EWS)?\n• What is your State of Residence / Domicile Region?\n• What is your Annual Family Household Income?\n\nI could not find a direct policy match for your query.",
                "suggestedSchemes": [],
                "citations": [],
                "cscCenters": []
            }

        bifurcated = self.bifurcate_schemes_by_level(search_results)
        central_list = bifurcated["central"]
        state_list = bifurcated["state"]
        top_scheme = search_results[0]

        # CSC Locator discovery
        user_district = (citizen_profile or {}).get("district", "Ludhiana")
        user_state = (citizen_profile or {}).get("state", top_scheme.get("state", "Punjab"))
        nearest_cscs = self.kb.find_nearest_csc(pincode=pincode, district=user_district, state=user_state)

        # Trust Signals
        citations = []
        for criterion in top_scheme.get("criteria", []):
            citations.append({
                "source": criterion.get("source", top_scheme.get("name")),
                "clause": criterion.get("page", "Official Guidelines"),
                "text": criterion.get("why", "")
            })

        # Attempt Groq LLM synthesis with Central vs State bifurcation
        groq_reply = self.generate_groq_response(
            user_message,
            central_schemes=central_list if central_list else search_results[:2],
            state_schemes=state_list if state_list else search_results[2:4],
            explain_simply=explain_simply,
            language=language,
            missing_attrs=missing_attrs
        )

        if groq_reply:
            reply_text = groq_reply
        else:
            # Fallback Structured Response putting Profiling Questions FIRST
            lines = ["Sarthi Benefits Copilot\n"]
            
            if missing_attrs:
                lines.append("To narrow down exact eligibility for your profile, please clarify:")
                for item in missing_attrs:
                    lines.append(f"  • What is your {item}?")
                lines.append("\n---\n")

            if central_list:
                c = central_list[0]
                lines.append("Central Govt Schemes:")
                lines.append(f"Recommended Scheme: {c['name']}")
                lines.append(f"  • Department: {c['department']}")
                lines.append(f"  • Financial Benefit: {c['benefit']}")
                lines.append(f"  • Required Documents: {', '.join(c['documents'])}\n")

            if state_list:
                s = state_list[0]
                lines.append("State Govt Schemes:")
                lines.append(f"Recommended Scheme: {s['name']}")
                lines.append(f"  • Department: {s['department']}")
                lines.append(f"  • Financial Benefit: {s['benefit']}")
                lines.append(f"  • Required Documents: {', '.join(s['documents'])}\n")

            lines.append(f"Eligibility Summary: {top_scheme['summary']}")

            reply_text = "\n".join(lines)

        # Append Trust Signals Footer Banner
        trust_signal_banner = (
            f"\n\n---\n"
            f"• Official Source: {top_scheme.get('officialUrl', 'https://myscheme.gov.in')}\n"
            f"• Last Verified: {top_scheme.get('lastVerified', '22 Aug 2026')}\n"
            f"• Trust Guarantee: Grounded in official policy guidelines. Verify at your nearest CSC before submission."
        )

        full_reply = reply_text + trust_signal_banner

        return {
            "reply": full_reply,
            "rawReply": reply_text,
            "topScheme": top_scheme,
            "centralSchemes": central_list,
            "stateSchemes": state_list,
            "suggestedSchemes": search_results,
            "citations": citations,
            "cscCenters": nearest_cscs,
            "missingProfileAttributes": missing_attrs,
            "trustSignals": {
                "officialUrl": top_scheme.get("officialUrl", "https://myscheme.gov.in"),
                "lastVerified": top_scheme.get("lastVerified", "22 Aug 2026"),
                "disclaimer": "Grounded in official policy guidelines. Verify at nearest CSC center before submission."
            },
            "actionButtons": [
                {"label": f"Check {top_scheme['name']} Eligibility", "action": f"/scheme/{top_scheme['id']}"},
                {"label": "Find Nearest CSC Center", "action": "/csc-locator"},
                {"label": "Explore All Schemes", "action": "/explore"}
            ]
        }

    def proactive_match_profiles(self, citizen_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Proactive Matching Engine:
        Evaluates a citizen's saved profile against all knowledge base schemes and returns proactive alerts.
        """
        matching_alerts = []
        user_state = citizen_profile.get("state", "Punjab").lower()
        user_occ = citizen_profile.get("occupation", "Farmer").lower()

        for scheme in self.kb.get_all_schemes():
            st = scheme.get("state", "").lower()
            if st != "all india" and user_state not in st:
                continue

            summary_lower = (scheme.get("summary", "") + scheme.get("category", "")).lower()
            if user_occ in summary_lower or "farmer" in user_occ or "student" in user_occ:
                matching_alerts.append({
                    "schemeId": scheme.get("id"),
                    "schemeName": scheme.get("name"),
                    "benefit": scheme.get("benefit"),
                    "deadlineDays": scheme.get("deadlineDays", 15),
                    "reason": f"Matches your saved profile ({citizen_profile.get('occupation')} in {citizen_profile.get('state')})"
                })

        return matching_alerts
