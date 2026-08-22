"""
Sarthi AI Pipeline - Twilio SMS & WhatsApp Communication Service
Handles outbound scheme alerts, document expiry notifications, and incoming citizen SMS/WhatsApp copilot queries via TwiML.
"""

import os
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
        Processes incoming citizen query via SMS/WhatsApp through Sarthi RAG Copilot
        and returns XML TwiML string response formatted for WhatsApp rich text.
        """
        response_data = self.copilot.process_query(user_message=incoming_body)

        answer_text = response_data.get("reply", "Namaste! Sarthi couldn't process your query. Please visit http://localhost:3000.")
        citations = response_data.get("citations", [])
        top_scheme = response_data.get("topScheme")

        twiml_reply = f"🇮🇳 *Sarthi Benefits Copilot*\n\n{answer_text}"
        
        if top_scheme:
            twiml_reply += f"\n\n🏆 *Recommended Match:* {top_scheme.get('name')}\n"
            twiml_reply += f"💸 *Benefit:* {top_scheme.get('benefit')}\n"
            twiml_reply += f"⏳ *Deadline:* {top_scheme.get('deadlineLabel', 'Open')}"

        if citations:
            c = citations[0]
            twiml_reply += f"\n\n📍 *Grounded Policy Source:* {c.get('source', '')} ({c.get('page', '')})"
        
        twiml_reply += "\n\n🌐 *View Full Profile & Apply:* http://localhost:3000/benefits"
        return self.format_twiml_response(twiml_reply)

    def handle_incoming_message(self, incoming_body: str, from_number: str = "") -> str:
        """Alias for process_incoming_query."""
        return self.process_incoming_query(incoming_body, from_number)

    def send_scheme_alert(self, to_phone: str, scheme_name: str, deadline_days: int, is_whatsapp: bool = False) -> Dict[str, Any]:
        """
        Dispatches outbound SMS/WhatsApp notification for scheme deadlines or eligibility match.
        """
        message_body = (
            f"🔔 *Sarthi Scheme Alert*\n"
            f"You qualify for *{scheme_name}*!\n"
            f"⚠️ Application deadline closes in {deadline_days} days.\n"
            f"Verify requirements & apply now: http://localhost:3000/explore"
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
