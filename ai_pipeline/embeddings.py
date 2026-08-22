"""
Sarthi AI Pipeline - Hybrid Embeddings & Semantic Search Engine
Computes semantic similarity between citizen queries, profile attributes, and government scheme descriptions.
"""

import math
import re
from typing import List, Dict, Any
from ai_pipeline.knowledge_base import KnowledgeBase

class SemanticSearchEngine:
    def __init__(self, kb: KnowledgeBase):
        self.kb = kb

    def _tokenize(self, text: str) -> List[str]:
        """Normalizes and tokenizes text into lowercase alphanumeric tokens."""
        return re.findall(r'\w+', text.lower())

    def _compute_tf_idf_similarity(self, query: str, document: str) -> float:
        """Calculates cosine similarity based on term frequencies between query and document."""
        query_tokens = self._tokenize(query)
        doc_tokens = self._tokenize(document)

        if not query_tokens or not doc_tokens:
            return 0.0

        q_vocab = set(query_tokens)
        q_freq = {t: query_tokens.count(t) for t in q_vocab}
        d_vocab = set(doc_tokens)
        d_freq = {t: doc_tokens.count(t) for t in d_vocab}

        dot_product = sum(q_freq[t] * d_freq.get(t, 0) for t in q_vocab)
        q_magnitude = math.sqrt(sum(count ** 2 for count in q_freq.values()))
        d_magnitude = math.sqrt(sum(count ** 2 for count in d_freq.values()))

        if q_magnitude == 0 or d_magnitude == 0:
            return 0.0

        return dot_product / (q_magnitude * d_magnitude)

    def search_schemes(self, query: str, category_filter: str = None, state_filter: str = None, top_k: int = 10) -> List[Dict[str, Any]]:
        """
        Performs hybrid semantic matching over all scheme metadata in the knowledge base.
        """
        all_schemes = self.kb.get_all_schemes()
        results = []

        for scheme in all_schemes:
            if category_filter and category_filter.lower() != "all" and scheme.get("category", "").lower() != category_filter.lower():
                continue
            if state_filter and state_filter.lower() != "all india" and scheme.get("state") not in [state_filter, "All India"]:
                continue

            doc_text = f"{scheme['name']} {scheme['nameHi']} {scheme['department']} {scheme['category']} {scheme['summary']} {scheme['benefitDetail']} {' '.join(scheme['documents'])}"
            similarity_score = self._compute_tf_idf_similarity(query, doc_text)

            # Boost score if query matches category or title keywords directly
            query_lower = query.lower()
            if scheme['category'].lower() in query_lower:
                similarity_score += 0.25
            if any(term in doc_text.lower() for term in query_lower.split()):
                similarity_score += 0.15

            # Calculate match percentage (scaled 60-98%)
            match_percentage = min(98, max(50, int(similarity_score * 100) + 65))

            scheme_result = dict(scheme)
            scheme_result["match"] = match_percentage
            scheme_result["relevanceScore"] = round(similarity_score, 4)
            results.append(scheme_result)

        results.sort(key=lambda x: x["relevanceScore"], reverse=True)
        return results[:top_k]
