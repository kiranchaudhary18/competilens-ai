"""
Embedding provider using sentence-transformers
"""
import logging
from typing import List, Dict, Optional, Tuple
import numpy as np
from pathlib import Path
import hashlib
import json

logger = logging.getLogger(__name__)


class EmbeddingProvider:
    """
    Manages embeddings using sentence-transformers
    Falls back gracefully if transformers not installed
    """
    
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2", cache_dir: Optional[str] = None):
        """
        Initialize embedding provider
        
        Args:
            model_name: HuggingFace model identifier
            cache_dir: Directory to cache embeddings
        """
        self.model_name = model_name
        self.cache_dir = Path(cache_dir) if cache_dir else Path.cwd() / "artifacts" / "embeddings"
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        
        self.model = None
        self.model_loaded = False
        self._load_model()
    
    def _load_model(self):
        """Load the embedding model"""
        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading embedding model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            self.model_loaded = True
            logger.info("Model loaded successfully")
        except ImportError:
            logger.warning(
                "sentence-transformers not installed. "
                "Install with: pip install sentence-transformers torch"
            )
            self.model_loaded = False
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            self.model_loaded = False
    
    def _get_embedding_cache_path(self, text_hash: str) -> Path:
        """Get cache file path for embedding"""
        return self.cache_dir / f"{text_hash}.npy"
    
    def _hash_text(self, text: str) -> str:
        """Create hash of text for caching"""
        return hashlib.md5(text.encode()).hexdigest()
    
    def _load_cached_embedding(self, text_hash: str) -> Optional[np.ndarray]:
        """Load embedding from cache if exists"""
        cache_path = self._get_embedding_cache_path(text_hash)
        if cache_path.exists():
            try:
                return np.load(cache_path)
            except Exception as e:
                logger.warning(f"Failed to load cached embedding: {e}")
        return None
    
    def _save_embedding_cache(self, text_hash: str, embedding: np.ndarray):
        """Save embedding to cache"""
        try:
            cache_path = self._get_embedding_cache_path(text_hash)
            np.save(cache_path, embedding)
        except Exception as e:
            logger.warning(f"Failed to cache embedding: {e}")
    
    def embed_text(self, text: str) -> Optional[np.ndarray]:
        """
        Embed a single text
        
        Args:
            text: Text to embed
            
        Returns:
            Embedding vector or None if model not loaded
        """
        if not self.model_loaded:
            logger.warning("Embedding model not loaded, cannot embed text")
            return None
        
        text_hash = self._hash_text(text)
        
        # Try cache first
        cached = self._load_cached_embedding(text_hash)
        if cached is not None:
            return cached
        
        try:
            embedding = self.model.encode(text, convert_to_numpy=True)
            self._save_embedding_cache(text_hash, embedding)
            return embedding
        except Exception as e:
            logger.error(f"Failed to embed text: {e}")
            return None
    
    def embed_texts(self, texts: List[str], batch_size: int = 32) -> Optional[np.ndarray]:
        """
        Embed multiple texts efficiently
        
        Args:
            texts: List of texts to embed
            batch_size: Batch size for processing
            
        Returns:
            2D numpy array of embeddings or None if model not loaded
        """
        if not self.model_loaded:
            logger.warning("Embedding model not loaded")
            return None
        
        if not texts:
            return np.array([])
        
        try:
            embeddings = self.model.encode(texts, batch_size=batch_size, convert_to_numpy=True)
            
            # Cache individual embeddings
            for text, embedding in zip(texts, embeddings):
                text_hash = self._hash_text(text)
                self._save_embedding_cache(text_hash, embedding)
            
            return embeddings
        except Exception as e:
            logger.error(f"Failed to embed texts: {e}")
            return None
    
    def get_model_dimension(self) -> int:
        """Get embedding dimension"""
        if not self.model_loaded:
            return 0
        try:
            return self.model.get_sentence_embedding_dimension()
        except:
            return 384  # Default for all-MiniLM-L6-v2
    
    def clear_cache(self):
        """Clear embedding cache"""
        try:
            import shutil
            if self.cache_dir.exists():
                shutil.rmtree(self.cache_dir)
                self.cache_dir.mkdir(parents=True, exist_ok=True)
                logger.info("Embedding cache cleared")
        except Exception as e:
            logger.error(f"Failed to clear cache: {e}")
