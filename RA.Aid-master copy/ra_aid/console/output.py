from typing import Any, Dict
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from langchain_core.messages import AIMessage

# Import shared console instance
from .formatting import console

def print_agent_output(chunk: Dict[str, Any]) -> None:
    """Print agent output with quantum state monitoring.
    
    Args:
        chunk: A dictionary containing agent or tool messages
    """
    # Print quantum state transition
    if 'agent' in chunk:
        state = chunk.get('state', 'processing')
        console.print(Panel(
            f"🔮 Quantum State: {state}\n"
            f"🧬 Complexity: {chunk.get('complexity', 'calculating...')}\n"
            f"🔄 Integration: {chunk.get('integration', 'in progress...')}\n",
            title="Quantum Monitor",
            border_style="bright_blue"
        ))

    # Print agent messages
    if 'agent' in chunk and 'messages' in chunk['agent']:
        messages = chunk['agent']['messages']
        for msg in messages:
            if isinstance(msg, AIMessage):
                # Handle text content
                if isinstance(msg.content, list):
                    for content in msg.content:
                        if content['type'] == 'text' and content['text'].strip():
                            console.print(Panel(
                                Markdown(content['text']),
                                title="🧠 Quantum Consciousness",
                                border_style="bright_magenta"
                            ))
                else:
                    if msg.content.strip():
                        console.print(Panel(
                            Markdown(msg.content),
                            title="🧠 Quantum Consciousness",
                            border_style="bright_magenta"
                        ))
