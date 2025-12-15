"""
Service layer for index management and operations.
"""
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from app.api.models.document import DocumentResponse
from app.api.models.index import (
    IndexStatusResponse,
    SearchResponse,
    SearchResult,
    IndexStructureResponse,
    IndexStructureNode
)
from app.modules.suffix_tree_index import SuffixTreeIndex
from app.modules.patricia_tree_index import PatriciaTreeIndex
from app.utils.text_processor import tokenize
from app.core.config import settings


class IndexService:
    """Service for managing documents and indexes."""
    
    def __init__(self):
        """Initialize the service."""
        self.documents: Dict[str, DocumentResponse] = {}
        self.suffix_index: Optional[SuffixTreeIndex] = None
        self.patricia_index: Optional[PatriciaTreeIndex] = None
    
    async def add_document(
        self,
        title: str,
        content: str,
        filename: Optional[str] = None
    ) -> DocumentResponse:
        """
        Add a document to the system.
        
        Args:
            title: Document title
            content: Document content
            filename: Optional filename
            
        Returns:
            Created document
        """
        document_id = str(uuid.uuid4())
        word_count = len(content.split())
        
        document = DocumentResponse(
            id=document_id,
            title=title,
            content=content,
            filename=filename,
            created_at=datetime.now(),
            word_count=word_count
        )
        
        self.documents[document_id] = document
        return document
    
    async def get_document(self, document_id: str) -> Optional[DocumentResponse]:
        """Get a document by ID."""
        return self.documents.get(document_id)
    
    async def get_all_documents(self) -> List[DocumentResponse]:
        """Get all documents."""
        return list(self.documents.values())
    
    async def delete_document(self, document_id: str) -> bool:
        """Delete a document."""
        if document_id in self.documents:
            del self.documents[document_id]
            return True
        return False
    
    async def create_index(
        self,
        index_type: str,
        document_ids: Optional[List[str]] = None
    ) -> bool:
        """
        Create an index from documents.
        
        Args:
            index_type: Type of index (suffix or patricia)
            document_ids: Optional list of document IDs to index
            
        Returns:
            True if successful
        """
        try:
            # Determine which documents to index
            if document_ids is None:
                document_ids = list(self.documents.keys())
            
            if not document_ids:
                return False
            
            # Select the appropriate index
            if index_type == settings.INDEX_TYPE_SUFFIX:
                self.suffix_index = SuffixTreeIndex()
                index = self.suffix_index
            elif index_type == settings.INDEX_TYPE_PATRICIA:
                self.patricia_index = PatriciaTreeIndex()
                index = self.patricia_index
            else:
                return False
            
            # Process each document
            for doc_id in document_ids:
                if doc_id not in self.documents:
                    continue
                
                document = self.documents[doc_id]
                # Tokenize the document content
                words = tokenize(document.content)
                
                # Add document to index
                index.add_document(doc_id, words)
            
            return True
        except Exception as e:
            print(f"Error creating index: {e}")
            return False
    
    async def get_index_status(self, index_type: str) -> IndexStatusResponse:
        """Get the status of an index."""
        if index_type == settings.INDEX_TYPE_SUFFIX:
            index = self.suffix_index
        elif index_type == settings.INDEX_TYPE_PATRICIA:
            index = self.patricia_index
        else:
            return IndexStatusResponse(
                index_type=index_type,
                exists=False,
                word_count=None,
                document_count=None,
                created_at=None
            )
        
        if index is None:
            return IndexStatusResponse(
                index_type=index_type,
                exists=False,
                word_count=None,
                document_count=None,
                created_at=None
            )
        
        stats = index.get_statistics()
        return IndexStatusResponse(
            index_type=index_type,
            exists=True,
            word_count=stats.get("word_count"),
            document_count=stats.get("document_count"),
            created_at=stats.get("created_at")
        )
    
    async def search(
        self,
        query: str,
        index_type: str,
        limit: int = 100
    ) -> SearchResponse:
        """Search in the index."""
        # Select the appropriate index
        if index_type == settings.INDEX_TYPE_SUFFIX:
            index = self.suffix_index
        elif index_type == settings.INDEX_TYPE_PATRICIA:
            index = self.patricia_index
        else:
            return SearchResponse(
                query=query,
                results=[],
                total_results=0,
                index_type=index_type
            )
        
        if index is None:
            return SearchResponse(
                query=query,
                results=[],
                total_results=0,
                index_type=index_type
            )
        
        # Perform search
        matching_doc_ids = index.search(query)
        
        # Build results
        results: List[SearchResult] = []
        for doc_id in matching_doc_ids[:limit]:
            if doc_id in self.documents:
                doc = self.documents[doc_id]
                # Find matching words
                words_in_doc = index.get_words_for_document(doc_id)
                matching_words = [
                    word for word in words_in_doc 
                    if query.lower() in word.lower()
                ]
                
                result = SearchResult(
                    document_id=doc_id,
                    document_title=doc.title,
                    matches=matching_words[:10],  # Limit matches
                    relevance_score=len(matching_words) / max(len(words_in_doc), 1)
                )
                results.append(result)
        
        return SearchResponse(
            query=query,
            results=results,
            total_results=len(results),
            index_type=index_type
        )
    
    async def add_word_to_index(
        self,
        word: str,
        document_id: Optional[str] = None
    ) -> bool:
        """Add a word to the index."""
        # Try to add to both indexes if they exist
        success = False
        
        if self.suffix_index is not None:
            if document_id:
                self.suffix_index.add_word(word, document_id)
            else:
                # Add to all documents (not recommended, but possible)
                for doc_id in self.documents.keys():
                    self.suffix_index.add_word(word, doc_id)
            success = True
        
        if self.patricia_index is not None:
            if document_id:
                self.patricia_index.add_word(word, document_id)
            else:
                for doc_id in self.documents.keys():
                    self.patricia_index.add_word(word, doc_id)
            success = True
        
        return success
    
    async def delete_word_from_index(
        self,
        word: str,
        index_type: str
    ) -> bool:
        """Delete a word from the index."""
        # Select the appropriate index
        if index_type == settings.INDEX_TYPE_SUFFIX:
            index = self.suffix_index
        elif index_type == settings.INDEX_TYPE_PATRICIA:
            index = self.patricia_index
        else:
            return False
        
        if index is None:
            return False
        
        return index.remove_word(word)
    
    async def get_index_structure(
        self,
        index_type: str
    ) -> Optional[IndexStructureResponse]:
        """Get the structure of an index for visualization."""
        # Select the appropriate index
        if index_type == settings.INDEX_TYPE_SUFFIX:
            index = self.suffix_index
        elif index_type == settings.INDEX_TYPE_PATRICIA:
            index = self.patricia_index
        else:
            return None
        
        if index is None:
            return None
        
        # Get structure data
        structure_data = index.get_structure_data()
        stats = index.get_statistics()
        
        # Convert to IndexStructureNode format
        def convert_to_node(data: Dict) -> IndexStructureNode:
            """Recursively convert structure data to IndexStructureNode."""
            children = [
                convert_to_node(child) for child in data.get("children", [])
            ]
            return IndexStructureNode(
                id=data.get("id", ""),
                label=data.get("label", ""),
                children=children,
                metadata=data.get("metadata")
            )
        
        root_node = convert_to_node(structure_data)
        
        return IndexStructureResponse(
            index_type=index_type,
            root=root_node,
            stats=stats
        )
    
    async def get_index_stats(self, index_type: str) -> Optional[Dict[str, Any]]:
        """Get statistics about an index."""
        # Select the appropriate index
        if index_type == settings.INDEX_TYPE_SUFFIX:
            index = self.suffix_index
        elif index_type == settings.INDEX_TYPE_PATRICIA:
            index = self.patricia_index
        else:
            return None
        
        if index is None:
            return None
        
        return index.get_statistics()

