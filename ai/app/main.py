from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager
from app.schema.request import ChatRequest
from app.schema.response import ChatResponse
from app.core.agent import AIAgent
from app.core.memory import SessionService
from app.config.config import Config
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global agent instance
agent_instance = None
session_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global agent_instance, session_service
    try:
        logger.info("Initializing AI Agent with LangSmith tracing...")
        session_service = SessionService()
        agent_instance = AIAgent()

        logger.info("AI Agent initialized successfully")
        logger.info(f"Loaded {len(agent_instance.tools)} tools:")
        for tool in agent_instance.get_available_tools():
            logger.info(f"  - {tool['name']} ({tool['category']})")

        # Log LangSmith status
        tracing_stats = agent_instance.tracing_service.get_tracing_stats()
        logger.info(f"LangSmith tracing: {tracing_stats}")

    except Exception as e:
        logger.error(f"Failed to initialize application: {e}")
        raise

    yield
    logger.info("Application shutdown complete")


app = FastAPI(
    title="AI Assistant",
    description="AI Assistant with MongoDB and LangSmith integration",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------#
#                               Chat Endpoints                               #
# ---------------------------------------------------------------------------#

@app.get("/")
async def root():
    return {"message": "AI Agent API is running"}


@app.post("/chat")
async def chat(request: ChatRequest):
    """Main chat endpoint"""
    if not agent_instance:
        raise HTTPException(status_code=500, detail="AI Agent not initialized")

    try:
        result = await agent_instance.process_message(
            message=request.message,
            session_id=request.session_id,
        )

        return ChatResponse(
            response=result["response"],
            session_id=result["session_id"],
            tool_used=result.get("tool_used"),
            metadata={
                "success": result["success"],
                "error": result.get("error"),
                "trace_url": result.get("trace_url"),
                "langsmith_project": Config.LANGSMITH_PROJECT,
            },
        )

    except Exception as e:
        logger.error(f"Error processing chat message: {e}")
        raise HTTPException(
            status_code=500, detail=f"Error processing message: {str(e)}"
        )
        
@app.get("/tools")
async def list_tools():
    """List available tools"""
    if not agent_instance:
        raise HTTPException(status_code=500, detail="AI Agent not initialized")

    tools_info = agent_instance.get_available_tools()

    categorized_tools = {}
    for tool in tools_info:
        category = tool["category"]
        if category not in categorized_tools:
            categorized_tools[category] = []
        categorized_tools[category].append(
            {"name": tool["name"], "description": tool["description"]}
        )

    return {
        "total_tools": len(tools_info),
        "categories": categorized_tools,
        "all_tools": tools_info,
    }
    
# ---------------------------------------------------------------------------#
#                               Session Endpoints                            #
# ---------------------------------------------------------------------------#

@app.get("/sessions")
async def list_sessions():
    """Get list of all chat sessions"""
    if not session_service:
        raise HTTPException(status_code=500, detail="Session Service not initialized")

    try:
        sessions = session_service.get_all_sessions()
        return {
            "sessions": sessions,
            "count": len(sessions)
        }
    except Exception as e:
        logger.error(f"Error listing sessions: {e}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving sessions: {str(e)}"
        )

@app.get("/sessions/{session_id}/history")
async def get_session_history(session_id: str):
    """Get conversation history for a session"""
    if not session_service:
        raise HTTPException(status_code=500, detail="Session Service not initialized")

    try:
        history = session_service.get_session_history(session_id)
        return {
            "session_id": session_id,
            "messages": history,
            "message_count": len(history),
            "storage_type": "langchain_mongodb",
        }

    except Exception as e:
        logger.error(f"Error getting session history: {e}")
        raise HTTPException(
            status_code=500, detail=f"Error retrieving history: {str(e)}"
        )


@app.delete("/sessions/{session_id}")
async def clear_session(session_id: str):
    """Clear conversation history for a session"""
    if not session_service:
        raise HTTPException(status_code=500, detail="Session Service not initialized")

    try:
        success = session_service.clear_session_history(session_id)
        if success:
            return {"message": f"Session {session_id} cleared successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to clear session")

    except Exception as e:
        logger.error(f"Error clearing session: {e}")
        raise HTTPException(status_code=500, detail=f"Error clearing session: {str(e)}")


@app.get("/sessions/{session_id}/stats")
async def get_session_stats(session_id: str):
    """Get session statistics"""
    if not session_service:
        raise HTTPException(status_code=500, detail="Session Service not initialized")

    try:
        stats = session_service.get_session_stats(session_id)
        return stats

    except Exception as e:
        logger.error(f"Error getting session stats: {e}")
        raise HTTPException(status_code=500, detail=f"Error retrieving stats: {str(e)}")


# ---------------------------------------------------------------------------#
#                               Tracing Endpoints                            #
# ---------------------------------------------------------------------------#

@app.get("/tracing")
async def get_tracing_info():
    """Get LangSmith tracing information"""
    if not agent_instance:
        raise HTTPException(status_code=500, detail="AI Agent not initialized")

    tracing_stats = agent_instance.tracing_service.get_tracing_stats()
    return tracing_stats


@app.get("/tracing/project-url")
async def get_project_url():
    """Get LangSmith project URL"""
    if not agent_instance:
        raise HTTPException(status_code=500, detail="AI Agent not initialized")

    project_url = agent_instance.tracing_service.get_langsmith_project_url()
    if project_url:
        return {"project_url": project_url}
    else:
        raise HTTPException(status_code=404, detail="LangSmith project not configured")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=Config.PORT, reload=True)
