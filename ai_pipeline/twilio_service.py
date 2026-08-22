"""
Sarthi AI Pipeline - Twilio WhatsApp Service with Per-User Session Memory

Session Memory Flow:
1. User sends "Hello" -> General chat, friendly response
2. User sends "Cool" / "How are you" -> General chat via Groq LLM (natural conversation)
3. User sends "Scholarship schemes" -> Detects scheme intent, asks for Age, Category, State
4. User sends "17 Punjab Gen" -> Recognizes as profile data for pending scheme query,
   injects into RAG pipeline, returns personalized State-first + Central scheme results
"""

import os
import time
from typing import Dict, Any, Optional
from ai_pipeline.knowledge_base import KnowledgeBase
from ai_pipeline.embeddings import SemanticSearchEngine
from ai_pipeline.rag_copilot import RAGCopilot


class TwilioService:
    def __init__(self, kb: Optional[KnowledgeBase] = None, search_engine: Optional[SemanticSearchEngine] = None):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID", "AC_MOCK_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN", "MOCK_AUTH_TOKEN")
        self.from_phone = os.getenv("TWILIO_PHONE_NUMBER", "+18005550199")
        self.whatsapp_from = os.getenv("TWILIO_WHATSAPP_NUMBER", "whatsapp:+14155238886")

        self.kb = kb or KnowledgeBase()
        self.search_engine = search_engine or SemanticSearchEngine(self.kb)
        self.copilot = RAGCopilot(self.kb, self.search_engine)

        # Per-user session memory: { phone_number: { pending_query, profile, timestamp } }
        self.sessions: Dict[str, Dict[str, Any]] = {}

        # Session expires after 10 minutes of inactivity
        self.SESSION_TIMEOUT = 600

    def get_session(self, phone: str) -> Dict[str, Any]:
        """Gets or creates a session for a phone number. Expires stale sessions."""
        now = time.time()
        if phone in self.sessions:
            session = self.sessions[phone]
            if now - session.get("last_active", 0) > self.SESSION_TIMEOUT:
                # Session expired, reset
                self.sessions[phone] = {"profile": {}, "pending_query": "", "last_active": now}
            else:
                session["last_active"] = now
            return self.sessions[phone]
        else:
            self.sessions[phone] = {"profile": {}, "pending_query": "", "last_active": now}
            return self.sessions[phone]

    def format_twiml_response(self, text: str) -> str:
        """Generates TwiML XML response for Twilio webhook HTTP callback."""
        escaped_text = (
            text.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
        )
        return (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            "<Response>\n"
            f"    <Message>{escaped_text}</Message>\n"
            "</Response>"
        )

    def process_incoming_query(self, incoming_body: str, sender_number: str = "") -> str:
        """
        Processes incoming WhatsApp/SMS query with session-aware multi-turn logic:

        Turn 1: General chat -> Groq LLM friendly response
        Turn 2: Scheme query detected -> Ask for Age, Category, State (store pending query)
        Turn 3: Profile data received -> Inject into RAG with pending query for personalized results
        """
        session = self.get_session(sender_number)
        msg = incoming_body.strip()

        # Step 1: Detect intent of current message
        intent = self.copilot.detect_intent(msg)

        # Step 2: Try to extract profile data from this message
        extracted_profile = self.copilot.extract_profile_from_message(msg)

        # Step 3: Check if user is responding to a pending scheme query with profile data
        if session.get("pending_query") and extracted_profile:
            # Merge new profile data into session
            session["profile"].update(extracted_profile)

            # Check if we now have enough profile info
            if self.copilot.has_sufficient_profile(session["profile"]):
                # We have everything! Run the scheme query with full profile
                pending_query = session["pending_query"]
                full_profile = dict(session["profile"])

                # Clear the pending query (fulfilled)
                session["pending_query"] = ""

                response_data = self.copilot.process_query(
                    user_message=pending_query,
                    citizen_profile=full_profile
                )

                reply = response_data.get("reply", "Sorry, I could not find matching schemes.")
                return self.format_twiml_response(reply)
            else:
                # Still missing some fields, ask again
                missing = []
                if not session["profile"].get("age"):
                    missing.append("Age (or date of birth)")
                if not session["profile"].get("category"):
                    missing.append("Category / Caste (General / SC / ST / OBC / EWS)")
                if not session["profile"].get("state"):
                    missing.append("State of Residence")

                still_need = (
                    "Thank you! I still need a few more details:\n"
                )
                for item in missing:
                    still_need += f"  - What is your {item}?\n"

                return self.format_twiml_response(still_need)

        # Step 4: If this is a scheme query, store it and ask for profile
        if intent == "scheme_query":
            # Store the scheme query in session
            session["pending_query"] = msg

            # Merge any profile data already in this message
            if extracted_profile:
                session["profile"].update(extracted_profile)

            # Check if profile is already sufficient (e.g. "scholarship for 21 yr old Gen Punjab")
            if self.copilot.has_sufficient_profile(session["profile"]):
                session["pending_query"] = ""
                response_data = self.copilot.process_query(
                    user_message=msg,
                    citizen_profile=session["profile"]
                )
                reply = response_data.get("reply", "Sorry, I could not find matching schemes.")
                return self.format_twiml_response(reply)

            # Ask for missing profile details
            response_data = self.copilot.process_query(user_message=msg)
            reply = response_data.get("reply", "")
            return self.format_twiml_response(reply)

        # Step 5: Greeting
        if intent == "greeting":
            response_data = self.copilot.process_query(user_message=msg)
            reply = response_data.get("reply", "Namaste! I am Sarthi.")
            return self.format_twiml_response(reply)

        # Step 6: General chat (use Groq LLM for natural conversation)
        chat_reply = self.copilot.generate_general_chat(msg)
        return self.format_twiml_response(chat_reply)

    def handle_incoming_message(self, incoming_body: str, from_number: str = "") -> str:
        """Alias for process_incoming_query."""
        return self.process_incoming_query(incoming_body, from_number)

    def send_scheme_alert(self, to_phone: str, scheme_name: str, deadline_days: int, is_whatsapp: bool = False) -> Dict[str, Any]:
        """
        Dispatches outbound SMS/WhatsApp notification for scheme deadlines or eligibility match.
        """
        message_body = (
            f"*Sarthi Scheme Alert*\n"
            f"You qualify for *{scheme_name}*.\n"
            f"- Application deadline closes in {deadline_days} days.\n"
            f"- Verify requirements & apply: http://localhost:3000/explore"
        )

        sender = self.whatsapp_from if is_whatsapp else self.from_phone
        recipient = f"whatsapp:{to_phone}" if is_whatsapp and not to_phone.startswith("whatsapp:") else to_phone

        return {
            "status": "queued",
            "sid": f"SM{os.urandom(8).hex()}",
            "from": sender,
            "to": recipient,
            "body": message_body,
            "simulated": True if "MOCK" in self.account_sid else False
        }
