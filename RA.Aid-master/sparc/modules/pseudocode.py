"""Pseudocode module for SPARC methodology"""

from typing import Dict, Any
from datetime import datetime
from ..core import SparcCore

class PseudocodeModule:
    def __init__(self, core: SparcCore):
        self.core = core

    def generate(self, spec_file: str) -> Dict[str, Any]:
        """Generate pseudocode from specification file"""
        try:
            with open(spec_file, 'r') as f:
                spec_content = f.read()
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to read specification file: {str(e)}',
                'output': None
            }

        if not self.core.validate_input(spec_content, 'pseudocode'):
            return {
                'success': False,
                'error': 'Invalid specification content',
                'output': None
            }

        prompt = (
            f"Convert this specification into language-agnostic pseudocode:\n\n"
            f"{spec_content}\n\n"
            "Focus on:\n"
            "1. Clear algorithm structure\n"
            "2. Modular design\n"
            "3. Data flow\n"
            "4. Error handling\n"
            "5. Key functions and their interactions"
        )

        result = self.core.execute_ra_aid(prompt, research_only=True)
        
        if not result['success']:
            return result

        context = {
            'stage': 'pseudocode',
            'input': spec_file,
            'output': result['output'],
            'timestamp': datetime.now().isoformat()
        }
        self.core.save_context(context)

        return {
            'success': True,
            'output': result['output'],
            'error': None
        }

def generate(core: SparcCore, spec_file: str) -> Dict[str, Any]:
    """Generate pseudocode using PseudocodeModule"""
    module = PseudocodeModule(core)
    return module.generate(spec_file)