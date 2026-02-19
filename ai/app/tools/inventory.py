from typing import Dict, Any
from langchain_core.tools import tool
from app.utils.api import fetch

@tool
async def get_inventory_list(
    page: int = 1, 
    limit: int = 10
) -> Dict[str, Any]:
    """
    Get a paginated list of inventory items.
    
    Args:
        page: The page number to fetch (default: 1).
        limit: The number of inventory items per page (default: 10).
    """
    params = {
        "page": page,
        "limit": limit
    }
    response = await fetch("GET", "/inventories/list/page", params=params)
    return response

@tool
async def get_inventory_details(id: str) -> Dict[str, Any]:
    """
    Get detailed information about a specific inventory item by its ID (UUID).
    
    Args:
        id: The UUID of the inventory item to retrieve.
    """
    response = await fetch("GET", f"/inventories/{id}")
    return response
