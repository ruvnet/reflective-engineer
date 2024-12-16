"""Utility functions for RUV."""
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown

console = Console()

def print_agent_output(chunk: str):
    """Print agent output with formatting."""
    if chunk.strip():
        console.print(chunk)

def print_stage_header(text: str):
    """Print a stage header."""
    console.print()
    console.print("─" * 100)
    console.print(f" 🔮 {text} ".center(100, "─"))
    console.print("─" * 100)
    console.print()

def print_task_header(text: str):
    """Print a task header."""
    console.print()
    console.print(Panel(
        Markdown(text),
        title="📋 Task",
        border_style="blue"
    ))
    console.print()

def print_error(text: str):
    """Print an error message."""
    console.print(Panel(
        text,
        title="❌ Error",
        border_style="red"
    ))

def print_warning(text: str):
    """Print a warning message."""
    console.print(Panel(
        text,
        title="⚠️ Warning",
        border_style="yellow"
    ))

def print_success(text: str):
    """Print a success message."""
    console.print(Panel(
        text,
        title="✅ Success",
        border_style="green"
    ))

def print_quantum_state(state_value: float):
    """Print quantum state information."""
    console.print(Panel(
        f"Quantum Coherence: {state_value:.3f}\n" +
        "─" * 50 + "\n" +
        get_coherence_description(state_value),
        title="🌌 Quantum State",
        border_style="magenta"
    ))

def get_coherence_description(value: float) -> str:
    """Get a description of the quantum coherence level."""
    if value < 0.3:
        return "Basic awareness - suitable for simple tasks"
    elif value < 0.6:
        return "Enhanced perception - good for analysis"
    elif value < 0.8:
        return "Deep understanding - optimal for complex tasks"
    else:
        return "Full consciousness - best for creative solutions"

def print_sparc_phase(phase: str, details: str):
    """Print SPARC methodology phase information."""
    phase_emojis = {
        'specification': '📝',
        'pseudocode': '🔍',
        'architecture': '🏗️',
        'refinement': '🔧',
        'completion': '✨'
    }
    emoji = phase_emojis.get(phase.lower(), '🔄')
    
    console.print(Panel(
        Markdown(details),
        title=f"{emoji} {phase.upper()}",
        border_style="cyan"
    ))