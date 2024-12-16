"""Language model initialization and configuration."""
import os
from anthropic import Anthropic
from langchain_anthropic import ChatAnthropic
from langchain_core.language_models import BaseChatModel

def initialize_llm(model_name: str = "claude-3-opus-20240229") -> BaseChatModel:
    """Initialize a language model client.

    Note: Environment variables must be validated before calling this function.
    Use validate_environment() to ensure all required variables are set.

    Args:
        model_name: Name of the model to use. Defaults to 'claude-3-opus-20240229'.

    Returns:
        BaseChatModel: Configured language model client

    Raises:
        ValueError: If required environment variables are not set
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY environment variable is not set")

    # Create base Anthropic client first
    client = Anthropic(api_key=api_key)

    # Then create LangChain wrapper using the base client's configuration
    return ChatAnthropic(
        model_name=model_name,
        anthropic_api_key=client.api_key,
        max_tokens=4096,
        temperature=0.7
    )

def validate_environment() -> bool:
    """Validate that all required environment variables are set.

    Returns:
        bool: True if all required variables are set, False otherwise
    """
    required_vars = [
        "ANTHROPIC_API_KEY"
    ]

    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"Missing required environment variables: {', '.join(missing_vars)}")
        return False
        
    return True
