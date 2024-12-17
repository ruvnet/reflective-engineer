"""Core functionality for SPARC CLI"""

import subprocess
import json
import os
from typing import Dict, Any, Optional

class SparcCore:
    """Core class for managing RA.Aid interactions"""
    
    def __init__(self):
        self.ra_aid_path = "ra-aid"  # Assuming ra-aid is in PATH
        self.current_context: Dict[str, Any] = {}
    
    def execute_ra_aid(self, message: str, research_only: bool = False) -> Dict[str, Any]:
        """Execute ra-aid command with given parameters"""
        # Load API keys from environment
        env_with_key = os.environ.copy()
        
        # Get API keys from .env file
        try:
            with open('.env', 'r') as f:
                for line in f:
                    if line.startswith('ANTHROPIC_API_KEY='):
                        env_with_key['ANTHROPIC_API_KEY'] = line.strip().split('=', 1)[1]
                    elif line.startswith('OPENAI_API_KEY='):
                        env_with_key['OPENAI_API_KEY'] = line.strip().split('=', 1)[1]
                        env_with_key['EXPERT_OPENAI_API_KEY'] = line.strip().split('=', 1)[1]
        except Exception as e:
            print(f"Error reading .env file: {e}")
            return {
                'success': False,
                'output': None,
                'error': 'Failed to read API keys from .env file'
            }
        
        cmd = [self.ra_aid_path, "-m", message, "--cowboy-mode"]  # Always use cowboy mode
        
        if research_only:
            cmd.append("--research-only")
            
        try:
            # Run ra-aid without capturing output so it displays in real-time
            subprocess.run(
                cmd,
                text=True,
                check=True,
                env=env_with_key
            )
            return {
                'success': True,
                'output': 'See console output above',
                'error': None
            }
        except subprocess.CalledProcessError as e:
            return {
                'success': False,
                'output': None,
                'error': str(e)
            }
    
    def save_context(self, context_data: Dict[str, Any], 
                    filename: str = '.sparc-context.json') -> bool:
        """Save current context to file"""
        try:
            with open(filename, 'w') as f:
                json.dump(context_data, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving context: {e}")
            return False
    
    def load_context(self, filename: str = '.sparc-context.json') -> Optional[Dict[str, Any]]:
        """Load context from file"""
        try:
            if os.path.exists(filename):
                with open(filename, 'r') as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error loading context: {e}")
        return None
    
    def generate_prompt(self, stage: str, input_data: str) -> str:
        """Generate appropriate prompt for ra-aid based on SPARC stage"""
        prompts = {
            'specification': (
                f"Research and create a detailed specification document for: {input_data}. "
                "Include user scenarios, requirements, and constraints."
            ),
            'pseudocode': (
                f"Convert the following specification into language-agnostic pseudocode: {input_data}. "
                "Focus on algorithmic clarity and modularity."
            ),
            'architecture': (
                f"Design a maintainable and scalable system architecture based on: {input_data}. "
                "Include component relationships, data flow, and system boundaries."
            ),
            'refinement': (
                f"Optimize and refine the following design for performance and clarity: {input_data}. "
                "Consider efficiency, maintainability, and best practices."
            ),
            'completion': (
                f"Implement, test, and prepare for deployment: {input_data}. "
                "Include test cases, documentation, and deployment considerations."
            )
        }
        return prompts.get(stage, input_data)
    
    def validate_input(self, input_data: str, stage: str) -> bool:
        """Validate input data for given SPARC stage"""
        # Basic validation - can be extended based on specific requirements
        if not input_data:
            return False
            
        # Only validate that input is not empty
        return bool(input_data and input_data.strip())