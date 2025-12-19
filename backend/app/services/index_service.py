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
from app.models import Document


class IndexService:
    """Service for managing documents and indexes."""
    
    def __init__(self):
        """Initialize the service."""
        self.suffix_index: Optional[SuffixTreeIndex] = None
        self.patricia_index: Optional[PatriciaTreeIndex] = None
    
    async def get_all_documents(self) -> List[DocumentResponse]:
        """Get all documents from database."""
        db_docs = await Document.all().order_by("-created_at")
        return [
            DocumentResponse(
                id=str(doc.id),
                title=doc.title,
                content=doc.extracted_text or "",
                filename=doc.title,
                word_count=doc.word_count,
                created_at=doc.created_at
            )
            for doc in db_docs
        ]
    
    async def delete_document(self, document_id: str) -> bool:
        """Delete a document from database."""
        deleted_count = await Document.filter(id=document_id).delete()
        return deleted_count > 0
    
    async def create_index(
        self,
        index_type: str,
        document_ids: Optional[List[str]] = None
    ) -> bool:
        """
        Create an index from documents in database.
        
        Args:
            index_type: Type of index (suffix or patricia)
            document_ids: Optional list of document IDs to index
            
        Returns:
            True if successful
        """
        try:
            # Get documents from database
            if document_ids is None:
                db_docs = await Document.all()
            else:
                db_docs = await Document.filter(id__in=document_ids).all()
            
            if not db_docs:
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
            for doc in db_docs:
                doc_id = str(doc.id)
                # Use extracted_text if available, otherwise try to decode content
                content = doc.extracted_text
                if not content:
                    try:
                        import base64
                        content = base64.b64decode(doc.content).decode('utf-8')
                    except:
                        content = ""
                
                # Tokenize the document content
                words = tokenize(content)
                
                # Add document to index
                index.add_document(doc_id, words)
            
            return True
        except Exception as e:
            print(f"Error creating index: {e}")
            import traceback
            traceback.print_exc()
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
            # Return empty results instead of error - better UX
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
            # Get document from database
            doc = await Document.get_or_none(id=doc_id)
            if not doc:
                continue
            
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
        document_id: Optional[str] = None,
        index_type: Optional[str] = None
    ) -> bool:
        """
        Add a word to the index.
        
        Args:
            word: Word to add
            document_id: Optional document ID. If None, adds to all documents
            index_type: Optional index type ('suffix' or 'patricia'). If None, adds to both if they exist
        
        Returns:
            True if successful, False otherwise
        """
        success = False
        
        # Get document IDs from database if needed
        if document_id is None:
            db_docs = await Document.all()
            document_ids = [str(doc.id) for doc in db_docs]
        else:
            document_ids = [document_id]
        
        # If index_type is specified, add only to that index
        if index_type:
            if index_type == settings.INDEX_TYPE_SUFFIX:
                if self.suffix_index is not None:
                    for doc_id in document_ids:
                        self.suffix_index.add_word(word, doc_id)
                    success = True
            elif index_type == settings.INDEX_TYPE_PATRICIA:
                if self.patricia_index is not None:
                    for doc_id in document_ids:
                        self.patricia_index.add_word(word, doc_id)
                    success = True
        else:
            # Add to both indexes if they exist (backward compatibility)
            if self.suffix_index is not None:
                for doc_id in document_ids:
                    self.suffix_index.add_word(word, doc_id)
                success = True
            
            if self.patricia_index is not None:
                for doc_id in document_ids:
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

