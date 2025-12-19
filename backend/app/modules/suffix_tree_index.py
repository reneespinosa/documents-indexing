"""
Inverted index implementation using Suffix Tree.
"""
from typing import List, Set, Dict, Optional
from datetime import datetime
try:
    from suffix_trees.STree import STree
except ImportError:
    # Fallback: create a simple STree-like class if library is not available
    class STree:
        """Simple fallback STree implementation."""
        def __init__(self, text: str):
            self.text = text
        
        def find_all(self, pattern: str):
            """Find all occurrences of pattern in text."""
            positions = []
            start = 0
            while True:
                pos = self.text.find(pattern, start)
                if pos == -1:
                    break
                positions.append(pos)
                start = pos + 1
            return positions
from app.modules.inverted_index import InvertedIndex
from app.utils.text_processor import tokenize


class SuffixTreeIndex(InvertedIndex):
    """
    Inverted index using Suffix Tree for substring search.
    
    Suffix Tree allows efficient search for substrings within words,
    not just exact word matches.
    """
    
    def __init__(self):
        """Initialize the Suffix Tree index."""
        super().__init__()
        self.suffix_tree: Optional[STree] = None
        self.word_to_suffixes: Dict[str, List[str]] = {}
        self.created_at = datetime.now()
    
    def add_document(self, document_id: str, words: List[str]) -> None:
        """
        Add a document to the index using Suffix Tree.
        
        Args:
            document_id: Unique identifier for the document
            words: List of words/tokens from the document
        """
        # Add words to the base inverted index
        for word in words:
            word_lower = word.lower()
            self.add_word(word_lower, document_id)
            
            # Generate suffixes for the word and store them
            if word_lower not in self.word_to_suffixes:
                self.word_to_suffixes[word_lower] = self._generate_suffixes(word_lower)
        
        # Rebuild suffix tree with all words
        self._rebuild_suffix_tree()
    
    def add_word(self, word: str, document_id: str) -> None:
        """
        Add a word to the index for a specific document.
        Override to also update suffix tree structure.
        
        Args:
            word: Word to add
            document_id: Document identifier
        """
        word_lower = word.lower()
        
        # Check if this is a new word
        is_new_word = word_lower not in self.word_to_documents
        
        # Call parent method to add word to base index
        super().add_word(word_lower, document_id)
        
        # If it's a new word, generate suffixes and rebuild tree
        if is_new_word:
            self.word_to_suffixes[word_lower] = self._generate_suffixes(word_lower)
            # Rebuild suffix tree with all words
            self._rebuild_suffix_tree()
    
    def _generate_suffixes(self, word: str) -> List[str]:
        """
        Generate all suffixes of a word.
        
        Args:
            word: Input word
            
        Returns:
            List of all suffixes
        """
        suffixes = []
        for i in range(len(word)):
            suffixes.append(word[i:])
        return suffixes
    
    def _rebuild_suffix_tree(self) -> None:
        """Rebuild the suffix tree with all indexed words."""
        if not self.word_to_documents:
            self.suffix_tree = None
            return
        
        # Create a text with all words separated by special delimiters
        # We use $ as delimiter and # to separate words
        text_parts = []
        word_mapping = {}  # Map position in text to (word, position in word)
        position = 0
        
        for word in self.word_to_documents.keys():
            # Add word with delimiter
            text_parts.append(word)
            text_parts.append('#')
            word_mapping[position] = (word, 0)
            position += len(word) + 1
        
        text = ''.join(text_parts)
        
        # Build suffix tree
        if text:
            self.suffix_tree = STree(text)
        else:
            self.suffix_tree = None
    
    def search(self, query: str) -> List[str]:
        """
        Search for documents containing the query (supports substring search).
        
        Args:
            query: Search query (can be a substring)
            
        Returns:
            List of document IDs that match the query
        """
        query_lower = query.lower()
        matching_documents: Set[str] = set()
        
        # If suffix tree is not built, return empty
        if not self.suffix_tree:
            return []
        
        # Search for exact word matches first (faster)
        if query_lower in self.word_to_documents:
            matching_documents.update(self.word_to_documents[query_lower])
        
        # Search for substring matches using suffix tree
        try:
            # Find all occurrences of the query in the suffix tree
            occurrences = self.suffix_tree.find_all(query_lower)
            
            # For each occurrence, find which word it belongs to
            for pos in occurrences:
                # Find the word that contains this position
                word = self._find_word_at_position(pos)
                if word:
                    # Get all documents containing this word
                    if word in self.word_to_documents:
                        matching_documents.update(self.word_to_documents[word])
        except Exception:
            # If suffix tree search fails, fall back to simple word matching
            pass
        
        # Also check if any word contains the query as substring
        for word in self.word_to_documents.keys():
            if query_lower in word:
                matching_documents.update(self.word_to_documents[word])
        
        return list(matching_documents)
    
    def _find_word_at_position(self, position: int) -> Optional[str]:
        """
        Find which word contains a given position in the suffix tree text.
        
        Args:
            position: Position in the concatenated text
            
        Returns:
            Word that contains this position, or None
        """
        current_pos = 0
        for word in self.word_to_documents.keys():
            word_length = len(word)
            if current_pos <= position < current_pos + word_length:
                return word
            current_pos += word_length + 1  # +1 for the '#' delimiter
        return None
    
    def remove_word(self, word: str) -> bool:
        """
        Remove a word from the index and rebuild suffix tree.
        
        Args:
            word: Word to remove
            
        Returns:
            True if word was found and removed, False otherwise
        """
        result = super().remove_word(word)
        if result:
            # Remove from suffix mapping
            if word.lower() in self.word_to_suffixes:
                del self.word_to_suffixes[word.lower()]
            # Rebuild suffix tree
            self._rebuild_suffix_tree()
        return result
    
    def get_structure_data(self) -> Dict:
        """
        Get structure data for visualization.
        
        Returns:
            Dictionary with structure information
        """
        # For Suffix Tree, we can represent it as a tree structure
        # This is a simplified representation
        root = {
            "id": "root",
            "label": "Suffix Tree Root",
            "children": []
        }
        
        # Group words by first character
        first_char_groups: Dict[str, List[str]] = {}
        for word in self.word_to_documents.keys():
            first_char = word[0] if word else ""
            if first_char not in first_char_groups:
                first_char_groups[first_char] = []
            first_char_groups[first_char].append(word)
        
        # Create tree nodes
        for first_char, words in first_char_groups.items():
            char_node = {
                "id": f"char_{first_char}",
                "label": f"'{first_char}'",
                "children": []
            }
            
            for word in words[:10]:  # Limit to 10 words per group for visualization
                word_node = {
                    "id": f"word_{word}",
                    "label": word,
                    "metadata": {
                        "document_count": len(self.word_to_documents[word]),
                        "suffixes": len(self.word_to_suffixes.get(word, []))
                    },
                    "children": []
                }
                char_node["children"].append(word_node)
            
            root["children"].append(char_node)
        
        return root

