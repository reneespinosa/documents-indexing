"""
API routes for document management.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import base64
import uuid
from app.api.models.document import DocumentResponse, DocumentListResponse
from app.models import Document
from app.utils.file_parser import extract_text_from_file

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a document to the system.
    Stores content as Base64 and extracts text for indexing.
    """
    try:
        content = await file.read()
        # Encode original content to Base64
        content_b64 = base64.b64encode(content).decode('utf-8')
        
        # Extract text from file (PDF, DOCX, TXT)
        extracted_text = extract_text_from_file(content, file.filename or "")
        
        # If extraction failed or returned empty, fallback to a placeholder
        if not extracted_text.strip():
             extracted_text = "[No text extracted]"
        
        word_count = len(extracted_text.split())
        
        document = await Document.create(
            id=uuid.uuid4(),
            title=file.filename or "Untitled",
            content=content_b64,
            extracted_text=extracted_text,
            word_count=word_count
        )
        
        return DocumentResponse(
            id=str(document.id),
            title=document.title,
            content=extracted_text, # Return extracted text for display
            filename=file.filename,
            word_count=document.word_count,
            created_at=document.created_at
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading document: {str(e)}")


@router.get("/", response_model=DocumentListResponse)
async def list_documents():
    """
    List all documents in the system.
    """
    try:
        documents = await Document.all().order_by("-created_at")
        
        doc_responses = []
        for doc in documents:
            # Return extracted text if available, otherwise try to decode content (legacy)
            display_content = doc.extracted_text
            if not display_content:
                try:
                    display_content = base64.b64decode(doc.content).decode('utf-8')
                except:
                    display_content = "[Binary Content]"

            doc_responses.append(DocumentResponse(
                id=str(doc.id),
                title=doc.title,
                content=display_content or "",
                filename=doc.title, 
                word_count=doc.word_count,
                created_at=doc.created_at
            ))
            
        return DocumentListResponse(documents=doc_responses, total=len(doc_responses))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    """
    Get a specific document by ID.
    """
    try:
        doc = await Document.get_or_none(id=document_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
            
        display_content = doc.extracted_text
        if not display_content:
            try:
                display_content = base64.b64decode(doc.content).decode('utf-8')
            except:
                display_content = "[Binary Content]"

        return DocumentResponse(
            id=str(doc.id),
            title=doc.title,
            content=display_content or "",
            filename=doc.title,
            word_count=doc.word_count,
            created_at=doc.created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting document: {str(e)}")


@router.delete("/{document_id}")
async def delete_document(document_id: str):
    """
    Delete a document from the system.
    """
    try:
        deleted_count = await Document.filter(id=document_id).delete()
        if not deleted_count:
            raise HTTPException(status_code=404, detail="Document not found")
        return {"message": "Document deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")

