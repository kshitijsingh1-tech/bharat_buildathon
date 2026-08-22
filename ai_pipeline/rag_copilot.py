"""
Sarthi AI Pipeline - Multilingual RAG AI Copilot & Proactive Matching Engine
Features:
1. WhatsApp-First Integration & Groq LLM
2. Voice-First Q&A Processing
3. Proactive Matching Engine (Pings users on newly matching schemes)
4. "Explain Simply" Mode (5th grade reading level simplification)
5. Docs + CSC Locator (Nearest Common Service Centre discovery)
6. Trust Signals (Official URL, Last-Verified Date, & Verification Disclaimer)
"""

import os
import json
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

    def generate_groq_response(
        self,
        user_message: str,
        top_scheme: Dict[str, Any],
        all_schemes: List[Dict[str, Any]],
        explain_simply: bool = False,
        language: str = "en"
    ) -> Optional[str]:
        """
        Synthesizes grounded RAG response using Groq LLM (groq/compound-mini).
        Supports "Explain Simply" mode (5th grade reading level simplification).
        """
        if not self.client:
            return None

        try:
            simplicity_instruction = ""
            if explain_simply:
                simplicity_instruction = (
                    "CRITICAL: The user has requested 'EXPLAIN SIMPLY' mode. Rewrite all dense government jargon into 5th-grade simple language. "
                    "Use short sentences, clear bullet points, and practical analogies. Start with '💡 In simple terms:'."
                )

            system_prompt = (
                "You are Sarthi, an expert AI Copilot for Indian Government Welfare Schemes.\n"
                "Answer the citizen's query accurately using ONLY the provided scheme context below.\n"
                f"{simplicity_instruction}\n\n"
                "Rules:\n"
                "1. Keep responses clear, helpful, and concise.\n"
                "2. Highlight matching scheme name, cash benefits, department, and required documents.\n"
                "3. Use clean markdown formatting with emojis (e.g. 🇮🇳, 🏆, 💸, 📍, 📄).\n"
                "4. Always include official trust signals (Source Link & Last-Verified Date).\n"
                "5. Never invent or hallucinate scheme facts outside the provided context."
            )

            context_str = f"Target Scheme: {top_scheme.get('name')}\n"
            context_str += f"Benefit: {top_scheme.get('benefit')} ({top_scheme.get('benefitDetail')})\n"
            context_str += f"Department: {top_scheme.get('department')}\n"
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
                temperature=0.3,
                max_tokens=450
            )

            return chat_completion.choices[0].message.content
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
        - Trust Signals (Official source link & last verified date)
        - Explain Simply mode
        - Docs + CSC Locator (Nearest Common Service Centre)
        """
        search_results = self.search_engine.search_schemes(user_message, top_k=3)

        if not search_results:
            return {
                "reply": "Namaste! I couldn't find a direct policy match for your query. Could you please specify your state, occupation, or required benefit?",
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

        # Attempt Groq LLM synthesis
        groq_reply = self.generate_groq_response(
            user_message,
            top_scheme,
            search_results,
            explain_simply=explain_simply,
            language=language
        )

        if groq_reply:
            reply_text = groq_reply
        else:
            # Fallback RAG response
            if explain_simply:
                reply_text = (
                    f"💡 **In Simple Terms ({top_scheme['name']}):**\n\n"
                    f"{top_scheme.get('simplifiedExplanation')}\n\n"
                    f"📄 **What you need to bring:** {', '.join(top_scheme['documents'])}\n"
                    f"💰 **What you get:** {top_scheme['benefit']}"
                )
            else:
                reply_text = (
                    f"Based on your profile, **{top_scheme['name']}** is your top matching government scheme.\n\n"
                    f"• **Benefit:** {top_scheme['benefit']} ({top_scheme['benefitDetail']})\n"
                    f"• **Department:** {top_scheme['department']}\n"
                    f"• **Required Documents:** {', '.join(top_scheme['documents'])}\n\n"
                    f"**Eligibility Summary:** {top_scheme['summary']}"
                )

        # Append Trust Signals Banner
        trust_signal_banner = (
            f"\n\n---"
            f"\n🔗 **Official Source:** {top_scheme.get('officialUrl', 'https://myscheme.gov.in')}"
            f"\n🗓️ **Last Verified:** {top_scheme.get('lastVerified', '22 Aug 2026')}"
            f"\n🛡️ **Trust Guarantee:** Grounded in official policy guidelines. Please verify at your nearest CSC before submission."
        )

        full_reply = reply_text + trust_signal_banner

        return {
            "reply": full_reply,
            "rawReply": reply_text,
            "topScheme": top_scheme,
            "suggestedSchemes": search_results,
            "citations": citations,
            "cscCenters": nearest_cscs,
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
        Evaluates a citizen's saved profile against all knowledge base schemes and returns proactive alerts
        for newly launched or matching benefits.
        """
        matching_alerts = []
        user_age = citizen_profile.get("age", 25)
        user_income = citizen_profile.get("annualIncome", 150000)
        user_state = citizen_profile.get("state", "Punjab").lower()
        user_occ = citizen_profile.get("occupation", "Farmer").lower()

        for scheme in self.kb.get_all_schemes():
            # Match state
            st = scheme.get("state", "").lower()
            if st != "all india" and user_state not in st:
                continue

            # Match category/occupation heuristic
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
