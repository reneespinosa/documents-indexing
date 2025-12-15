"""
Pydantic models for document-related operations.
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DocumentBase(BaseModel):
    """Base document model."""
    title: str
    content: str
    filename: Optional[str] = None


class DocumentCreate(DocumentBase):
    """Model for creating a document."""
    pass


class DocumentResponse(DocumentBase):
    """Model for document response."""
    id: str
    created_at: datetime
    word_count: int
    
    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    """Model for list of documents."""
    documents: List[DocumentResponse]
    total: int

