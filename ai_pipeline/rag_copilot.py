"""
Sarthi AI Pipeline - Conversational RAG Copilot with 3-Mode Intelligence

MODE 1: GENERAL CHAT - User says "Hello", "How are you?", "Tell me about yourself"
        -> Sarthi converses like a friendly chatbot using Groq LLM (no scheme dump)

MODE 2: SCHEME QUERY DETECTED but missing profile -> ONLY ask for Age, Caste, State
        -> Do NOT show any scheme results yet. Just ask the questions.

MODE 3: SCHEME QUERY with profile provided -> Show State Govt Schemes FIRST, then Central
        -> Customized results based on user's state, caste, age
"""

import os
import json
import re
from typing import Dict, Any, List, Optional
from ai_pipeline.knowledge_base import KnowledgeBase
from ai_pipeline.embeddings import SemanticSearchEngine

# Keywords that signal a scheme/benefits query
SCHEME_KEYWORDS = [
    "scheme", "scholarship", "subsidy", "benefit", "yojana", "pension",
    "loan", "grant", "farmer", "kisan", "student", "education",
    "university", "college", "apply", "eligible", "eligibility",
    "government", "sarkari", "welfare", "financial", "assistance",
    "insurance", "health", "ayushman", "pm-kisan", "vishwakarma",
    "matric", "ration", "housing", "awas", "mudra"
]

# All Indian states for extraction
INDIAN_STATES = [
    "andhra pradesh", "arunachal pradesh", "assam", "bihar", "chhattisgarh",
    "goa", "gujarat", "haryana", "himachal pradesh", "jharkhand", "karnataka",
    "kerala", "madhya pradesh", "maharashtra", "manipur", "meghalaya", "mizoram",
    "nagaland", "odisha", "punjab", "rajasthan", "sikkim", "tamil nadu",
    "telangana", "tripura", "uttar pradesh", "uttarakhand", "west bengal",
    "delhi", "jammu and kashmir", "ladakh", "chandigarh", "puducherry"
]

# Caste/Category keywords
CATEGORY_KEYWORDS = {
    "general": "General", "gen": "General", "ur": "General",
    "sc": "SC", "scheduled caste": "SC",
    "st": "ST", "scheduled tribe": "ST",
    "obc": "OBC", "other backward": "OBC",
    "ews": "EWS", "economically weaker": "EWS"
}


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

    # ----------------------------------------------------------------
    # INTENT DETECTION
    # ----------------------------------------------------------------
    def detect_intent(self, user_message: str) -> str:
        """
        Returns one of: 'greeting', 'scheme_query', 'general_chat'
        """
        msg = user_message.strip().lower()
        msg_clean = re.sub(r'[^\w\s]', '', msg)

        # Check greeting
        greetings = {
            "hello", "hi", "hey", "namaste", "namaskar", "pranam",
            "good morning", "good afternoon", "good evening", "greetings",
            "who are you", "what is your name", "start", "menu"
        }
        words = msg_clean.split()
        if msg_clean in greetings:
            return "greeting"
        if len(words) <= 2 and any(w in greetings for w in words):
            return "greeting"

        # Check scheme query
        if any(kw in msg for kw in SCHEME_KEYWORDS):
            return "scheme_query"

        # Default: general chat
        return "general_chat"

    # ----------------------------------------------------------------
    # PROFILE EXTRACTION from user message
    # ----------------------------------------------------------------
    def extract_profile_from_message(self, user_message: str) -> Dict[str, Any]:
        """
        Extracts Age, Category/Caste, and State from a free-text message.
        e.g. "I am 21 years old, General category, from Punjab" or "Gen Punjab 500000"
        """
        msg_lower = user_message.lower()
        extracted = {}

        # Extract age (look for numbers 1-120)
        age_match = re.search(r'\b(\d{1,3})\s*(?:year|yr|age|sal)?\b', msg_lower)
        if age_match:
            age_val = int(age_match.group(1))
            if 1 <= age_val <= 120:
                extracted["age"] = age_val

        # Extract category / caste
        for keyword, category in CATEGORY_KEYWORDS.items():
            if keyword in msg_lower:
                extracted["category"] = category
                break

        # Extract state
        for state in INDIAN_STATES:
            if state in msg_lower:
                extracted["state"] = state.title()
                break

        # Extract income (look for large numbers)
        income_match = re.search(r'(\d[\d,]*)\s*(?:lakh|lac|lpa|income|rs|rupee)?', msg_lower)
        if income_match:
            raw = income_match.group(1).replace(',', '')
            val = int(raw)
            if val > 120:  # Not an age, likely income
                extracted["incomeValue"] = val

        return extracted

    def has_sufficient_profile(self, citizen_profile: Optional[Dict[str, Any]]) -> bool:
        """
        Checks if we have enough profile data (age + caste + state) to give customized results.
        """
        if not citizen_profile:
            return False
        has_age = bool(citizen_profile.get("age"))
        has_caste = bool(citizen_profile.get("category"))
        has_state = bool(citizen_profile.get("state"))
        return has_age and has_caste and has_state

    # ----------------------------------------------------------------
    # GENERAL CHAT (non-scheme conversation via Groq LLM)
    # ----------------------------------------------------------------
    def generate_general_chat(self, user_message: str, language: str = "en") -> str:
        """
        Uses Groq LLM to have a friendly, general conversation when the user is NOT asking about schemes.
        """
        if not self.client:
            return (
                "Namaste! I am Sarthi, your AI Benefits Copilot.\n\n"
                "I can help you find government welfare schemes, scholarships, subsidies, and more.\n"
                "Just tell me what you are looking for!"
            )

        try:
            system_prompt = (
                "You are Sarthi, a warm and friendly AI assistant created for Indian citizens.\n"
                f"Respond in language code '{language}' (or match the user's input language).\n"
                "You help people discover government welfare schemes, scholarships, and subsidies.\n"
                "When the user is making general conversation (not asking about a specific scheme), "
                "respond naturally and warmly like a helpful friend.\n"
                "Keep responses short (2-4 sentences max).\n"
                "DO NOT USE ANY EMOJIS.\n"
                "If the conversation seems to be heading towards a scheme query, gently guide them "
                "by saying something like: 'If you are looking for government schemes, just let me know "
                "and I can help you find the best ones for your profile!'"
            )

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                model="groq/compound-mini",
                temperature=0.5,
                max_tokens=200
            )

            response_text = chat_completion.choices[0].message.content
            clean_text = re.sub(r'[\U00010000-\U0010ffff\u2600-\u26FF\u2700-\u27BF]', '', response_text)
            return clean_text.strip()
        except Exception as e:
            print(f"[RAGCopilot General Chat Error] {e}")
            return (
                "Namaste! I am Sarthi, your AI Benefits Copilot.\n\n"
                "I can help you find government welfare schemes, scholarships, subsidies, and more.\n"
                "Just tell me what you are looking for!"
            )

    # ----------------------------------------------------------------
    # SCHEME RESULTS (State Govt FIRST, then Central Govt)
    # ----------------------------------------------------------------
    def generate_scheme_response(
        self,
        user_message: str,
        citizen_profile: Dict[str, Any],
        search_results: List[Dict[str, Any]],
        explain_simply: bool = False,
        language: str = "en"
    ) -> str:
        """
        Generates customized scheme response with State Govt schemes FIRST, then Central Govt.
        Uses citizen profile (age, caste, state) for personalization.
        """
        bifurcated = self.bifurcate_schemes_by_level(search_results)
        state_list = bifurcated["state"]
        central_list = bifurcated["central"]
        user_state = citizen_profile.get("state", "your state")
        user_category = citizen_profile.get("category", "")
        user_age = citizen_profile.get("age", "")

        if self.client:
            try:
                system_prompt = (
                    "You are Sarthi Benefits Copilot, an expert AI assistant for Indian Government Welfare Schemes.\n"
                    f"Respond in language code '{language}' (or match the user's input language).\n"
                    f"The citizen is {user_age} years old, belongs to {user_category} category, and lives in {user_state}.\n"
                    "Answer accurately using ONLY the provided scheme context.\n"
                    "STRICT FORMATTING RULES:\n"
                    "1. DO NOT USE ANY EMOJIS.\n"
                    "2. Show STATE GOVERNMENT SCHEMES FIRST (personalized for the citizen's state).\n"
                    "3. Then show CENTRAL GOVERNMENT SCHEMES.\n"
                    "4. Use mid-dot bullet points '• ' for details.\n"
                    "5. For each scheme include: Scheme Name, Department, Financial Benefit, Required Documents.\n"
                    "6. End with Trust Signals (Official Source URL & Last Verified Date)."
                )

                context_str = f"=== STATE GOVERNMENT SCHEMES (for {user_state}) ===\n"
                for ss in state_list[:2]:
                    context_str += f"Scheme: {ss.get('name')} | Dept: {ss.get('department')} | Benefit: {ss.get('benefit')} | Docs: {', '.join(ss.get('documents', []))} | URL: {ss.get('officialUrl')}\n"

                context_str += "\n=== CENTRAL GOVERNMENT SCHEMES ===\n"
                for cs in central_list[:2]:
                    context_str += f"Scheme: {cs.get('name')} | Dept: {cs.get('department')} | Benefit: {cs.get('benefit')} | Docs: {', '.join(cs.get('documents', []))} | URL: {cs.get('officialUrl')}\n"

                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Context:\n{context_str}\n\nQuery: {user_message}"}
                    ],
                    model="groq/compound-mini",
                    temperature=0.2,
                    max_tokens=550
                )

                response_text = chat_completion.choices[0].message.content
                clean_text = re.sub(r'[\U00010000-\U0010ffff\u2600-\u26FF\u2700-\u27BF]', '', response_text)
                return clean_text.strip()
            except Exception as e:
                print(f"[RAGCopilot Scheme Response Error] {e}")

        # Fallback: structured response (State first, then Central)
        lines = [f"Based on your profile ({user_age} yrs, {user_category}, {user_state}):\n"]

        if state_list:
            s = state_list[0]
            lines.append(f"State Govt Schemes ({user_state}):")
            lines.append(f"Recommended: {s['name']}")
            lines.append(f"  • Department: {s['department']}")
            lines.append(f"  • Financial Benefit: {s['benefit']}")
            lines.append(f"  • Required Documents: {', '.join(s['documents'])}\n")

        if central_list:
            c = central_list[0]
            lines.append("Central Govt Schemes:")
            lines.append(f"Recommended: {c['name']}")
            lines.append(f"  • Department: {c['department']}")
            lines.append(f"  • Financial Benefit: {c['benefit']}")
            lines.append(f"  • Required Documents: {', '.join(c['documents'])}")

        return "\n".join(lines)

    def bifurcate_schemes_by_level(self, schemes: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Bifurcates schemes into Central and State Government Schemes."""
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

    # ----------------------------------------------------------------
    # MAIN PROCESS QUERY (3-Mode Intelligence)
    # ----------------------------------------------------------------
    def process_query(
        self,
        user_message: str,
        citizen_profile: Dict[str, Any] = None,
        explain_simply: bool = False,
        pincode: str = "",
        language: str = "en"
    ) -> Dict[str, Any]:
        """
        3-Mode Intelligent Processing:

        MODE 1: General Chat -> Friendly conversation via Groq LLM
        MODE 2: Scheme Query + Missing Profile -> ONLY ask for Age, Caste, State (no scheme dump)
        MODE 3: Scheme Query + Profile Provided -> State Govt schemes FIRST, then Central Govt
        """
        intent = self.detect_intent(user_message)

        # Also try to extract profile data from the current message
        extracted = self.extract_profile_from_message(user_message)
        merged_profile = dict(citizen_profile or {})
        merged_profile.update(extracted)

        # ── MODE 1: GREETING ──
        if intent == "greeting":
            greeting_reply = (
                "Namaste! I am Sarthi, your AI Government Benefits Copilot.\n\n"
                "How can I assist you today? You can ask me about:\n"
                "• Government welfare schemes & financial assistance\n"
                "• Student scholarships & university grants\n"
                "• Agricultural subsidies for farmers\n"
                "• Business loans & artisan incentives (e.g. PM Vishwakarma)\n\n"
                "Or tell me about yourself (your State, Age, Category/Caste) "
                "and I will find the best schemes for you!"
            )
            return {
                "reply": greeting_reply,
                "rawReply": greeting_reply,
                "isGreeting": True,
                "suggestedSchemes": [],
                "citations": [],
                "cscCenters": []
            }

        # ── MODE 1B: GENERAL CHAT (non-scheme conversation) ──
        if intent == "general_chat":
            chat_reply = self.generate_general_chat(user_message, language)
            return {
                "reply": chat_reply,
                "rawReply": chat_reply,
                "isGeneralChat": True,
                "suggestedSchemes": [],
                "citations": [],
                "cscCenters": []
            }

        # ── MODE 2: SCHEME QUERY but missing profile -> ASK FIRST, no schemes ──
        if intent == "scheme_query" and not self.has_sufficient_profile(merged_profile):
            missing = []
            if not merged_profile.get("age"):
                missing.append("Age (or date of birth)")
            if not merged_profile.get("category"):
                missing.append("Category / Caste (General / SC / ST / OBC / EWS)")
            if not merged_profile.get("state"):
                missing.append("State of Residence")

            profiling_reply = (
                "I would love to help you find the best schemes!\n\n"
                "To give you personalized State & Central government scheme recommendations, "
                "I need a few details first:\n"
            )
            for item in missing:
                profiling_reply += f"  • What is your {item}?\n"

            profiling_reply += (
                "\nPlease share these details and I will find the most relevant "
                "schemes tailored specifically for you."
            )

            return {
                "reply": profiling_reply,
                "rawReply": profiling_reply,
                "isProfilingRequest": True,
                "missingProfileAttributes": missing,
                "suggestedSchemes": [],
                "citations": [],
                "cscCenters": []
            }

        # ── MODE 3: SCHEME QUERY with sufficient profile -> CUSTOMIZED RESULTS ──
        search_results = self.search_engine.search_schemes(user_message, top_k=6)

        if not search_results:
            return {
                "reply": "I could not find a matching scheme for your query. Please try rephrasing or ask about a specific category like scholarships, farming subsidies, or housing schemes.",
                "suggestedSchemes": [],
                "citations": [],
                "cscCenters": []
            }

        top_scheme = search_results[0]

        # CSC Locator
        user_district = merged_profile.get("district", "Ludhiana")
        user_state = merged_profile.get("state", top_scheme.get("state", "Punjab"))
        nearest_cscs = self.kb.find_nearest_csc(pincode=pincode, district=user_district, state=user_state)

        # Trust Signals
        citations = []
        for criterion in top_scheme.get("criteria", []):
            citations.append({
                "source": criterion.get("source", top_scheme.get("name")),
                "clause": criterion.get("page", "Official Guidelines"),
                "text": criterion.get("why", "")
            })

        # Generate scheme response: State FIRST, then Central
        reply_text = self.generate_scheme_response(
            user_message,
            citizen_profile=merged_profile,
            search_results=search_results,
            explain_simply=explain_simply,
            language=language
        )

        # Append Trust Signals Footer
        trust_signal_banner = (
            f"\n\n---\n"
            f"• Official Source: {top_scheme.get('officialUrl', 'https://myscheme.gov.in')}\n"
            f"• Last Verified: {top_scheme.get('lastVerified', '22 Aug 2026')}\n"
            f"• Trust Guarantee: Grounded in official policy guidelines. Verify at your nearest CSC."
        )

        full_reply = reply_text + trust_signal_banner
        bifurcated = self.bifurcate_schemes_by_level(search_results)

        return {
            "reply": full_reply,
            "rawReply": reply_text,
            "topScheme": top_scheme,
            "centralSchemes": bifurcated["central"],
            "stateSchemes": bifurcated["state"],
            "suggestedSchemes": search_results,
            "citations": citations,
            "cscCenters": nearest_cscs,
            "citizenProfile": merged_profile,
            "trustSignals": {
                "officialUrl": top_scheme.get("officialUrl", "https://myscheme.gov.in"),
                "lastVerified": top_scheme.get("lastVerified", "22 Aug 2026"),
                "disclaimer": "Grounded in official policy guidelines. Verify at nearest CSC center."
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
