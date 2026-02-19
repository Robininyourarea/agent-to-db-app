from pydantic import BaseModel
from typing import Optional, Dict, Any

class ChatResponse(BaseModel):
    response: str
    session_id: str
    tool_used: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class ToolResponse(BaseModel):
    success: bool
    data: Any
    error: Optional[str] = None
