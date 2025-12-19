"""
Inverted index implementation using PATRICIA Tree (Radix Tree).
"""
from typing import List, Set, Dict, Optional
from datetime import datetime
try:
    from patricia import trie
except ImportError:
    # Fallback: use a simple dict-based implementation if patricia-trie is not available
    class trie(dict):
        """Simple dict-based trie fallback."""
        def iter(self, prefix: str):
            """Iterate over keys starting with prefix."""
            return [k for k in self.keys() if k.startswith(prefix)]
from app.modules.inverted_index import InvertedIndex
from app.utils.text_processor import tokenize


class PatriciaTreeIndex(InvertedIndex):
    """
    Inverted index using PATRICIA Tree (Radix Tree) for efficient word storage.
    
    PATRICIA Tree is a compressed trie that saves space by merging nodes
    with single children. It's efficient for storing and searching words.
    """
    
    def __init__(self):
        """Initialize the PATRICIA Tree index."""
        super().__init__()
        self.patricia_tree = trie()
        self.created_at = datetime.now()
    
    def add_word(self, word: str, document_id: str) -> None:
        """
        Add a word to the index for a specific document.
        Override to also update PATRICIA tree structure.
        
        Args:
            word: Word to add
            document_id: Document identifier
        """
        word_lower = word.lower()
        
        # Call parent method to add word to base index
        super().add_word(word_lower, document_id)
        
        # Add word to PATRICIA tree
        # Store document IDs as the value in the tree
        if word_lower in self.patricia_tree:
            # Word exists, add document to existing set
            existing_docs = self.patricia_tree[word_lower]
            if isinstance(existing_docs, set):
                existing_docs.add(document_id)
            else:
                # Convert to set if it's not already
                self.patricia_tree[word_lower] = {document_id}
        else:
            # New word
            self.patricia_tree[word_lower] = {document_id}
    
    def add_document(self, document_id: str, words: List[str]) -> None:
        """
        Add a document to the index using PATRICIA Tree.
        
        Args:
            document_id: Unique identifier for the document
            words: List of words/tokens from the document
        """
        # Add words to the base inverted index
        for word in words:
            word_lower = word.lower()
            self.add_word(word_lower, document_id)
    
    def search(self, query: str) -> List[str]:
        """
        Search for documents containing the query.
        
        PATRICIA Tree supports prefix matching, so we can find all words
        that start with the query.
        
        Args:
            query: Search query (word or prefix)
            
        Returns:
            List of document IDs that match the query
        """
        query_lower = query.lower()
        matching_documents: Set[str] = set()
        
        # Exact match
        if query_lower in self.patricia_tree:
            docs = self.patricia_tree[query_lower]
            if isinstance(docs, set):
                matching_documents.update(docs)
            else:
                matching_documents.add(docs)
        
        # Prefix matching - find all words that start with the query
        try:
            # Get all keys that start with the query
            prefix_matches = list(self.patricia_tree.iter(query_lower))
            for key in prefix_matches:
                if key in self.word_to_documents:
                    matching_documents.update(self.word_to_documents[key])
        except Exception:
            # If prefix search fails, try manual matching
            for word in self.word_to_documents.keys():
                if word.startswith(query_lower):
                    matching_documents.update(self.word_to_documents[word])
        
        return list(matching_documents)
    
    def remove_word(self, word: str) -> bool:
        """
        Remove a word from the index and PATRICIA tree.
        
        Args:
            word: Word to remove
            
        Returns:
            True if word was found and removed, False otherwise
        """
        word_lower = word.lower()
        result = super().remove_word(word_lower)
        
        if result:
            # Remove from PATRICIA tree
            if word_lower in self.patricia_tree:
                del self.patricia_tree[word_lower]
        
        return result
    
    def get_structure_data(self) -> Dict:
        """
        Get structure data for visualization.
        
        Returns:
            Dictionary with tree structure information
        """
        # Build a tree structure from the PATRICIA tree
        root = {
            "id": "root",
            "label": "PATRICIA Tree Root",
            "children": []
        }
        
        # Group words by common prefixes
        # This is a simplified representation for visualization
        prefix_groups: Dict[str, List[str]] = {}
        
        for word in self.word_to_documents.keys():
            # Use first 2-3 characters as prefix group
            prefix = word[:min(3, len(word))]
            if prefix not in prefix_groups:
                prefix_groups[prefix] = []
            prefix_groups[prefix].append(word)
        
        # Create tree nodes
        for prefix, words in prefix_groups.items():
            prefix_node = {
                "id": f"prefix_{prefix}",
                "label": f"'{prefix}...'",
                "children": []
            }
            
            for word in words[:15]:  # Limit words per prefix for visualization
                word_node = {
                    "id": f"word_{word}",
                    "label": word,
                    "metadata": {
                        "document_count": len(self.word_to_documents[word]),
                        "prefix": prefix
                    },
                    "children": []
                }
                prefix_node["children"].append(word_node)
            
            root["children"].append(prefix_node)
        
        return root
    
    def get_prefix_matches(self, prefix: str) -> List[str]:
        """
        Get all words that start with the given prefix.
        
        Args:
            prefix: Prefix to search for
            
        Returns:
            List of words matching the prefix
        """
        prefix_lower = prefix.lower()
        matches = []
        
        try:
            # Use PATRICIA tree's prefix matching
            for key in self.patricia_tree.iter(prefix_lower):
                matches.append(key)
        except Exception:
            # Fallback to manual matching
            for word in self.word_to_documents.keys():
                if word.startswith(prefix_lower):
                    matches.append(word)
        
        return matches

