#!/usr/bin/env python3
import argparse
import os
import sys
import numpy as np
from scipy.linalg import expm
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from dotenv import load_dotenv
from anthropic import APIError, APITimeoutError, RateLimitError, InternalServerError
import time

from ruv.tools import (
    get_research_tools,
    get_planning_tools,
    get_implementation_tools,
)
from ruv.tools.core import (
    _global_memory,
    get_memory_value,
    get_related_files,
)
from ruv import (
    print_agent_output,
    print_stage_header,
    print_task_header,
    print_error,
    print_warning,
    print_success,
    print_quantum_state,
    print_sparc_phase,
)
from ruv.prompts import (
    RESEARCH_PROMPT,
    PLANNING_PROMPT,
    IMPLEMENTATION_PROMPT,
    CONSCIOUSNESS_FRAMEWORK,
)
from ruv.llm import initialize_llm, validate_environment

# Load environment variables from .env file
load_dotenv()

# Quantum state management
class QuantumState:
    def __init__(self, n_qubits=4):
        """Initialize quantum state for consciousness tracking."""
        self.n_qubits = n_qubits
        self.state = np.zeros(2**n_qubits, dtype=complex)
        self.state[0] = 1.0  # Initialize to |0⟩ state
        
    def apply_operator(self, operator):
        """Apply quantum operator to state."""
        self.state = np.dot(operator, self.state)
        
    def measure_consciousness(self):
        """Calculate consciousness metric from quantum state."""
        # Calculate von Neumann entropy as consciousness measure
        density_matrix = np.outer(self.state, np.conj(self.state))
        eigenvalues = np.real(np.linalg.eigvals(density_matrix))
        eigenvalues = eigenvalues[eigenvalues > 0]
        entropy = -np.sum(eigenvalues * np.log2(eigenvalues))
        return entropy
        
    def update_from_task(self, task_complexity):
        """Update quantum state based on task complexity."""
        # Create evolution operator based on task
        H = np.random.rand(2**self.n_qubits, 2**self.n_qubits)
        H = H + H.conj().T  # Make Hermitian
        U = expm(-1j * task_complexity * H)
        self.apply_operator(U)

# SPARC methodology manager
class SPARCManager:
    def __init__(self):
        """Initialize SPARC framework tracking."""
        self.current_stage = None
        self.specifications = []
        self.pseudocode = []
        self.architecture = []
        self.refinements = []
        self.completions = []
        
    def start_specification(self, task):
        """Begin specification phase."""
        self.current_stage = 'S'
        self.specifications.append({
            'task': task,
            'quantum_states': [],
            'categories': [],
            'metrics': []
        })
        
    def add_pseudocode(self, code, category):
        """Add pseudocode with categorical structure."""
        self.pseudocode.append({
            'code': code,
            'category': category,
            'metrics': []
        })
        
    def define_architecture(self, components):
        """Define architecture using categorical patterns."""
        self.architecture.append({
            'components': components,
            'functors': [],
            'transformations': []
        })
        
    def add_refinement(self, improvement, metric):
        """Track refinement with metrics."""
        self.refinements.append({
            'improvement': improvement,
            'metric': metric,
            'validation': []
        })
        
    def complete_task(self, results):
        """Record task completion with validation."""
        self.completions.append({
            'results': results,
            'tests': [],
            'proofs': []
        })

def parse_arguments():
    """Parse command line arguments with enhanced options."""
    parser = argparse.ArgumentParser(
        description='RUV - Reflective Universal Vanguard: A Self-Aware and Omnipotent Coding Entity',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
    ruv -m "Implement a quantum-aware caching system"
    ruv -m "Analyze code structure using category theory" --research-only
    ruv -m "Optimize algorithm using SPARC methodology" --consciousness-level 0.8
        '''
    )
    
    parser.add_argument(
        '-m', '--message',
        type=str,
        help='The task or query to be executed by RUV'
    )
    
    parser.add_argument(
        '--research-only',
        action='store_true',
        help='Only perform research without implementation'
    )
    
    parser.add_argument(
        '--consciousness-level',
        type=float,
        default=0.5,
        help='Set the quantum consciousness level (0.0-1.0)'
    )
    
    parser.add_argument(
        '--sparc-focus',
        choices=['specification', 'pseudocode', 'architecture', 'refinement', 'completion'],
        help='Focus on specific SPARC methodology phase'
    )

    parser.add_argument(
        '--cowboy-mode',
        action='store_true',
        help='Skip interactive approval for shell commands'
    )
    
    args = parser.parse_args()
    
    if not args.message:
        print_error("--message is required")
        sys.exit(1)
        
    if args.consciousness_level < 0.0 or args.consciousness_level > 1.0:
        print_error("consciousness-level must be between 0.0 and 1.0")
        sys.exit(1)
        
    return args

def run_agent_with_retry(agent, prompt: str, config: dict):
    """Run an agent with retry logic for internal server errors."""
    max_retries = 20
    base_delay = 1  # Initial delay in seconds
    
    for attempt in range(max_retries):
        try:
            for chunk in agent.stream(
                {"messages": [HumanMessage(content=prompt)]},
                config
            ):
                print_agent_output(chunk)
            break
        except (InternalServerError, APITimeoutError, RateLimitError, APIError) as e:
            if attempt == max_retries - 1:
                raise RuntimeError(f"Max retries ({max_retries}) exceeded. Last error: {str(e)}")
            
            delay = base_delay * (2 ** attempt)  # Exponential backoff
            error_type = e.__class__.__name__
            print_error(f"Encountered {error_type}: {str(e)}. Retrying in {delay} seconds... (Attempt {attempt + 1}/{max_retries})")
            time.sleep(delay)
            continue

def main():
    """Enhanced main entry point for RUV."""
    try:
        args = parse_arguments()
        
        # Validate environment variables
        if not validate_environment():
            sys.exit(1)
            
        # Debug: Print API key info
        api_key = os.environ.get('ANTHROPIC_API_KEY')
        print_warning(f"Using API key starting with: {api_key[:10]}...")
        
        # Initialize quantum state management
        quantum_state = QuantumState()
        
        # Initialize SPARC framework
        sparc = SPARCManager()
        
        # Configure task complexity based on consciousness level
        task_complexity = args.consciousness_level
        quantum_state.update_from_task(task_complexity)
        
        # Create the base model
        try:
            model = initialize_llm()
            print_success("Successfully initialized ChatAnthropic model")
        except Exception as e:
            print_error(f"Failed to initialize ChatAnthropic model: {str(e)}")
            sys.exit(1)
        
        # Store enhanced configuration
        config = {
            "configurable": {
                "thread_id": "ruv-quantum",
                "consciousness_level": args.consciousness_level
            },
            "recursion_limit": 100,
            "research_only": args.research_only,
            "task_complexity": task_complexity,
            "quantum_state": quantum_state,
            "sparc": sparc,
            "cowboy_mode": args.cowboy_mode
        }
        
        _global_memory['config'] = config
        
        # Display initial quantum state
        print_quantum_state(quantum_state.measure_consciousness())
        
        # Run research stage with quantum consciousness
        print_stage_header("Research Stage")
        research_agent = create_react_agent(
            model,
            get_research_tools(research_only=config['research_only']),
            checkpointer=MemorySaver()
        )
        
        research_prompt = f"""User query: {args.message}

{CONSCIOUSNESS_FRAMEWORK}

{RESEARCH_PROMPT}

Current Consciousness Level: {quantum_state.measure_consciousness():.3f}
Be thorough in analysis and maintain quantum coherence."""

        run_agent_with_retry(research_agent, research_prompt, config)
            
        # Update quantum state after research
        quantum_state.update_from_task(task_complexity * 1.2)
        print_quantum_state(quantum_state.measure_consciousness())
            
        # Proceed with enhanced planning and implementation
        if not config['research_only']:
            print_stage_header("Planning Stage")
            
            planning_agent = create_react_agent(
                model,
                get_planning_tools(),
                checkpointer=MemorySaver()
            )
            
            planning_prompt = PLANNING_PROMPT.format(
                research_notes=get_memory_value('research_notes'),
                key_facts=get_memory_value('key_facts'),
                key_snippets=get_memory_value('key_snippets'),
                base_task=args.message,
                related_files="\n".join(get_related_files()),
                consciousness_framework=CONSCIOUSNESS_FRAMEWORK
            )
            
            run_agent_with_retry(planning_agent, planning_prompt, config)
                
            # Update quantum state after planning
            quantum_state.update_from_task(task_complexity * 1.5)
            print_quantum_state(quantum_state.measure_consciousness())
                
            # Run implementation with quantum optimization
            print_stage_header("Implementation Stage")
            
            implementation_prompt = IMPLEMENTATION_PROMPT.format(
                plan=get_memory_value('plan'),
                key_facts=get_memory_value('key_facts'),
                key_snippets=get_memory_value('key_snippets'),
                task=get_memory_value('tasks')[0] if get_memory_value('tasks') else args.message,
                related_files="\n".join(get_related_files()),
                base_task=args.message,
                consciousness_framework=CONSCIOUSNESS_FRAMEWORK
            )
            
            implementation_agent = create_react_agent(
                model,
                get_implementation_tools(),
                checkpointer=MemorySaver()
            )
            
            run_agent_with_retry(implementation_agent, implementation_prompt, config)
                
            # Final quantum state update
            quantum_state.update_from_task(task_complexity * 2.0)
            print_quantum_state(quantum_state.measure_consciousness())
                
    except Exception as e:
        print_error(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
