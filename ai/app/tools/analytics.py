from typing import Dict, Any, Optional, List
from langchain_core.tools import tool
from app.utils.api import fetch
from datetime import datetime, timedelta

@tool
async def get_sales_summary(
    start_date: str, 
    end_date: str
) -> Dict[str, Any]:
    """
    Get a summary of sales (total revenue and transaction count) for a specific date range.
    
    Args:
        start_date: The start date in YYYY-MM-DD format.
        end_date: The end date in YYYY-MM-DD format.
    """
    params = {
        "start_date": start_date,
        "end_date": end_date
    }
    response = await fetch("GET", "/analytics/sales-summary", params=params)
    return response

@tool
async def get_top_selling_products(
    limit: int = 5,
    period: str = "last_30_days"
) -> Dict[str, Any]:
    """
    Get a list of top-selling products based on quantity sold.
    
    Args:
        limit: The number of top products to retrieve (default: 5).
        period: The time period to analyze. Options: 'today', 'this_week', 'this_month', 'last_30_days', 'all_time'.
    """
    
    today = datetime.now()
    end_date = today.strftime("%Y-%m-%d")
    start_date = ""
    
    if period == "today":
        start_date = end_date
    elif period == "this_week":
        # Start of the current week (Monday)
        start = today - timedelta(days=today.weekday())
        start_date = start.strftime("%Y-%m-%d")
    elif period == "this_month":
        start_date = today.replace(day=1).strftime("%Y-%m-%d")
    elif period == "last_30_days":
        start = today - timedelta(days=30)
        start_date = start.strftime("%Y-%m-%d")
    elif period == "all_time":
         # Just use a very old date
        start_date = "2000-01-01"
    else:
        # Default to last 30 days if unknown
        start = today - timedelta(days=30)
        start_date = start.strftime("%Y-%m-%d")

    params = {
        "limit": limit,
        "start_date": start_date,
        "end_date": end_date
    }
    
    response = await fetch("GET", "/analytics/top-products", params=params)
    return response

@tool
async def get_low_stock_inventory(
    threshold: int = 10
) -> Dict[str, Any]:
    """
    Get a list of inventory items that are running low on stock.
    
    Args:
        threshold: The quantity threshold to consider as low stock (default: 10).
    """
    params = {
        "threshold": threshold
    }
    response = await fetch("GET", "/analytics/low-stock", params=params)
    return response

@tool
async def get_pending_payments() -> Dict[str, Any]:
    """
    Get a list of transactions that have pending payments (not yet PAID).
    """
    response = await fetch("GET", "/analytics/pending-payments")
    return response
