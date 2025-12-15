"""
Persistence utilities for saving and loading indexes.
"""
import pickle
import json
import os
from typing import Any, Optional
from pathlib import Path


def ensure_directory(path: str) -> None:
    """Ensure a directory exists."""
    Path(path).mkdir(parents=True, exist_ok=True)


def save_index_pickle(index: Any, filepath: str) -> bool:
    """
    Save an index using pickle.
    
    Args:
        index: The index object to save
        filepath: Path where to save the index
        
    Returns:
        True if successful
    """
    try:
        ensure_directory(os.path.dirname(filepath))
        with open(filepath, 'wb') as f:
            pickle.dump(index, f)
        return True
    except Exception as e:
        print(f"Error saving index with pickle: {e}")
        return False


def load_index_pickle(filepath: str) -> Optional[Any]:
    """
    Load an index using pickle.
    
    Args:
        filepath: Path to the index file
        
    Returns:
        The loaded index or None if error
    """
    try:
        if not os.path.exists(filepath):
            return None
        with open(filepath, 'rb') as f:
            return pickle.load(f)
    except Exception as e:
        print(f"Error loading index with pickle: {e}")
        return None


def save_index_json(index_data: dict, filepath: str) -> bool:
    """
    Save index data as JSON.
    
    Args:
        index_data: Dictionary with index data
        filepath: Path where to save the index
        
    Returns:
        True if successful
    """
    try:
        ensure_directory(os.path.dirname(filepath))
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving index with JSON: {e}")
        return False


def load_index_json(filepath: str) -> Optional[dict]:
    """
    Load index data from JSON.
    
    Args:
        filepath: Path to the index file
        
    Returns:
        The loaded index data or None if error
    """
    try:
        if not os.path.exists(filepath):
            return None
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading index with JSON: {e}")
        return None

