from .customers import get_customer_list, get_customer_details
from .products import get_product_list, get_product_details
from .inventory import get_inventory_list, get_inventory_details
from .transactions import get_transaction_list, get_transaction_details
from .analytics import get_sales_summary, get_top_selling_products, get_low_stock_inventory, get_pending_payments

def get_all_tools():
    """Get all available tools"""
    return [
        get_customer_list, 
        get_customer_details,
        get_product_list, 
        get_product_details,
        get_inventory_list, 
        get_inventory_details,
        get_transaction_list, 
        get_transaction_details,
        get_sales_summary,
        get_top_selling_products,
        get_low_stock_inventory,
        get_pending_payments
    ]

__all__ = ["get_all_tools"]
