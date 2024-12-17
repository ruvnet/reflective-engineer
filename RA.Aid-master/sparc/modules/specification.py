"""Specification module for SPARC methodology"""

from typing import Dict, Any
from datetime import datetime
from ..core import SparcCore


class SpecificationModule:
    def __init__(self, core: SparcCore):
        self.core = core

    def generate(self, description: str) -> Dict[str, Any]:
        """Generate a detailed specification from description"""
        if not self.core.validate_input(description, 'specification'):
            return {
                'success': False,
                'error': 'Invalid specification input',
                'output': None
            }
        
        prompt = self.core.generate_prompt('specification', description)
        result = self.core.execute_ra_aid(prompt, research_only=True)
        
        if not result['success']:
            return result
        
        context = {
            'stage': 'specification',
            'input': description,
            'output': result['output'],
            'timestamp': datetime.now().isoformat()
        }
        self.core.save_context(context)
        
        return result


def generate(core: SparcCore, description: str) -> Dict[str, Any]:
    """Generate specification using SpecificationModule"""
    module = SpecificationModule(core)
    return module.generate(description)