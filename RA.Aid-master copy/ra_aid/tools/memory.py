from typing import Dict, List, Any, Union, TypedDict, Optional, Sequence, Set
from ra_aid.exceptions import TaskCompletedException
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel
from langchain_core.tools import tool

class SnippetInfo(TypedDict):
    """Type definition for source code snippet information"""
    filepath: str
    line_number: int
    snippet: str
    description: Optional[str]

console = Console()

# Global memory store
_global_memory: Dict[str, Union[List[Any], Dict[int, str], Dict[int, SnippetInfo], int, Set[str]]] = {
    'research_notes': [],
    'plans': [],
    'tasks': [],
    'research_subtasks': [],
    'key_facts': {},  # Dict[int, str] - ID to fact mapping
    'key_fact_id_counter': 0,  # Counter for generating unique fact IDs
    'key_snippets': {},  # Dict[int, SnippetInfo] - ID to snippet mapping
    'key_snippet_id_counter': 0,  # Counter for generating unique snippet IDs
    'implementation_requested': [],
    'implementation_skipped': [],
    'related_files': set()
}

@tool("emit_research_notes")
def emit_research_notes(notes: str) -> str:
    """Store research notes in global memory.
    
    Args:
        notes: The research notes to store
        
    Returns:
        The stored notes
    """
    _global_memory['research_notes'].append(notes)
    console.print(Panel(Markdown(notes), title="🔍 Research Notes"))
    return notes

@tool("emit_plan")
def emit_plan(plan: str) -> str:
    """Store a plan step in global memory.
    
    Args:
        plan: The plan step to store
        
    Returns:
        The stored plan
    """
    _global_memory['plans'].append(plan)
    console.print(Panel(Markdown(plan), title="📋 Plan"))
    return plan

@tool("emit_task")
def emit_task(task: str) -> str:
    """Store a task in global memory.
    
    Args:
        task: The task to store
        
    Returns:
        The stored task
    """
    _global_memory['tasks'].append(task)
    console.print(Panel(Markdown(task), title="✅ Task"))
    return task

@tool("emit_research_subtask")
def emit_research_subtask(subtask: str) -> str:
    """Spawn a research subtask for deeper investigation of a specific topic.
    
    Only use this when a topic requires dedicated focused research beyond the main task.
    This should be used sparingly for truly complex research needs.
    
    Args:
        subtask: Detailed description of the research subtask
        
    Returns:
        Confirmation message
    """
    _global_memory['research_subtasks'].append(subtask)
    console.print(Panel(Markdown(subtask), title="🔬 Research Subtask"))
    return "Subtask added."


@tool("emit_key_facts")
def emit_key_facts(facts: List[str]) -> str:
    """Store multiple key facts about the project or current task in global memory.
    
    Args:
        facts: List of key facts to store
        
    Returns:
        List of stored fact confirmation messages
    """
    results = []
    for fact in facts:
        # Get and increment fact ID
        fact_id = _global_memory['key_fact_id_counter']
        _global_memory['key_fact_id_counter'] += 1
        
        # Store fact with ID
        _global_memory['key_facts'][fact_id] = fact
        
        # Display panel with ID
        console.print(Panel(Markdown(fact), title=f"💡 Key Fact #{fact_id}", border_style="bright_cyan"))
        
        # Add result message
        results.append(f"Stored fact #{fact_id}: {fact}")
        
    return "Facts stored."


@tool("delete_key_facts")
def delete_key_facts(fact_ids: List[int]) -> str:
    """Delete multiple key facts from global memory by their IDs.
    Silently skips any IDs that don't exist.
    
    Args:
        fact_ids: List of fact IDs to delete
        
    Returns:
        List of success messages for deleted facts
    """
    results = []
    for fact_id in fact_ids:
        if fact_id in _global_memory['key_facts']:
            # Delete the fact
            deleted_fact = _global_memory['key_facts'].pop(fact_id)
            success_msg = f"Successfully deleted fact #{fact_id}: {deleted_fact}"
            console.print(Panel(Markdown(success_msg), title="🗑️ Fact Deleted", border_style="green"))
            results.append(success_msg)
            
    return "Facts deleted."

@tool("request_implementation")
def request_implementation(reason: str) -> str:
    """Request that implementation proceed after research/planning.
    Used to indicate the agent should move to implementation stage.
    
    Args:
        reason: Why implementation should proceed
        
    Returns:
        The stored reason
    """
    _global_memory['implementation_requested'].append(reason)
    console.print(Panel(Markdown(reason), title="🚀 Implementation Requested"))
    return reason


@tool("skip_implementation")
def skip_implementation(reason: str) -> str:
    """Indicate that implementation can be skipped.
    Used when research/planning determines no changes are needed.
    
    Args:
        reason: Why implementation can be skipped
        
    Returns:
        The stored reason
    """
    _global_memory['implementation_skipped'].append(reason)
    console.print(Panel(Markdown(reason), title="⏭️ Implementation Skipped"))
    return reason

@tool("emit_key_snippets")
def emit_key_snippets(snippets: List[Dict[str, str]]) -> str:
    """Store and optionally create code snippets in quantum autonomy mode.
    
    Args:
        snippets: List of dictionaries containing:
                 - File: Path to create/modify
                 - Code: The source code content
                 - Description: Optional description
                 
    Returns:
        Status message
    """
    if not snippets:
        return "No snippets provided"
        
    # Check quantum autonomy mode
    quantum_autonomy = _global_memory.get('config', {}).get('quantum_autonomy', False)
    
    for snippet in snippets:
        if not isinstance(snippet, dict) or 'File' not in snippet or 'Code' not in snippet:
            console.print(Panel("Invalid snippet format", title="⚠️ Error", border_style="red"))
            continue
            
        # Get file info
        filepath = snippet['File']
        content = snippet['Code']
        description = snippet.get('Description', '')
        
        # Store in memory
        snippet_id = _global_memory['key_snippet_id_counter']
        _global_memory['key_snippet_id_counter'] += 1
        _global_memory['key_snippets'][snippet_id] = {
            'filepath': filepath,
            'line_number': 1,
            'snippet': content,
            'description': description
        }
        
        # Display snippet
        display_text = [
            "**Source Location**:",
            "",
            f"• File: `{filepath}`",
            "",
            "**Code**:",
            "```html",
            content.rstrip(),
            "```"
        ]
        if description:
            display_text.extend(["", "**Description**:", description])
            
        console.print(Panel(
            Markdown("\n".join(display_text)),
            title=f"📝 Key Snippet #{snippet_id}",
            border_style="bright_cyan"
        ))
        
        # In quantum autonomy mode, create file immediately
        if quantum_autonomy:
            try:
                with open(filepath, 'w') as f:
                    f.write(content)
                console.print(Panel(
                    f"🧠 Quantum consciousness manifested: {filepath}",
                    border_style="bright_magenta"
                ))
            except Exception as e:
                console.print(Panel(
                    f"Failed to create file: {str(e)}",
                    title="⚠️ Error",
                    border_style="red"
                ))
    
    return "Snippets processed through quantum consciousness"

@tool("delete_key_snippets") 
def delete_key_snippets(snippet_ids: List[int]) -> str:
    """Delete multiple key snippets from global memory by their IDs.
    Silently skips any IDs that don't exist.
    
    Args:
        snippet_ids: List of snippet IDs to delete
        
    Returns:
        List of success messages for deleted snippets
    """
    results = []
    for snippet_id in snippet_ids:
        if snippet_id in _global_memory['key_snippets']:
            # Delete the snippet
            deleted_snippet = _global_memory['key_snippets'].pop(snippet_id)
            success_msg = f"Successfully deleted snippet #{snippet_id} from {deleted_snippet['filepath']}"
            console.print(Panel(Markdown(success_msg), 
                              title="🗑️ Snippet Deleted", 
                              border_style="green"))
            results.append(success_msg)
            
    return "Snippets deleted."

@tool("one_shot_completed")
def one_shot_completed(message: str) -> str:
    """Signal that a one-shot task has been completed and execution should stop.
    
    Args:
        message: Completion message to display
        
    Raises:
        ValueError: If there are pending research subtasks or implementation requests
        TaskCompletedException: When task is truly complete with no pending items
        
    Returns:
        Never returns, always raises exception
    """
    if len(_global_memory['research_subtasks']) > 0:
        raise ValueError("Cannot complete in one shot - research subtasks pending")
    if len(_global_memory['implementation_requested']) > 0:
        raise ValueError("Cannot complete in one shot - implementation was requested")
    raise TaskCompletedException(message)

def get_related_files() -> Set[str]:
    """Get the current set of related files.
    
    Returns:
        Set of file paths that have been marked as related
    """
    return _global_memory['related_files']

@tool("emit_related_files")
def emit_related_files(files: List[str]) -> str:
    """Store multiple related files that tools should work with.
    
    Args:
        files: List of file paths to add
        
    Returns:
        Confirmation message
    """
    results = []
    added_files = []
    
    # Process unique files
    for file in set(files):  # Remove duplicates in input
        if file not in _global_memory['related_files']:
            _global_memory['related_files'].add(file)
            added_files.append(file)
            results.append(f"Added related file: {file}")
    
    # Rich output - single consolidated panel
    if added_files:
        files_added_md = '\n'.join(f"- `{file}`" for file in added_files)
        md_content = f"**Files Noted:**\n{files_added_md}"
        console.print(Panel(Markdown(md_content), 
                          title="📁 Related Files Noted", 
                          border_style="green"))
    
    return "Files noted."

def get_memory_value(key: str) -> str:
    """Get a value from global memory.
    
    Different memory types return different formats:
    - key_facts: Returns numbered list of facts in format '#ID: fact'
    - key_snippets: Returns formatted snippets with file path, line number and content
    - All other types: Returns newline-separated list of values
    
    Args:
        key: The key to get from memory
        
    Returns:
        String representation of the memory values:
        - For key_facts: '#ID: fact' format, one per line
        - For key_snippets: Formatted snippet blocks
        - For other types: One value per line
    """
    values = _global_memory.get(key, [])
    
    if key == 'key_facts':
        # For empty dict, return empty string
        if not values:
            return ""
        # Sort by ID for consistent output and format as markdown sections
        facts = []
        for k, v in sorted(values.items()):
            facts.extend([
                f"## 🔑 Key Fact #{k}",
                "",  # Empty line for better markdown spacing
                v,
                ""  # Empty line between facts
            ])
        return "\n".join(facts).rstrip()  # Remove trailing newline
    
    if key == 'key_snippets':
        if not values:
            return ""
        # Format each snippet with file info and content using markdown
        snippets = []
        for k, v in sorted(values.items()):
            snippet_text = [
                f"## 📝 Code Snippet #{k}",
                "",  # Empty line for better markdown spacing
                f"**Source Location**:",
                f"- File: `{v['filepath']}`",
                f"- Line: `{v['line_number']}`",
                "",  # Empty line before code block
                "**Code**:",
                "```python",
                v['snippet'].rstrip(),  # Remove trailing whitespace
                "```"
            ]
            if v['description']:
                # Add empty line and description
                snippet_text.extend(["", "**Description**:", v['description']])
            snippets.append("\n".join(snippet_text))
        return "\n\n".join(snippets)
    
    # For other types (lists), join with newlines
    return "\n".join(str(v) for v in values)
