from typing import Dict, Any
from langchain_core.tools import tool
from app.utils.api import fetch

@tool
async def get_transaction_list(
    page: int = 1, 
    limit: int = 10
) -> Dict[str, Any]:
    """
    Get a paginated list of sales transactions.
    
    Args:
        page: The page number to fetch (default: 1).
        limit: The number of transactions per page (default: 10).
    """
    params = {
        "page": page,
        "limit": limit
    }
    response = await fetch("GET", "/transactions/list", params=params)
    return response

@tool
async def get_transaction_details(id: str) -> Dict[str, Any]:
    """
    Get detailed information about a specific transaction by its ID (UUID).
    
    Args:
        id: The UUID of the transaction to retrieve.
    """
    response = await fetch("GET", f"/transactions/{id}")
    return response
