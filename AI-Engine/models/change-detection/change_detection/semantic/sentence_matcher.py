"""
Sentence-level semantic matching
"""
import logging
from typing import List, Dict, Tuple
import numpy as np
from .similarity import SimilarityComputer

logger = logging.getLogger(__name__)


class SentenceMatcher:
    """Match sentences between old and new text"""
    
    def __init__(self, embedding_provider, similarity_thresholds: dict):
        self.embedding_provider = embedding_provider
        self.thresholds = similarity_thresholds
    
    def split_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        import re
        
        # Simple sentence splitting by common punctuation
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        return sentences
    
    def match_sentences(self, old_sentences: List[str], new_sentences: List[str]) -> List[Dict]:
        """
        Match sentences using semantic similarity
        
        Returns:
            List of sentence matches
        """
        try:
            if not old_sentences or not new_sentences:
                return []
            
            old_embeddings = self.embedding_provider.embed_texts(old_sentences)
            new_embeddings = self.embedding_provider.embed_texts(new_sentences)
            
            if old_embeddings is None or new_embeddings is None:
                return []
            
            similarity_matrix = SimilarityComputer.similarity_matrix(old_embeddings, new_embeddings)
            
            matches = []
            used_new_indices = set()
            
            for i, old_sent in enumerate(old_sentences):
                similarities = similarity_matrix[i]
                sorted_indices = np.argsort(similarities)[::-1]
                
                for j in sorted_indices:
                    if j not in used_new_indices:
                        similarity = float(similarities[j])
                        
                        if similarity >= self.thresholds['medium']:
                            matches.append({
                                'old_sentence': old_sent,
                                'new_sentence': new_sentences[j],
                                'similarity': similarity,
                                'old_index': i,
                                'new_index': j
                            })
                            used_new_indices.add(j)
                        break
            
            return matches
        
        except Exception as e:
            logger.error(f"Error matching sentences: {e}")
            return []
    
    def extract_unmatched(self, matched_indices: Dict, total_new: int) -> List[int]:
        """Find indices of unmatched new sentences"""
        matched_new = set(matched_indices.get('new_indices', []))
        return [i for i in range(total_new) if i not in matched_new]
