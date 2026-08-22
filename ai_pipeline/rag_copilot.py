"""
Sarthi AI Pipeline - Multilingual RAG AI Copilot
Processes text/voice user queries using hybrid vector search & optional Groq LLM generation.
Constructs grounded responses with official scheme citations.
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

        if self.groq_api_key and not self.groq_api_key.startswith("your_"):
            try:
                from groq import Groq
                self.client = Groq(api_key=self.groq_api_key)
            except Exception as e:
                print(f"[RAGCopilot Warning] Could not initialize Groq client: {e}")

    def generate_groq_response(self, user_message: str, top_scheme: Dict[str, Any], all_schemes: List[Dict[str, Any]], language: str = "en") -> Optional[str]:
        """
        Uses Groq LLM (llama-3.3-70b-versatile) to synthesize a human-like, grounded response using retrieved scheme context.
        """
        if not self.client:
            return None

        try:
            system_prompt = (
                "You are Sarthi, an expert AI Copilot for Indian Government Welfare Schemes.\n"
                "Answer the citizen's query accurately using ONLY the provided scheme context below.\n"
                "Rules:\n"
                "1. Keep responses clear, helpful, and concise.\n"
                "2. Highlight matching scheme name, cash benefits, department, and required documents.\n"
                "3. Use clean markdown formatting with emojis (e.g. 🇮🇳, 🏆, 💸, 📍, 📄).\n"
                "4. If query is in Hindi/Punjabi, respond in that language.\n"
                "5. Never invent or hallucinate scheme facts outside the provided context."
            )

            context_str = f"Target Scheme: {top_scheme.get('name')}\n"
            context_str += f"Benefit: {top_scheme.get('benefit')} ({top_scheme.get('benefitDetail')})\n"
            context_str += f"Department: {top_scheme.get('department')}\n"
            context_str += f"Documents Required: {', '.join(top_scheme.get('documents', []))}\n"
            context_str += f"Eligibility Summary: {top_scheme.get('summary')}\n\n"
            context_str += f"Other Relevant Schemes: {', '.join([s.get('name') for s in all_schemes[1:]])}"

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Scheme Context:\n{context_str}\n\nCitizen Query: {user_message}"}
                ],
                model="groq/compound-mini",
                temperature=0.3,
                max_tokens=400
            )

            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"[RAGCopilot Groq Fallback] Error generating response: {e}")
            return None

    def process_query(self, user_message: str, citizen_profile: Dict[str, Any] = None, language: str = "en") -> Dict[str, Any]:
        """
        Retrieves matching policy guidelines and constructs a grounded RAG copilot response with exact citations.
        """
        search_results = self.search_engine.search_schemes(user_message, top_k=3)

        if not search_results:
            return {
                "reply": "Namaste! I couldn't find a direct policy match for your query. Could you please specify your state, occupation, or required benefit?",
                "suggestedSchemes": [],
                "citations": []
            }

        top_scheme = search_results[0]
        citations = []
        for criterion in top_scheme.get("criteria", []):
            citations.append({
                "source": criterion.get("source", "Official Scheme Guidelines"),
                "clause": criterion.get("page", "General Provision"),
                "text": criterion.get("why", "")
            })

        # Attempt Groq LLM synthesis
        groq_reply = self.generate_groq_response(user_message, top_scheme, search_results, language=language)

        if groq_reply:
            reply_text = groq_reply
        else:
            # Fallback template-based RAG response
            if language in ["hi", "hindi"]:
                reply_text = f"आपके प्रोफाइल के आधार पर, **{top_scheme['nameHi']}** आपके लिए सबसे उपयुक्त योजना है।\n\n**लाभ:** {top_scheme['benefit']} ({top_scheme['benefitDetail']})\n**विभाग:** {top_scheme['department']}\n**आवश्यक दस्तावेज:** {', '.join(top_scheme['documents'])}"
            else:
                reply_text = f"Based on your profile, **{top_scheme['name']}** is the top matching government scheme.\n\n" \
                             f"• **Benefit:** {top_scheme['benefit']} ({top_scheme['benefitDetail']})\n" \
                             f"• **Department:** {top_scheme['department']}\n" \
                             f"• **Required Documents:** {', '.join(top_scheme['documents'])}\n\n" \
                             f"**Eligibility Summary:** {top_scheme['summary']}"

        return {
            "reply": reply_text,
            "topScheme": top_scheme,
            "suggestedSchemes": search_results,
            "citations": citations,
            "actionButtons": [
                {"label": f"Check {top_scheme['name']} Eligibility", "action": f"/scheme/{top_scheme['id']}"},
                {"label": "Explore All Schemes", "action": "/explore"}
            ]
        }
