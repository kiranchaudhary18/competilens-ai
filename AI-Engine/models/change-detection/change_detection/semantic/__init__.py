"""Semantic module"""
from .embedding_provider import EmbeddingProvider
from .similarity import SimilarityComputer, ThresholdAnalyzer
from .alignment import SemanticMatcher, TextAlignment
from .sentence_matcher import SentenceMatcher

__all__ = [
    'EmbeddingProvider',
    'SimilarityComputer',
    'ThresholdAnalyzer',
    'SemanticMatcher',
    'TextAlignment',
    'SentenceMatcher'
]
