from typing import Dict, Any, Optional
from langchain_core.tools import tool
from app.utils.api import fetch

@tool
async def get_customer_list(
    page: int = 1, 
    limit: int = 10
) -> Dict[str, Any]:
    """
    Get a paginated list of customers.
    
    Args:
        page: The page number to fetch (default: 1).
        limit: The number of customers per page (default: 10).
    """
    params = {
        "page": page,
        "limit": limit
    }
        
    response = await fetch("GET", "/customers/list", params=params)
    return response

@tool
async def get_customer_details(id: str) -> Dict[str, Any]:
    """
    Get detailed information about a specific customer by their ID (UUID).
    
    Args:
        id: The UUID of the customer to retrieve.
    """
    response = await fetch("GET", f"/customers/{id}")
    return response
