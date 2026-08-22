"""
Sarthi AI Pipeline - Multilingual RAG AI Copilot
Processes text/voice user queries, searches policy knowledge nodes, and constructs grounded responses with official citations.
"""

from typing import Dict, Any, List
from ai_pipeline.knowledge_base import KnowledgeBase
from ai_pipeline.embeddings import SemanticSearchEngine

class RAGCopilot:
    def __init__(self, kb: KnowledgeBase, search_engine: SemanticSearchEngine):
        self.kb = kb
        self.search_engine = search_engine

    def process_query(self, user_message: str, citizen_profile: Dict[str, Any] = None, language: str = "en") -> Dict[str, Any]:
        """
        Retrieves matching policy guidelines and constructs a grounded RAG copilot response with exact citations.
        """
        search_results = self.search_engine.search_schemes(user_message, top_k=3)

        if not search_results:
            return {
                "reply": "I couldn't find a direct policy match for your query. Could you please specify your state, occupation, or what benefit you are seeking?",
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

        # Multilingual reply generation
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
