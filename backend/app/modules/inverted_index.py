"""
Base class for inverted index implementation.
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Set, Optional
from datetime import datetime


class InvertedIndex(ABC):
    """
    Abstract base class for inverted index implementations.
    
    An inverted index maps words to the documents that contain them.
    """
    
    def __init__(self):
        """Initialize the inverted index."""
        self.word_to_documents: Dict[str, Set[str]] = {}
        self.document_to_words: Dict[str, Set[str]] = {}
        self.created_at: Optional[datetime] = None
    
    @abstractmethod
    def add_document(self, document_id: str, words: List[str]) -> None:
        """
        Add a document to the index.
        
        Args:
            document_id: Unique identifier for the document
            words: List of words/tokens from the document
        """
        pass
    
    @abstractmethod
    def search(self, query: str) -> List[str]:
        """
        Search for documents containing the query.
        
        Args:
            query: Search query (word or substring)
            
        Returns:
            List of document IDs that match the query
        """
        pass
    
    def get_documents_for_word(self, word: str) -> Set[str]:
        """
        Get all documents containing a specific word.
        
        Args:
            word: Word to search for
            
        Returns:
            Set of document IDs containing the word
        """
        return self.word_to_documents.get(word.lower(), set())
    
    def get_words_for_document(self, document_id: str) -> Set[str]:
        """
        Get all words in a specific document.
        
        Args:
            document_id: Document identifier
            
        Returns:
            Set of words in the document
        """
        return self.document_to_words.get(document_id, set())
    
    def add_word(self, word: str, document_id: str) -> None:
        """
        Add a word to the index for a specific document.
        
        Args:
            word: Word to add
            document_id: Document identifier
        """
        word_lower = word.lower()
        if word_lower not in self.word_to_documents:
            self.word_to_documents[word_lower] = set()
        self.word_to_documents[word_lower].add(document_id)
        
        if document_id not in self.document_to_words:
            self.document_to_words[document_id] = set()
        self.document_to_words[document_id].add(word_lower)
    
    def remove_word(self, word: str) -> bool:
        """
        Remove a word from the index.
        
        Args:
            word: Word to remove
            
        Returns:
            True if word was found and removed, False otherwise
        """
        word_lower = word.lower()
        if word_lower not in self.word_to_documents:
            return False
        
        # Remove from all documents
        document_ids = self.word_to_documents[word_lower].copy()
        for doc_id in document_ids:
            if doc_id in self.document_to_words:
                self.document_to_words[doc_id].discard(word_lower)
        
        # Remove the word entry
        del self.word_to_documents[word_lower]
        return True
    
    def get_statistics(self) -> Dict:
        """
        Get statistics about the index.
        
        Returns:
            Dictionary with index statistics
        """
        total_words = len(self.word_to_documents)
        total_documents = len(self.document_to_words)
        total_occurrences = sum(len(docs) for docs in self.word_to_documents.values())
        
        return {
            "word_count": total_words,
            "document_count": total_documents,
            "total_occurrences": total_occurrences,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
    
    def get_all_words(self) -> List[str]:
        """
        Get all words in the index.
        
        Returns:
            List of all words
        """
        return sorted(list(self.word_to_documents.keys()))

