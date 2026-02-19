import os
from dotenv import load_dotenv

load_dotenv(override=True)


class Config:
    PORT = int(os.getenv("PORT"))
    # Google configuration
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

    # LangSmith configuration
    LANGSMITH_API_KEY = os.getenv("LANGSMITH_API_KEY")
    LANGSMITH_TRACING = os.getenv("LANGSMITH_TRACING", "true")
    LANGSMITH_PROJECT = os.getenv("LANGSMITH_PROJECT")
    LANGSMITH_ENDPOINT = os.getenv(
        "LANGSMITH_ENDPOINT", "https://api.smith.langchain.com"
    )

    # Backend configuration
    BACKEND_API_BASE_URL = os.getenv("BACKEND_API_BASE_URL")

    # MongoDB configuration
    MONGO_INITDB_ROOT_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME")
    MONGO_INITDB_ROOT_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
    MONGO_INITDB_DATABASE = os.getenv("MONGO_INITDB_DATABASE")
    MONGODB_HOST = os.getenv("MONGODB_HOST", "localhost")
    MONGODB_PORT = os.getenv("MONGODB_PORT", "27019")
    MONGODB_DATABASE = os.getenv("MONGODB_DATABASE", MONGO_INITDB_DATABASE)
    MONGODB_COLLECTION_CHAT_HISTORY = os.getenv("MONGODB_COLLECTION_CHAT_HISTORY")

    # Construct MongoDB URL
    MONGODB_URL = f"mongodb://{MONGO_INITDB_ROOT_USERNAME}:{MONGO_INITDB_ROOT_PASSWORD}@{MONGODB_HOST}:{MONGODB_PORT}/{MONGO_INITDB_DATABASE}?authSource=admin"

    # Validate required environment variables
    @classmethod
    def validate(cls):
        required_vars = [
            "PORT",
            "GOOGLE_API_KEY",
            "LANGSMITH_API_KEY", 
            "BACKEND_API_BASE_URL",
            "MONGO_INITDB_ROOT_USERNAME",
            "MONGO_INITDB_ROOT_PASSWORD",
            "MONGO_INITDB_DATABASE",
            "MONGODB_COLLECTION_CHAT_HISTORY",
        ]
        missing_vars = [var for var in required_vars if not getattr(cls, var)]
        if missing_vars:
            raise ValueError(f"Missing required environment variables: {missing_vars}")

    @classmethod
    def setup_langsmith_tracing(cls):
        """Configure LangSmith tracing environment variables"""
        if cls.LANGSMITH_API_KEY:
            os.environ["LANGCHAIN_TRACING_V2"] = cls.LANGSMITH_TRACING
            os.environ["LANGCHAIN_API_KEY"] = cls.LANGSMITH_API_KEY
            os.environ["LANGCHAIN_ENDPOINT"] = cls.LANGSMITH_ENDPOINT

            if cls.LANGSMITH_PROJECT:
                os.environ["LANGCHAIN_PROJECT"] = cls.LANGSMITH_PROJECT

            print(
                f"LangSmith tracing enabled for project: {cls.LANGSMITH_PROJECT or 'default'}"
            )
        else:
            print("LangSmith API key not provided, tracing disabled")
