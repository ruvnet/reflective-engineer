"""Completion module for SPARC methodology"""

from typing import Dict, Any
from datetime import datetime
from ..core import SparcCore


class CompletionModule:
    def __init__(self, core: SparcCore):
        self.core = core

    def generate(self, design_file: str, run_tests: bool = True, 
                deploy: bool = False) -> Dict[str, Any]:
        """Complete implementation with testing and deployment"""
        try:
            with open(design_file, 'r') as f:
                design_content = f.read()
        except Exception as e:
            return {
                'success': False,
                'error': f'Failed to read design file: {str(e)}',
                'output': None
            }

        if not self.core.validate_input(design_content, 'completion'):
            return {
                'success': False,
                'error': 'Invalid design content',
                'output': None
            }

        # Implementation phase
        impl_prompt = (
            f"Implement the following design:\n\n{design_content}\n\n"
            "Include:\n"
            "1. Complete code implementation\n"
            "2. Documentation\n"
            "3. Error handling\n"
            "4. Logging\n"
            "5. Configuration management"
        )

        impl_result = self.core.execute_ra_aid(impl_prompt, cowboy_mode=True)
        
        if not impl_result['success']:
            return impl_result

        results = {
            'implementation': impl_result['output']
        }

        # Testing phase
        if run_tests:
            test_prompt = (
                "Generate comprehensive tests for the implementation:\n\n"
                f"{impl_result['output']}\n\n"
                "Include:\n"
                "1. Unit tests\n"
                "2. Integration tests\n"
                "3. Edge cases\n"
                "4. Performance tests\n"
                "5. Security tests"
            )

            test_result = self.core.execute_ra_aid(test_prompt, cowboy_mode=True)
            
            if test_result['success']:
                results['tests'] = test_result['output']

        # Deployment phase
        if deploy:
            deploy_prompt = (
                "Prepare deployment configuration and scripts:\n\n"
                f"{impl_result['output']}\n\n"
                "Include:\n"
                "1. Deployment scripts\n"
                "2. Environment configuration\n"
                "3. Monitoring setup\n"
                "4. Backup procedures\n"
                "5. Rollback strategy"
            )

            deploy_result = self.core.execute_ra_aid(deploy_prompt, cowboy_mode=True)
            
            if deploy_result['success']:
                results['deployment'] = deploy_result['output']

        context = {
            'stage': 'completion',
            'input': design_file,
            'output': results,
            'timestamp': datetime.now().isoformat()
        }
        self.core.save_context(context)

        return {
            'success': True,
            'output': results,
            'error': None
        }


def generate(core: SparcCore, design_file: str, run_tests: bool = True,
            deploy: bool = False) -> Dict[str, Any]:
    """Complete implementation using CompletionModule"""
    module = CompletionModule(core)
    return module.generate(design_file, run_tests, deploy)