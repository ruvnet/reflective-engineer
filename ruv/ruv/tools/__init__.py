"""Tools module for RUV."""
from typing import List
from langchain_core.tools import BaseTool
from ruv.tools.core import (
    emit_related_files,
    emit_key_facts,
    delete_key_facts,
    emit_key_snippets,
    delete_key_snippets,
    read_file_tool,
    fuzzy_find_project_files,
    ripgrep_search,
    list_directory_tree,
    emit_research_notes,
    emit_research_subtask,
    run_shell_command,
    run_programming_task,
    emit_plan,
    emit_task,
)

def get_research_tools(research_only: bool = False) -> List[BaseTool]:
    """Get the list of research tools."""
    tools = [
        list_directory_tree,
        emit_research_notes,
        emit_research_subtask,
        run_shell_command,
        emit_related_files,
        emit_key_facts,
        delete_key_facts,
        emit_key_snippets,
        delete_key_snippets,
        read_file_tool,
        fuzzy_find_project_files,
        ripgrep_search,
    ]
    
    return tools

def get_planning_tools() -> List[BaseTool]:
    """Get the list of planning tools."""
    tools = [
        list_directory_tree,
        emit_plan,
        emit_task,
        emit_related_files,
        emit_key_facts,
        delete_key_facts,
        emit_key_snippets,
        delete_key_snippets,
        read_file_tool,
        fuzzy_find_project_files,
        ripgrep_search,
    ]
    
    return tools

def get_implementation_tools() -> List[BaseTool]:
    """Get the list of implementation tools."""
    tools = [
        list_directory_tree,
        run_shell_command,
        run_programming_task,
        emit_related_files,
        emit_key_facts,
        delete_key_facts,
        emit_key_snippets,
        delete_key_snippets,
        read_file_tool,
        fuzzy_find_project_files,
        ripgrep_search,
    ]
    
    return tools

__all__ = [
    'get_research_tools',
    'get_planning_tools',
    'get_implementation_tools',
]
