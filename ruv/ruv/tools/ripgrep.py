from typing import Dict, Union, Optional, List
import shutil
import platform
from langchain_core.tools import tool
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from ra_aid.proc.interactive import run_interactive_command
from ra_aid.text.processing import truncate_output

console = Console()

DEFAULT_EXCLUDE_DIRS = [
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

def check_ripgrep_installation() -> Dict[str, Union[bool, str]]:
    """Check if ripgrep is installed and provide installation instructions if not."""
    rg_path = shutil.which('rg')
    if rg_path:
        return {
            "installed": True,
            "path": rg_path,
            "message": "ripgrep is installed"
        }
    
    # Prepare installation instructions based on platform
    system = platform.system().lower()
    if system == 'linux':
        instructions = """
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
```"""
    elif system == 'darwin':
        instructions = """
To install ripgrep on macOS using Homebrew:
```bash
brew install ripgrep
```"""
    elif system == 'windows':
        instructions = """
To install ripgrep on Windows:

Using Chocolatey:
```bash
choco install ripgrep
```

Using Scoop:
```bash
scoop install ripgrep
```"""
    else:
        instructions = "Please visit https://github.com/BurntSushi/ripgrep#installation for installation instructions."

    return {
        "installed": False,
        "path": None,
        "message": f"ripgrep (rg) is not installed. {instructions}"
    }

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
    """Execute a ripgrep (rg) search with formatting and common options.

    Args:
        pattern: Search pattern to find
        file_type: Optional file type to filter results (e.g. 'py' for Python files)
        case_sensitive: Whether to do case-sensitive search (default: True)
        include_hidden: Whether to search hidden files and directories (default: False)
        follow_links: Whether to follow symbolic links (default: False)
        exclude_dirs: Additional directories to exclude (combines with defaults)

    Returns:
        Dict containing:
            - output: The formatted search results
            - return_code: Process return code (0 means success)
            - success: Boolean indicating if search succeeded
    """
    # Check ripgrep installation first
    rg_check = check_ripgrep_installation()
    if not rg_check["installed"]:
        console.print(Panel(
            Markdown(rg_check["message"]),
            title="⚠️ Dependency Missing",
            border_style="yellow"
        ))
        return {
            "output": rg_check["message"],
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
    exclusions = DEFAULT_EXCLUDE_DIRS + (exclude_dirs or [])
    for dir in exclusions:
        cmd.extend(['--glob', f'!{dir}'])

    # Add the search pattern
    cmd.append(pattern)

    # Build info sections for display
    info_sections = []
    
    # Search parameters section
    params = [
        "## Search Parameters",
        f"**Pattern**: `{pattern}`",
        f"**Case Sensitive**: {case_sensitive}",
        f"**File Type**: {file_type or 'all'}"
    ]
    if include_hidden:
        params.append("**Including Hidden Files**: yes")
    if follow_links:
        params.append("**Following Symlinks**: yes")
    if exclude_dirs:
        params.append("\n**Additional Exclusions**:")
        for dir in exclude_dirs:
            params.append(f"- `{dir}`")
    info_sections.append("\n".join(params))

    # Execute command
    try:
        print()
        output, return_code = run_interactive_command(cmd)
        print()
        decoded_output = output.decode() if output else ""
        
        # If command failed but ripgrep exists, it might be a pattern error
        if return_code != 0 and rg_check["installed"]:
            error_msg = "Search failed. Please check your pattern syntax."
            console.print(Panel(error_msg, title="⚠️ Search Error", border_style="yellow"))
            return {
                "output": error_msg,
                "return_code": return_code,
                "success": False
            }
        
        return {
            "output": truncate_output(decoded_output),
            "return_code": return_code,
            "success": return_code == 0
        }
        
    except Exception as e:
        error_msg = str(e)
        console.print(Panel(error_msg, title="❌ Error", border_style="red"))
        return {
            "output": error_msg,
            "return_code": 1,
            "success": False
        }
