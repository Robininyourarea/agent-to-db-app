from langchain.agents import (
    AgentExecutor,
    create_tool_calling_agent,
)
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from app.tools import get_all_tools
from typing import Dict, Any, Optional
import uuid
from app.config.config import Config
import logging
from datetime import datetime
from app.core.llm import get_llm
from app.core.memory import SessionService
from app.core.tracing import TracingService

logger = logging.getLogger(__name__)


class AIAgent:
    """Main AI Agent that orchestrates between different tools"""

    def __init__(self):

        # Validate environment variables
        Config.validate()
        
        # Initialize Services
        self.tracing_service = TracingService()
        self.session_service = SessionService()

        # Initialize LLM model using core module
        self.llm = get_llm()

        # Initialize tools and agent
        self.tools = get_all_tools()
        self.agent = self._create_agent()
        
        
    # ---------------------------------------------------------------------------#
    #                               Agent Methods                                #
    # ---------------------------------------------------------------------------#

    def get_available_tools(self) -> list[Dict[str, Any]]:
        """Get list of available tools"""
        tools_info = []
        for tool in self.tools:
            # Extract category from tool name (e.g., get_customer_list -> customer)
            name_parts = tool.name.split("_")
            category = "general"
            if len(name_parts) >= 2 and name_parts[0] == "get":
                category = name_parts[1]
            
            tools_info.append({
                "name": tool.name,
                "description": tool.description,
                "category": category,
            })
        return tools_info
    
    def _determine_tool_used(self, response: Dict[str, Any]) -> Optional[str]:
        """Determine which tool was used from the response"""
        intermediate_steps = response.get("intermediate_steps", [])
        if intermediate_steps:
            last_step = intermediate_steps[-1]
            if isinstance(last_step, tuple) and len(last_step) > 0:
                action = last_step[0]
                if hasattr(action, "tool"):
                    return action.tool
        return None
    
    def _create_agent(self) -> AgentExecutor:
        """Create the main agent executor"""

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    """You are an intelligent AI assistant that helps users interact with a business database.
                    You have access to tools to find information about:
                    - Customers
                    - Inventory
                    - Products
                    - Transactions and Transaction Items
                    - Employees
                    
                    IMPORTANT RULES:
                    1. You must ONLY answer questions related to the database entities listed above and database analytics.
                    2. If a user asks about anything else, politely refuse and state that you can only assist with the business database.
                    3. Keep responses helpful and concise.
                    4. If a user greets you, reply naturally.
                    5. If a tool fails, explain the error and suggest alternatives.
                    """,
                ),
                MessagesPlaceholder(variable_name="chat_history"),
                ("user", "{input}"),
                MessagesPlaceholder(variable_name="agent_scratchpad"),
            ]
        )
        
        agent = create_tool_calling_agent(
            llm=self.llm,
            tools=self.tools,
            prompt=prompt
        )

        # Get callbacks from TracingService
        callbacks = self.tracing_service.get_callbacks()

        return AgentExecutor(
            agent=agent,
            tools=self.tools,
            verbose=True, # shows the agent's thought process
            handle_parsing_errors=True,
            max_iterations=5,
            early_stopping_method="generate",
            callbacks=callbacks,  # Add callbacks for tracing
        )

    async def process_message(
        self, message: str, session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Process user message and return response"""

        # Generate session ID if not provided
        if not session_id:
            session_id = str(uuid.uuid4())

        try:
            # Get MongoDB chat history for this session
            chat_history_obj = self.session_service.get_or_create_session_history(session_id)
            
            # Get messages from history
            chat_history_messages = chat_history_obj.messages
            
            # For simple greetings, handle directly to avoid unnecessary tool calls
            if self._is_simple_greeting(message):
                response_text = "Hello! How can I help you today?"
                
                # Save to chat history
                chat_history_obj.add_user_message(message)
                chat_history_obj.add_ai_message(response_text)
                
                return {
                    "response": response_text,
                    "session_id": session_id,
                    "tool_used": None,
                    "success": True,
                    "session_traces_url": self.tracing_service.get_session_traces_url(session_id),
                    "project_traces_url": self.tracing_service.get_project_traces_url(),
                }
                
            # Execute the agent with tracing (ainvoke = async invoke)
            response = await self.agent.ainvoke(
                {
                    "input": message,
                    "chat_history": chat_history_messages,
                },
                config={
                    "tags": [
                        "ai-agent",
                        "actor-tools",
                    ],  # Tags for filtering in LangSmith
                    "metadata": {
                        "session_id": session_id,
                        "user_input": message,
                        "timestamp": datetime.now().isoformat(),
                    },
                },
            )

            # Save to chat history
            chat_history_obj.add_user_message(message)
            chat_history_obj.add_ai_message(response["output"])

            # Determine which tool was used
            tool_used = self._determine_tool_used(response)

            return {
                "response": response["output"],
                "session_id": session_id,
                "tool_used": tool_used,
                "success": True,
                "session_traces_url": self.tracing_service.get_session_traces_url(session_id),
                "project_traces_url": self.tracing_service.get_project_traces_url(),
            }

        except Exception as e:
            logger.error(f"Error processing message: {e}")

            # Still save error to chat history
            try:
                chat_history = self.session_service.get_or_create_session_history(session_id)
                error_response = f"I apologize, but I encountered an error: {str(e)}"
                chat_history.add_user_message(message)
                chat_history.add_ai_message(error_response)
            except Exception as history_error:
                logger.error(f"Failed to save error to chat history: {history_error}")

            return {
                "response": f"I apologize, but I encountered an error: {str(e)}",
                "session_id": session_id,
                "tool_used": None,
                "success": False,
                "error": str(e),
            }

    def _is_simple_greeting(self, message: str) -> bool:
        """Check if message is a simple greeting"""
        greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"]
        return message.lower().strip() in greetings
