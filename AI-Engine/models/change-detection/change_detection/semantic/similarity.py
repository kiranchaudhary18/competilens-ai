"""
Similarity computation between embeddings
"""
import numpy as np
from typing import Optional, List, Tuple
import logging

logger = logging.getLogger(__name__)


class SimilarityComputer:
    """Compute similarity between embeddings"""
    
    @staticmethod
    def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
        """
        Compute cosine similarity between two vectors
        
        Returns:
            Similarity score between 0 and 1
        """
        if vec1 is None or vec2 is None:
            return 0.0
        
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        similarity = np.dot(vec1, vec2) / (norm1 * norm2)
        # Cosine similarity is in range [-1, 1], normalize to [0, 1]
        return (similarity + 1) / 2
    
    @staticmethod
    def euclidean_distance(vec1: np.ndarray, vec2: np.ndarray) -> float:
        """Compute Euclidean distance"""
        if vec1 is None or vec2 is None:
            return float('inf')
        
        distance = np.linalg.norm(vec1 - vec2)
        return float(distance)
    
    @staticmethod
    def manhattan_distance(vec1: np.ndarray, vec2: np.ndarray) -> float:
        """Compute Manhattan distance"""
        if vec1 is None or vec2 is None:
            return float('inf')
        
        distance = np.sum(np.abs(vec1 - vec2))
        return float(distance)
    
    @staticmethod
    def similarity_matrix(embeddings1: np.ndarray, embeddings2: np.ndarray) -> np.ndarray:
        """
        Compute pairwise similarity matrix between two sets of embeddings
        
        Args:
            embeddings1: Shape (n, d)
            embeddings2: Shape (m, d)
            
        Returns:
            Similarity matrix of shape (n, m)
        """
        if embeddings1 is None or embeddings2 is None or len(embeddings1) == 0 or len(embeddings2) == 0:
            return np.array([])
        
        # Normalize embeddings
        norm1 = embeddings1 / np.linalg.norm(embeddings1, axis=1, keepdims=True)
        norm2 = embeddings2 / np.linalg.norm(embeddings2, axis=1, keepdims=True)
        
        # Compute similarity
        similarities = np.dot(norm1, norm2.T)
        
        # Normalize to [0, 1]
        similarities = (similarities + 1) / 2
        
        return similarities
    
    @staticmethod
    def find_best_match(embedding1: np.ndarray, embeddings2: np.ndarray) -> Tuple[int, float]:
        """
        Find best matching embedding from a set
        
        Returns:
            Tuple of (index, similarity_score)
        """
        if embeddings2 is None or len(embeddings2) == 0:
            return -1, 0.0
        
        similarities = [
            SimilarityComputer.cosine_similarity(embedding1, emb)
            for emb in embeddings2
        ]
        
        best_idx = np.argmax(similarities)
        best_score = similarities[best_idx]
        
        return best_idx, float(best_score)


class ThresholdAnalyzer:
    """Analyze similarity scores to determine thresholds"""
    
    @staticmethod
    def classify_similarity(score: float, thresholds: dict) -> str:
        """
        Classify similarity score based on thresholds
        
        Args:
            score: Similarity score
            thresholds: Dict with keys 'high', 'medium', 'low'
        """
        if score >= thresholds.get('high', 0.88):
            return 'high_match'
        elif score >= thresholds.get('medium', 0.72):
            return 'medium_match'
        elif score >= thresholds.get('low', 0.50):
            return 'low_match'
        else:
            return 'no_match'
    
    @staticmethod
    def compute_statistics(similarity_scores: List[float]) -> dict:
        """Compute statistics on a set of similarity scores"""
        if not similarity_scores:
            return {
                'min': 0,
                'max': 0,
                'mean': 0,
                'median': 0,
                'std': 0,
                'q25': 0,
                'q75': 0
            }
        
        arr = np.array(similarity_scores)
        
        return {
            'min': float(np.min(arr)),
            'max': float(np.max(arr)),
            'mean': float(np.mean(arr)),
            'median': float(np.median(arr)),
            'std': float(np.std(arr)),
            'q25': float(np.percentile(arr, 25)),
            'q75': float(np.percentile(arr, 75))
        }
