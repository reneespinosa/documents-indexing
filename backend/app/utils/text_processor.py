"""
Text processing utilities for document indexing.
"""
import re
from typing import List, Set


def tokenize(text: str) -> List[str]:
    """
    Tokenize text into words.
    
    Args:
        text: Input text
        
    Returns:
        List of tokens (words)
    """
    # Convert to lowercase and split by whitespace and punctuation
    tokens = re.findall(r'\b\w+\b', text.lower())
    return tokens


def clean_text(text: str) -> str:
    """
    Clean text by removing extra whitespace and normalizing.
    
    Args:
        text: Input text
        
    Returns:
        Cleaned text
    """
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Strip leading/trailing whitespace
    text = text.strip()
    return text


def extract_unique_words(text: str) -> Set[str]:
    """
    Extract unique words from text.
    
    Args:
        text: Input text
        
    Returns:
        Set of unique words
    """
    tokens = tokenize(text)
    return set(tokens)


def get_word_frequency(text: str) -> dict:
    """
    Get word frequency in text.
    
    Args:
        text: Input text
        
    Returns:
        Dictionary mapping words to their frequencies
    """
    tokens = tokenize(text)
    frequency = {}
    for token in tokens:
        frequency[token] = frequency.get(token, 0) + 1
    return frequency

