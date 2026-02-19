from langchain_google_genai import ChatGoogleGenerativeAI
from app.config.config import Config
import logging

logger = logging.getLogger(__name__)

def get_llm(model_name: str = "gemini-2.5-flash", temperature: float = 0.2):
    """
    Get the configured LLM instance.
    
    Args:
        model_name: Name of the model to use
        temperature: Temperature for generation
        
    Returns:
        ChatGoogleGenerativeAI instance
    """
    try:
        llm = ChatGoogleGenerativeAI(
            model=model_name,
            temperature=temperature,
            google_api_key=Config.GOOGLE_API_KEY,
            convert_system_message_to_human=True
        )
        return llm
    except Exception as e:
        logger.error(f"Failed to initialize LLM: {e}")
        raise
