import os
import logging
from typing import List, Optional, Dict, Any
from langsmith import Client
from langchain_core.tracers import LangChainTracer
from langchain_core.callbacks import StdOutCallbackHandler, BaseCallbackHandler
from app.config.config import Config

logger = logging.getLogger(__name__)

class TracingService:
    """Service to handle LangSmith tracing and observability"""

    def __init__(self):
        # Setup LangSmith tracing environment variables
        Config.setup_langsmith_tracing()

        # Initialize LangSmith client
        self.langsmith_client = None
        if Config.LANGSMITH_API_KEY:
            try:
                self.langsmith_client = Client(
                    api_key=Config.LANGSMITH_API_KEY, 
                    api_url=Config.LANGSMITH_ENDPOINT
                )
                logger.info("LangSmith client initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize LangSmith client: {e}")

    def get_callbacks(self) -> List[BaseCallbackHandler]:
        """Get callbacks for tracing (LangSmith tracer, stdout, etc.)"""
        callbacks = []

        # Add LangSmith tracer if available
        if self.langsmith_client:
            try:
                tracer = LangChainTracer(
                    project_name=Config.LANGSMITH_PROJECT or "default",
                    client=self.langsmith_client,
                )
                callbacks.append(tracer)
                logger.info(
                    f"LangSmith tracer added for project: {Config.LANGSMITH_PROJECT or 'default'}"
                )
            except Exception as e:
                logger.warning(f"Failed to setup LangSmith tracer: {e}")
        
        # Add stdout callback if enabled
        if Config.LANGSMITH_TRACING == "true":
            callbacks.append(StdOutCallbackHandler())

        return callbacks

    def get_project_traces_url(self) -> Optional[str]:
        """Get general project traces URL"""
        if self.langsmith_client and Config.LANGSMITH_PROJECT:
            base_url = "https://smith.langchain.com"
            project_name = Config.LANGSMITH_PROJECT
            return f"{base_url}/projects/p/{project_name}/traces"
        return None

    def get_session_traces_url(self, session_id: str) -> Optional[str]:
        """Get traces URL filtered by session_id"""
        if self.langsmith_client and Config.LANGSMITH_PROJECT:
            base_url = "https://smith.langchain.com"
            project_name = Config.LANGSMITH_PROJECT
            import urllib.parse

            # Properly use session_id for filtering
            filter_query = f'metadata.session_id="{session_id}"'
            encoded_filter = urllib.parse.quote(filter_query)
            return (
                f"{base_url}/projects/p/{project_name}/traces?filter={encoded_filter}"
            )
        return None

    def get_langsmith_project_url(self) -> Optional[str]:
        """Get LangSmith project URL"""
        if Config.LANGSMITH_PROJECT:
            return f"https://smith.langchain.com/projects/p/{Config.LANGSMITH_PROJECT}"
        return None

    def get_tracing_stats(self) -> Dict[str, Any]:
        """Get tracing statistics"""
        return {
            "langsmith_enabled": self.langsmith_client is not None,
            "project_name": Config.LANGSMITH_PROJECT,
            "project_url": self.get_langsmith_project_url(),
            "tracing_enabled": Config.LANGSMITH_TRACING == "true",
        }
