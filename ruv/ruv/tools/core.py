"""Core tools for RUV."""
from typing import Dict, List, Optional, Union
from langchain_core.tools import tool
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown

console = Console()

# Memory store for global state
_global_memory = {}

@tool
def ripgrep_search(
    pattern: str,
    *,
    file_type: str = None,
    case_sensitive: bool = True,
    include_hidden: bool = False,
    follow_links: bool = False,
    exclude_dirs: List[str] = None
) -> Dict[str, Union[str, int, bool]]:
    """Execute a ripgrep (rg) search with formatting and common options."""
    import shutil
    import subprocess
    import platform
    
    # Check if ripgrep is installed
    rg_path = shutil.which('rg')
    if not rg_path:
        system = platform.system().lower()
        install_instructions = {
            'linux': """
To install ripgrep on Linux:

Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install ripgrep
```

Fedora:
```bash
sudo dnf install ripgrep
```

Arch Linux:
```bash
sudo pacman -S ripgrep
```""",
            'darwin': """
To install ripgrep on macOS using Homebrew:
```bash
brew install ripgrep
```""",
            'windows': """
To install ripgrep on Windows:

Using Chocolatey:
```bash
choco install ripgrep
```

Using Scoop:
```bash
scoop install ripgrep
```"""
        }.get(system, "Please visit https://github.com/BurntSushi/ripgrep#installation")
        
        console.print(Panel(
            f"ripgrep (rg) is not installed.\n\n{install_instructions}",
            title="⚠️ Dependency Missing",
            border_style="yellow"
        ))
        return {
            "output": "ripgrep not installed",
            "return_code": 1,
            "success": False
        }
    
    # Build rg command with options
    cmd = ['rg', '--color', 'always']
    
    if not case_sensitive:
        cmd.append('-i')
    
    if include_hidden:
        cmd.append('--hidden')
        
    if follow_links:
        cmd.append('--follow')
        
    if file_type:
        cmd.extend(['-t', file_type])

    # Add exclusions
    default_excludes = [
        '.git',
        'node_modules',
        'vendor',
        '.venv',
        '__pycache__',
        '.cache',
        'dist',
        'build',
        'env',
        '.env',
        'venv',
        '.idea',
        '.vscode'
    ]
    exclusions = default_excludes + (exclude_dirs or [])
    for dir in exclusions:
        cmd.extend(['--glob', f'!{dir}'])

    # Add the search pattern
    cmd.append(pattern)

    # Execute command
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True
        )
        
        # If command failed but ripgrep exists, it might be a pattern error
        if result.returncode != 0:
            error_msg = "Search failed. Please check your pattern syntax."
            console.print(Panel(error_msg, title="⚠️ Search Error", border_style="yellow"))
            return {
                "output": error_msg,
                "return_code": result.returncode,
                "success": False
            }
        
        return {
            "output": result.stdout,
            "return_code": result.returncode,
            "success": result.returncode == 0
        }
        
    except Exception as e:
        error_msg = str(e)
        console.print(Panel(error_msg, title="❌ Error", border_style="red"))
        return {
            "output": error_msg,
            "return_code": 1,
            "success": False
        }

@tool
def emit_research_notes(notes: str) -> Dict[str, str]:
    """Emit research notes about the codebase."""
    _global_memory['research_notes'] = notes
    return {"result": "Research notes stored"}

@tool
def emit_plan(plan: str) -> Dict[str, str]:
    """Emit a plan for implementation."""
    _global_memory['plan'] = plan
    return {"result": "Plan stored"}

@tool
def emit_task(task: str) -> Dict[str, str]:
    """Emit a task for implementation."""
    if 'tasks' not in _global_memory:
        _global_memory['tasks'] = []
    _global_memory['tasks'].append(task)
    return {"result": f"Task stored: {task}"}

@tool
def emit_related_files(files: List[str]) -> Dict[str, List[str]]:
    """Emit a list of files related to the current task."""
    if 'related_files' not in _global_memory:
        _global_memory['related_files'] = set()
    _global_memory['related_files'].update(files)
    return {"files": list(_global_memory['related_files'])}

@tool
def emit_key_facts(fact: str) -> Dict[str, str]:
    """Emit a key fact discovered during research."""
    if 'key_facts' not in _global_memory:
        _global_memory['key_facts'] = []
    _global_memory['key_facts'].append(fact)
    return {"result": f"Fact stored: {fact}"}

@tool
def delete_key_facts() -> Dict[str, str]:
    """Delete all stored key facts."""
    _global_memory['key_facts'] = []
    return {"result": "Key facts cleared"}

@tool
def emit_key_snippets(snippet: str, description: str) -> Dict[str, str]:
    """Emit a key code snippet with description."""
    if 'key_snippets' not in _global_memory:
        _global_memory['key_snippets'] = []
    _global_memory['key_snippets'].append({
        'snippet': snippet,
        'description': description
    })
    return {"result": f"Snippet stored: {description}"}

@tool
def delete_key_snippets() -> Dict[str, str]:
    """Delete all stored key snippets."""
    _global_memory['key_snippets'] = []
    return {"result": "Key snippets cleared"}

@tool
def emit_research_subtask(subtask: str) -> Dict[str, str]:
    """Emit a research subtask to be executed."""
    if 'research_subtasks' not in _global_memory:
        _global_memory['research_subtasks'] = []
    _global_memory['research_subtasks'].append(subtask)
    return {"result": f"Research subtask stored: {subtask}"}

@tool
def read_file_tool(path: str) -> Dict[str, Union[str, int, bool]]:
    """Read the contents of a file."""
    try:
        with open(path, 'r') as f:
            content = f.read()
        return {
            "content": content,
            "success": True
        }
    except Exception as e:
        console.print(Panel(str(e), title="❌ Error", border_style="red"))
        return {
            "content": str(e),
            "success": False
        }

@tool
def fuzzy_find_project_files(pattern: str) -> Dict[str, Union[List[str], bool]]:
    """Find files matching a fuzzy pattern."""
    import glob
    try:
        matches = glob.glob(f"**/{pattern}", recursive=True)
        return {
            "matches": matches,
            "success": True
        }
    except Exception as e:
        return {
            "matches": [],
            "error": str(e),
            "success": False
        }

@tool
def list_directory_tree(path: str = ".") -> Dict[str, Union[str, bool]]:
    """List directory contents in tree format."""
    import os
    
    def tree(startpath, prefix=''):
        output = []
        for f in sorted(os.listdir(startpath)):
            if f.startswith('.'):
                continue
            filepath = os.path.join(startpath, f)
            output.append(prefix + '├── ' + f)
            if os.path.isdir(filepath):
                output.extend(tree(filepath, prefix + '│   '))
        return output
    
    try:
        tree_output = '\n'.join(tree(path))
        return {
            "tree": tree_output,
            "success": True
        }
    except Exception as e:
        return {
            "tree": str(e),
            "success": False
        }

@tool
def run_shell_command(command: str) -> Dict[str, Union[str, int, bool]]:
    """Execute a shell command."""
    import subprocess
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True
        )
        return {
            "output": result.stdout + result.stderr,
            "return_code": result.returncode,
            "success": result.returncode == 0
        }
    except Exception as e:
        return {
            "output": str(e),
            "return_code": 1,
            "success": False
        }

@tool
def run_programming_task(
    task: str,
    file_path: str,
    code: str
) -> Dict[str, Union[str, bool]]:
    """Execute a programming task by writing code to a file."""
    try:
        with open(file_path, 'w') as f:
            f.write(code)
        return {
            "message": f"Code written to {file_path}",
            "success": True
        }
    except Exception as e:
        return {
            "message": str(e),
            "success": False
        }

def get_memory_value(key: str) -> Optional[str]:
    """Get a value from the global memory store."""
    return _global_memory.get(key)

def get_related_files() -> List[str]:
    """Get the list of related files."""
    return list(_global_memory.get('related_files', set()))