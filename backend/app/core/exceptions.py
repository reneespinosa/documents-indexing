"""
Custom exceptions for the application.
"""
from fastapi import HTTPException, status


class DocumentNotFoundError(HTTPException):
    """Exception raised when a document is not found."""
    def __init__(self, document_id: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with id {document_id} not found"
        )


class IndexNotFoundError(HTTPException):
    """Exception raised when an index is not found."""
    def __init__(self, index_type: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Index of type {index_type} not found. Please create an index first."
        )


class IndexingError(HTTPException):
    """Exception raised when indexing fails."""
    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Indexing failed: {message}"
        )

