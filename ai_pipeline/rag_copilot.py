"""
Sarthi AI Pipeline - Multilingual RAG Copilot & Intelligent Profiling System
Features:
1. Clean, Organized Formatting (No emojis, hyphenated bullet points, clear spacing)
2. Intelligent Multi-Turn Profiling System (Asks missing profile questions like age, income, state, education)
3. Multilingual Translation Ready Backend (Compatible with Google Chrome translation & multi-language input)
4. Docs + CSC Locator Integration
5. Trust Signals & Grounded Policy Verification
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

    def analyze_missing_profile_attributes(self, user_message: str, citizen_profile: Optional[Dict[str, Any]]) -> List[str]:
        """
        Intelligent System: Analyzes query and citizen profile to identify missing critical parameters
        needed to accurately recommend scholarships or government schemes (e.g., age, income, state, education level).
        """
        missing = []
        msg_lower = user_message.lower()
        profile = citizen_profile or {}

        # Age check
        has_age = bool(profile.get("age")) or any(k in msg_lower for k in ["year old", "age", "years old", "born"])
        if not has_age:
            missing.append("Age (or date of birth)")

        # Income check
        has_income = bool(profile.get("annualIncome") or profile.get("income")) or any(k in msg_lower for k in ["lakh", "income", "earning", "salary", "rupees", "rs"])
        if not has_income:
            missing.append("Annual Family Household Income (e.g., <= Rs 2,50,000)")

        # State/Domicile check
        has_state = bool(profile.get("state")) or any(k in msg_lower for k in ["punjab", "delhi", "haryana", "bihar", "up", "karnataka", "maharashtra", "state", "domicile"])
        if not has_state:
            missing.append("State of Residence / Domicile")

        # Education Level / Occupation check (especially for university scholarships)
        if "scholarship" in msg_lower or "university" in msg_lower or "college" in msg_lower or "student" in msg_lower:
            has_edu = any(k in msg_lower for k in ["undergraduate", "postgraduate", "degree", "diploma", "class 12", "10th", "btech", "ba", "bsc", "ma", "msc", "phd", "matric"])
            if not has_edu:
                missing.append("Current Course / Education Level (e.g., Undergraduate, Post-Graduate, Diploma)")

        return missing

    def generate_groq_response(
        self,
        user_message: str,
        top_scheme: Dict[str, Any],
        all_schemes: List[Dict[str, Any]],
        explain_simply: bool = False,
        language: str = "en",
        missing_attrs: List[str] = None
    ) -> Optional[str]:
        """
        Synthesizes grounded RAG response using Groq LLM (groq/compound-mini).
        Enforces clean, organized, emoji-free hyphenated formatting and handles multilingual queries.
        """
        if not self.client:
            return None

        try:
            simplicity_instruction = ""
            if explain_simply:
                simplicity_instruction = (
                    "CRITICAL MODE: 'EXPLAIN SIMPLY'. Rewrite dense policy jargon into 5th-grade plain language using short sentences and clear hyphenated bullet points."
                )

            missing_questions_prompt = ""
            if missing_attrs:
                missing_questions_prompt = (
                    "INTELLIGENT PROFILING INSTRUCTION:\n"
                    "The user's query is broad or missing critical citizen criteria. Politely ask follow-up questions to gather these missing parameters:\n" +
                    "\n".join([f"- What is your {item}?" for item in missing_attrs]) + "\n\n"
                )

            system_prompt = (
                "You are Sarthi, an expert AI Copilot for Indian Government Welfare Schemes.\n"
                f"Respond in language code '{language}' (or match the user's input language naturally).\n"
                "Answer the citizen's query accurately using ONLY the provided scheme context below.\n"
                f"{simplicity_instruction}\n"
                f"{missing_questions_prompt}\n"
                "STRICT FORMATTING RULES:\n"
                "1. DO NOT USE ANY EMOJIS (No icons, flags, money symbols, or smileys).\n"
                "2. Use clean markdown headers and bullet points starting with hyphen '- '.\n"
                "3. Organize clearly with section titles and consistent line breaks.\n"
                "4. Highlight scheme name, department, benefits, eligibility, and mandatory documents.\n"
                "5. Always include Trust Signals (Official Source URL & Last Verified Date).\n"
                "6. Do not invent facts outside the provided scheme context."
            )

            context_str = f"Target Scheme Name: {top_scheme.get('name')}\n"
            context_str += f"Department: {top_scheme.get('department')}\n"
            context_str += f"Benefit: {top_scheme.get('benefit')} ({top_scheme.get('benefitDetail')})\n"
            context_str += f"Official Source URL: {top_scheme.get('officialUrl', 'https://myscheme.gov.in')}\n"
            context_str += f"Last Verified Date: {top_scheme.get('lastVerified', '22 Aug 2026')}\n"
            context_str += f"Documents Required: {', '.join(top_scheme.get('documents', []))}\n"
            context_str += f"Eligibility Summary: {top_scheme.get('summary')}\n"
            context_str += f"Simplified Summary: {top_scheme.get('simplifiedExplanation')}\n\n"
            other_names = [s.get('name') for s in all_schemes[1:4] if s.get('name')]
            context_str += f"Other Relevant Schemes: {', '.join(other_names)}"

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Scheme Context:\n{context_str}\n\nCitizen Query: {user_message}"}
                ],
                model="groq/compound-mini",
                temperature=0.2,
                max_tokens=500
            )

            response_text = chat_completion.choices[0].message.content
            # Strip any residual emojis just in case
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
        - Intelligent profiling follow-up questions if query is vague
        - Organized, emoji-free hyphenated formatting
        - Multilingual translation compatibility
        - Docs + CSC Locator
        - Grounded Trust Signals
        """
        missing_attrs = self.analyze_missing_profile_attributes(user_message, citizen_profile)
        search_results = self.search_engine.search_schemes(user_message, top_k=3)

        if not search_results:
            return {
                "reply": "Namaste. I could not find a direct policy match for your query.\n\nTo help find suitable schemes, please specify:\n- Your state of residence\n- Your age\n- Your occupation or student status\n- Your annual family income",
                "suggestedSchemes": [],
                "citations": [],
                "cscCenters": []
            }

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

        # Attempt Groq LLM synthesis with missing profiling questions
        groq_reply = self.generate_groq_response(
            user_message,
            top_scheme,
            search_results,
            explain_simply=explain_simply,
            language=language,
            missing_attrs=missing_attrs
        )

        if groq_reply:
            reply_text = groq_reply
        else:
            # Fallback Organized Emoji-Free Response
            if explain_simply:
                reply_text = (
                    f"Simplified Summary: {top_scheme['name']}\n\n"
                    f"{top_scheme.get('simplifiedExplanation')}\n\n"
                    f"- Financial Benefit: {top_scheme['benefit']}\n"
                    f"- Mandatory Documents: {', '.join(top_scheme['documents'])}"
                )
            else:
                reply_text = (
                    f"Recommended Scheme: {top_scheme['name']}\n\n"
                    f"- Department: {top_scheme['department']}\n"
                    f"- Financial Benefit: {top_scheme['benefit']} ({top_scheme['benefitDetail']})\n"
                    f"- Required Documents: {', '.join(top_scheme['documents'])}\n\n"
                    f"Eligibility Summary: {top_scheme['summary']}"
                )

            # Append intelligent profiling questions if needed in fallback
            if missing_attrs:
                reply_text += "\n\nTo narrow down exact eligibility for your profile, please clarify:\n"
                for item in missing_attrs:
                    reply_text += f"- What is your {item}?\n"

        # Append Trust Signals Banner (Emoji-Free, Clean Markdown)
        trust_signal_banner = (
            f"\n\n---\n"
            f"- Official Source: {top_scheme.get('officialUrl', 'https://myscheme.gov.in')}\n"
            f"- Last Verified: {top_scheme.get('lastVerified', '22 Aug 2026')}\n"
            f"- Trust Guarantee: Grounded in official policy guidelines. Please verify at your nearest CSC before submission."
        )

        full_reply = reply_text + trust_signal_banner

        return {
            "reply": full_reply,
            "rawReply": reply_text,
            "topScheme": top_scheme,
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
