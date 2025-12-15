import io
from typing import Optional
import docx
from pypdf import PdfReader

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """
    Extract text from a file based on its extension.
    Supported formats: .txt, .md, .docx, .pdf
    """
    filename_lower = filename.lower()
    
    try:
        if filename_lower.endswith('.pdf'):
            return _extract_from_pdf(file_content)
        elif filename_lower.endswith('.docx') or filename_lower.endswith('.doc'):
            return _extract_from_docx(file_content)
        else:
            # Default to text/markdown
            return file_content.decode('utf-8')
    except Exception as e:
        print(f"Error extracting text from {filename}: {e}")
        return ""

def _extract_from_pdf(content: bytes) -> str:
    text = ""
    with io.BytesIO(content) as f:
        reader = PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text

def _extract_from_docx(content: bytes) -> str:
    text = ""
    with io.BytesIO(content) as f:
        doc = docx.Document(f)
        for para in doc.paragraphs:
            text += para.text + "\n"
    return text
