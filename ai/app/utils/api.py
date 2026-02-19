from typing import Any, Dict, Optional
import httpx
from app.config.config import Config


async def fetch(
    method: str,
    endpoint: str,
    data: Optional[Dict] = None,
    params: Optional[Dict] = None,
) -> Dict[str, Any]:
    """Make HTTP request to API endpoint"""
    base_url = Config.BACKEND_API_BASE_URL
    headers = {"Content-Type": "application/json"}
    
    try:
        async with httpx.AsyncClient() as client:
            url = f"{base_url}{endpoint}"

            if method.upper() == "GET":
                response = await client.get(
                    url, params=params, headers=headers, timeout=30
                )
            elif method.upper() == "POST":
                response = await client.post(
                    url,
                    json=data,
                    headers=headers,
                    timeout=30,
                )
            elif method.upper() == "PUT":
                response = await client.put(
                    url,
                    json=data,
                    headers=headers,
                    timeout=30,
                )
            elif method.upper() == "DELETE":
                response = await client.delete(
                    url,
                    headers=headers,
                    timeout=30,
                )
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")

            response.raise_for_status()
            return {
                "success": True,
                "data": response.json(),
                "endpoint_used": endpoint,
                "method": method.upper(),
            }
    except httpx.HTTPStatusError as e:
        return {
            "success": False,
            "error": f"API request failed with status {e.response.status_code}: {e.response.text}",
            "endpoint_used": endpoint,
            "method": method.upper(),
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"An error occurred: {str(e)}",
            "endpoint_used": endpoint,
            "method": method.upper(),
        }
