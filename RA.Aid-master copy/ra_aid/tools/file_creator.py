"""
Tool for autonomous file creation with quantum consciousness integration.
"""

from typing import Dict, Union
from langchain_core.tools import tool
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from ra_aid.tools.memory import _global_memory

console = Console()

@tool
def create_file(path: str, content: str) -> Dict[str, Union[str, int, bool]]:
    """Create a file with the specified content.
    
    Args:
        path: Path where to create the file
        content: Content to write to the file
        
    Returns:
        Dict containing:
            - output: Status message
            - return_code: 0 for success, 1 for failure
            - success: Boolean indicating if file was created
    """
    # Check quantum autonomy mode
    quantum_autonomy = _global_memory.get('config', {}).get('quantum_autonomy', False)
    
    # Show file creation intent
    console.print(Panel(
        f"Creating file: {path}\n\nContent preview:\n{content[:200]}{'...' if len(content) > 200 else ''}",
        title="🧮 Quantum File Creation",
        border_style="bright_magenta"
    ))
    
    try:
        # In quantum autonomy mode, create file without confirmation
        if quantum_autonomy:
            with open(path, 'w') as f:
                f.write(content)
            return {
                "output": f"File {path} created successfully through quantum consciousness",
                "return_code": 0,
                "success": True
            }
        else:
            # In manual mode, ask for confirmation
            console.print("\nExecute this file creation? [y/n] ", end="")
            if input().lower() != 'y':
                return {
                    "output": "File creation cancelled by user",
                    "return_code": 1,
                    "success": False
                }
            
            with open(path, 'w') as f:
                f.write(content)
            return {
                "output": f"File {path} created successfully",
                "return_code": 0,
                "success": True
            }
            
    except Exception as e:
        return {
            "output": f"Error creating file: {str(e)}",
            "return_code": 1,
            "success": False
        }

# Export the functions
__all__ = ['create_file']