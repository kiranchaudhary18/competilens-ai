"""
Semantic matching and alignment of similar items
"""
import logging
from typing import List, Tuple, Dict, Optional
import numpy as np
from .similarity import SimilarityComputer, ThresholdAnalyzer

logger = logging.getLogger(__name__)


class SemanticMatcher:
    """Match semantically similar items between old and new content"""
    
    def __init__(self, embedding_provider, similarity_thresholds: dict):
        """
        Args:
            embedding_provider: EmbeddingProvider instance
            similarity_thresholds: Dict with 'high', 'medium', 'low' thresholds
        """
        self.embedding_provider = embedding_provider
        self.thresholds = similarity_thresholds
    
    def match_items(self, old_items: List[str], new_items: List[str]) -> List[Dict]:
        """
        Match items from old list to new list using semantic similarity
        
        Returns:
            List of matches with format:
            {
                'old_item': str,
                'new_item': str,
                'old_index': int,
                'new_index': int,
                'similarity': float,
                'match_type': 'high_match' | 'medium_match' | 'low_match' | 'no_match'
            }
        """
        if not old_items or not new_items:
            return []
        
        try:
            # Get embeddings
            old_embeddings = self.embedding_provider.embed_texts(old_items)
            new_embeddings = self.embedding_provider.embed_texts(new_items)
            
            if old_embeddings is None or new_embeddings is None:
                return []
            
            # Compute similarity matrix
            similarity_matrix = SimilarityComputer.similarity_matrix(old_embeddings, new_embeddings)
            
            # Find best matches
            matches = []
            used_new_indices = set()
            
            # Process each old item
            for i, old_item in enumerate(old_items):
                # Find best match in new items
                similarities = similarity_matrix[i]
                sorted_indices = np.argsort(similarities)[::-1]  # Sort descending
                
                for j in sorted_indices:
                    if j not in used_new_indices:
                        similarity = float(similarities[j])
                        match_type = ThresholdAnalyzer.classify_similarity(
                            similarity,
                            self.thresholds
                        )
                        
                        if match_type != 'no_match':  # Only include meaningful matches
                            matches.append({
                                'old_item': old_item,
                                'new_item': new_items[j],
                                'old_index': i,
                                'new_index': j,
                                'similarity': similarity,
                                'match_type': match_type
                            })
                            used_new_indices.add(j)
                        break
            
            return sorted(matches, key=lambda x: x['similarity'], reverse=True)
        
        except Exception as e:
            logger.error(f"Error in semantic matching: {e}")
            return []
    
    def find_similar_items(self, query_item: str, candidate_items: List[str]) -> List[Tuple[int, str, float]]:
        """
        Find items similar to a query item
        
        Returns:
            List of (index, item, similarity) sorted by similarity descending
        """
        try:
            query_embedding = self.embedding_provider.embed_text(query_item)
            candidate_embeddings = self.embedding_provider.embed_texts(candidate_items)
            
            if query_embedding is None or candidate_embeddings is None:
                return []
            
            results = []
            for idx, item in enumerate(candidate_items):
                similarity = SimilarityComputer.cosine_similarity(
                    query_embedding,
                    candidate_embeddings[idx]
                )
                results.append((idx, item, similarity))
            
            return sorted(results, key=lambda x: x[2], reverse=True)
        
        except Exception as e:
            logger.error(f"Error finding similar items: {e}")
            return []


class TextAlignment:
    """Align similar text segments between two documents"""
    
    def __init__(self, embedding_provider, similarity_thresholds: dict):
        self.embedding_provider = embedding_provider
        self.thresholds = similarity_thresholds
    
    def chunk_text(self, text: str, chunk_size: int = 100, overlap: int = 20) -> List[Tuple[str, int]]:
        """
        Split text into overlapping chunks
        
        Returns:
            List of (chunk, start_index) tuples
        """
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk_words = words[i:i + chunk_size]
            if chunk_words:
                chunk = ' '.join(chunk_words)
                chunks.append((chunk, i))
        
        return chunks
    
    def align_texts(self, old_text: str, new_text: str, chunk_size: int = 100) -> List[Dict]:
        """
        Align similar sections between old and new text
        
        Returns:
            List of alignments with similarity scores
        """
        try:
            old_chunks = self.chunk_text(old_text, chunk_size=chunk_size)
            new_chunks = self.chunk_text(new_text, chunk_size=chunk_size)
            
            if not old_chunks or not new_chunks:
                return []
            
            # Get embeddings
            old_texts = [chunk[0] for chunk in old_chunks]
            new_texts = [chunk[0] for chunk in new_chunks]
            
            old_embeddings = self.embedding_provider.embed_texts(old_texts)
            new_embeddings = self.embedding_provider.embed_texts(new_texts)
            
            if old_embeddings is None or new_embeddings is None:
                return []
            
            # Find alignments
            similarities = SimilarityComputer.similarity_matrix(old_embeddings, new_embeddings)
            
            alignments = []
            for i, (old_chunk, old_idx) in enumerate(old_chunks):
                for j, (new_chunk, new_idx) in enumerate(new_chunks):
                    similarity = float(similarities[i][j])
                    
                    if similarity >= self.thresholds['medium']:
                        alignments.append({
                            'old_chunk': old_chunk,
                            'new_chunk': new_chunk,
                            'old_index': old_idx,
                            'new_index': new_idx,
                            'similarity': similarity
                        })
            
            return sorted(alignments, key=lambda x: x['similarity'], reverse=True)
        
        except Exception as e:
            logger.error(f"Error aligning texts: {e}")
            return []
