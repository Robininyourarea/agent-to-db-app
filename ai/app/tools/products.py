from typing import Dict, Any
from langchain_core.tools import tool
from app.utils.api import fetch

@tool
async def get_product_list(
    page: int = 1, 
    limit: int = 10
) -> Dict[str, Any]:
    """
    Get a paginated list of products.
    
    Args:
        page: The page number to fetch (default: 1).
        limit: The number of products per page (default: 10).
    """
    params = {
        "page": page,
        "limit": limit
    }
    response = await fetch("GET", "/products/list/page", params=params)
    return response

@tool
async def get_product_details(id: str) -> Dict[str, Any]:
    """
    Get detailed information about a specific product by its ID (UUID).
    
    Args:
        id: The UUID of the product to retrieve.
    """
    response = await fetch("GET", f"/products/{id}")
    return response
