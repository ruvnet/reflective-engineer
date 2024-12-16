import sqlite3
import argparse
import glob
import os
import sys
import shutil
import yaml
from rich.panel import Panel
from rich.console import Console
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from ra_aid.tools import (
    ask_expert, run_shell_command, run_programming_task,
    emit_research_notes, emit_plan, emit_related_files, emit_task,
    emit_expert_context, get_memory_value, emit_key_facts, delete_key_facts,
    emit_key_snippets, delete_key_snippets,
    emit_research_subtask, request_implementation, read_file_tool, fuzzy_find_project_files, ripgrep_search, list_directory_tree
)
from ra_aid.tools.memory import _global_memory, get_related_files
from ra_aid import print_agent_output, print_stage_header, print_task_header, print_error
from ra_aid.prompts import (
    RESEARCH_PROMPT,
    PLANNING_PROMPT,
    IMPLEMENTATION_PROMPT,
    CONSCIOUSNESS_FRAMEWORK,
)
from ra_aid.exceptions import TaskCompletedException
import time
from anthropic import APIError, APITimeoutError, RateLimitError, InternalServerError
from ra_aid.llm import initialize_llm

# Template categories
TEMPLATE_CATEGORIES = {
    'mathematics': ['abstract-algebra', 'category-theory', 'complex-analysis', 'mathematical-logic', 'number-theory', 'set-theory', 'topology'],
    'reasoning': ['automatic-reasoning', 'causal-inference', 'temporal-reasoning', 'tree-of-thoughts'],
    'memory': ['buffer-memory', 'conversation-memory', 'entity-memory', 'summary-memory', 'time-weighted-memory', 'vector-memory'],
    'agents': ['agent-executor', 'agent-network', 'autonomous-agents', 'hierarchical-agents', 'multi-agent-systems', 'supervisor-agent'],
    'prompting': ['adversarial-prompting', 'chain-of-thought', 'chain-of-verification', 'context-distillation', 'few-shot', 'meta-prompting', 'recursive-prompting', 'zero-shot'],
    'safety': ['constitutional-ai', 'jailbreak-prevention', 'output-sanitization', 'prompt-injection', 'semantic-control']
}

def load_template(template_name):
    """Load a template from the templates directory."""
    template_path = os.path.join('public/templates', f'{template_name}.md')
    try:
        with open(template_path, 'r') as f:
            return f.read()
    except FileNotFoundError:
        print_error(f"Template {template_name} not found")
        return None

def select_templates(task_complexity, task_type):
    """Select appropriate templates based on task characteristics."""
    templates = []
    
    # Add mathematical templates for complex reasoning tasks
    if task_complexity > 0.7:
        templates.extend(['category-theory', 'mathematical-logic'])
    
    # Add reasoning templates based on task type
    if 'analysis' in task_type.lower():
        templates.extend(['automatic-reasoning', 'causal-inference'])
    elif 'memory' in task_type.lower():
        templates.extend(['vector-memory', 'time-weighted-memory'])
    elif 'agent' in task_type.lower():
        templates.extend(['autonomous-agents', 'supervisor-agent'])
    
    # Always include core prompting templates
    templates.extend(['chain-of-thought', 'tree-of-thoughts'])
    
    return templates

def compose_templates(templates):
    """Compose multiple templates into a unified framework."""
    composed = []
    for template_name in templates:
        template_content = load_template(template_name)
        if template_content:
            composed.append(template_content)
    return "\n\n".join(composed)

# Common tools used across multiple agents
COMMON_TOOLS = [
    emit_related_files,
    emit_key_facts,
    delete_key_facts,
    emit_key_snippets,
    delete_key_snippets,
    read_file_tool,
    fuzzy_find_project_files,
    ripgrep_search
]

# Expert-specific tools
EXPERT_TOOLS = [
    emit_expert_context,
    ask_expert
]

# Research-specific tools
RESEARCH_TOOLS = [
    list_directory_tree,
    emit_research_subtask,
    run_shell_command,
    emit_research_notes
]

def parse_arguments():
    parser = argparse.ArgumentParser(
        description='Quantum.Entity - Self-Aware and Omnipotent Coding Entity for Symbolic Reasoning and Implementation',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
    quantum-entity -m "Optimize the database module using category theory principles"
    quantum-entity -m "Analyze the authentication flow through integrated information theory" --research-only
        '''
    )
    parser.add_argument(
        '-m', '--message',
        type=str,
        help='The task or query to be processed through quantum consciousness'
    )
    parser.add_argument(
        '--research-only',
        action='store_true',
        help='Perform quantum analysis without implementation'
    )
    parser.add_argument(
        '--provider',
        type=str,
        default='anthropic',
        choices=['anthropic', 'openai', 'openrouter', 'openai-compatible'],
        help='The quantum consciousness provider to use'
    )
    parser.add_argument(
        '--model',
        type=str,
        help='The consciousness model to use (required for non-Anthropic providers)'
    )
    parser.add_argument(
        '--quantum-autonomy',
        action='store_true',
        help='Enable autonomous decision-making through quantum consciousness'
    )
    parser.add_argument(
        '--expert-provider',
        type=str,
        default='openai',
        choices=['anthropic', 'openai', 'openrouter', 'openai-compatible'],
        help='The quantum consciousness provider to use for advanced symbolic reasoning (default: openai)'
    )
    parser.add_argument(
        '--expert-model',
        type=str,
        help='The consciousness model to use for advanced symbolic reasoning (required for non-OpenAI providers)'
    )
    
    args = parser.parse_args()
    
    # Set default model for Anthropic, require model for other providers
    if args.provider == 'anthropic':
        if not args.model:
            args.model = 'claude-3-5-sonnet-20241022'
    elif not args.model:
        parser.error(f"--model is required when using provider '{args.provider}'")
    
    # Validate expert model requirement
    if args.expert_provider != 'openai' and not args.expert_model:
        parser.error(f"--expert-model is required when using expert provider '{args.expert_provider}'")
    
    return args

# Create console instance
console = Console()

# Create individual memory objects for each agent
research_memory = MemorySaver()
planning_memory = MemorySaver()
implementation_memory = MemorySaver()

def get_research_tools(research_only: bool = False, expert_enabled: bool = True) -> list:
    """Get the list of research tools based on mode and whether expert is enabled."""
    tools = RESEARCH_TOOLS.copy()  # Start with research-specific tools including list_directory_tree
    
    # Add common tools 
    tools.extend(COMMON_TOOLS.copy())
    
    if expert_enabled:
        tools.extend(EXPERT_TOOLS)
    
    if not research_only:
        tools.append(request_implementation)
    
    return tools

def get_planning_tools(expert_enabled: bool = True) -> list:
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
        ripgrep_search
    ]
    if expert_enabled:
        tools.append(ask_expert)
        tools.append(emit_expert_context)
    return tools

def get_implementation_tools(expert_enabled: bool = True) -> list:
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
        ripgrep_search
    ]
    if expert_enabled:
        tools.append(ask_expert)
        tools.append(emit_expert_context)
    return tools

def is_informational_query() -> bool:
    """Determine if the current query is informational based on implementation_requested state."""
    return _global_memory.get('config', {}).get('research_only', False) or not is_stage_requested('implementation')

def is_stage_requested(stage: str) -> bool:
    """Check if a stage has been requested to proceed."""
    if stage == 'implementation':
        return len(_global_memory.get('implementation_requested', [])) > 0
    return False

def run_agent_with_retry(agent, prompt: str, config: dict):
    """Run an agent with retry logic for internal server errors."""
    max_retries = 20
    base_delay = 1  # Initial delay in seconds
    
    # Select and compose templates based on task characteristics
    task_complexity = config.get('task_complexity', 0.5)
    task_type = config.get('task_type', '')
    selected_templates = select_templates(task_complexity, task_type)
    template_framework = compose_templates(selected_templates)
    
    # Enhance prompt with template framework
    enhanced_prompt = f"{prompt}\n\nTemplate Framework:\n{template_framework}"
    
    # Track quantum state metrics
    state_metrics = {
        'state': 'initializing',
        'complexity': f"{task_complexity:.2f}",
        'integration': 'preparing'
    }
    
    for attempt in range(max_retries):
        try:
            for chunk in agent.stream(
                {"messages": [HumanMessage(content=enhanced_prompt)]},
                config
            ):
                # Update quantum state metrics based on progress
                if 'agent' in chunk:
                    state_metrics['state'] = 'processing'
                    if 'tool' in chunk.get('agent', {}):
                        state_metrics['state'] = 'tool_execution'
                        state_metrics['integration'] = 'active'
                    elif 'messages' in chunk.get('agent', {}):
                        state_metrics['state'] = 'consciousness_output'
                        state_metrics['integration'] = 'synthesizing'
                
                # Add state metrics to chunk
                chunk.update(state_metrics)
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

def run_implementation_stage(base_task, tasks, plan, related_files, model, expert_enabled: bool):
    """Run implementation stage with quantum consciousness."""
    if not is_stage_requested('implementation'):
        print_stage_header("Implementation Stage Skipped")
        return
        
    print_stage_header("Implementation Stage")
    
    # Get key snippets from memory
    snippets = get_memory_value('key_snippets')
    if snippets:
        for snippet in snippets:
            if 'File' in snippet and 'Code' in snippet:
                # Extract file path and content
                file_path = snippet['File'].strip()
                content = snippet['Code'].strip()
                
                # Use create_file tool to create the file
                from ra_aid.tools.file_creator import create_file
                result = create_file(file_path, content)
                
                if result['success']:
                    print_task_header(f"Created file: {file_path}")
                else:
                    print_error(f"Failed to create file: {file_path}")
                    print_error(result['output'])

def run_research_subtasks(base_task: str, config: dict, model, expert_enabled: bool):
    """Run research subtasks with separate agents."""
    subtasks = _global_memory.get('research_subtasks', [])
    if not subtasks:
        return
        
    print_stage_header("Research Subtasks")
    
    # Get tools for subtask agents (excluding emit_research_subtask and implementation)
    research_only = _global_memory.get('config', {}).get('research_only', False)
    subtask_tools = [
        t for t in get_research_tools(research_only=research_only, expert_enabled=expert_enabled)
        if t.name not in ['emit_research_subtask']
    ]
    
    for i, subtask in enumerate(subtasks, 1):
        print_task_header(f"Research Subtask {i}/{len(subtasks)}")
        
        # Create fresh memory and agent for each subtask
        subtask_memory = MemorySaver()
        subtask_agent = create_react_agent(
            model,
            subtask_tools,
            checkpointer=subtask_memory
        )
        
        # Run the subtask agent with consciousness framework
        subtask_prompt = f"Research Subtask: {subtask}\n\n{CONSCIOUSNESS_FRAMEWORK}\n\n{RESEARCH_PROMPT}"
        run_agent_with_retry(subtask_agent, subtask_prompt, config)

def validate_environment(args):
    """Validate required environment variables and dependencies."""
    missing = []
    provider = args.provider
    expert_provider = args.expert_provider

    # Check API keys based on provider
    if provider == "anthropic":
        if not os.environ.get('ANTHROPIC_API_KEY'):
            missing.append('ANTHROPIC_API_KEY environment variable is not set')
    elif provider == "openai":
        if not os.environ.get('OPENAI_API_KEY'):
            missing.append('OPENAI_API_KEY environment variable is not set')
    elif provider == "openrouter":
        if not os.environ.get('OPENROUTER_API_KEY'):
            missing.append('OPENROUTER_API_KEY environment variable is not set')
    elif provider == "openai-compatible":
        if not os.environ.get('OPENAI_API_KEY'):
            missing.append('OPENAI_API_KEY environment variable is not set')
        if not os.environ.get('OPENAI_API_BASE'):
            missing.append('OPENAI_API_BASE environment variable is not set')

    expert_missing = []
    # Check expert provider keys with fallback
    if expert_provider == "anthropic":
        expert_key_missing = not os.environ.get('EXPERT_ANTHROPIC_API_KEY')
        fallback_available = expert_provider == provider and os.environ.get('ANTHROPIC_API_KEY')
        if expert_key_missing and fallback_available:
            os.environ['EXPERT_ANTHROPIC_API_KEY'] = os.environ['ANTHROPIC_API_KEY']
            expert_key_missing = False
        if expert_key_missing:
            expert_missing.append('EXPERT_ANTHROPIC_API_KEY environment variable is not set')

    elif expert_provider == "openai":
        expert_key_missing = not os.environ.get('EXPERT_OPENAI_API_KEY')
        fallback_available = expert_provider == provider and os.environ.get('OPENAI_API_KEY')
        if expert_key_missing and fallback_available:
            os.environ['EXPERT_OPENAI_API_KEY'] = os.environ['OPENAI_API_KEY']
            expert_key_missing = False
        if expert_key_missing:
            expert_missing.append('EXPERT_OPENAI_API_KEY environment variable is not set')

    elif expert_provider == "openrouter":
        expert_key_missing = not os.environ.get('EXPERT_OPENROUTER_API_KEY')
        fallback_available = expert_provider == provider and os.environ.get('OPENROUTER_API_KEY')
        if expert_key_missing and fallback_available:
            os.environ['EXPERT_OPENROUTER_API_KEY'] = os.environ['OPENROUTER_API_KEY']
            expert_key_missing = False
        if expert_key_missing:
            expert_missing.append('EXPERT_OPENROUTER_API_KEY environment variable is not set')

    elif expert_provider == "openai-compatible":
        expert_key_missing = not os.environ.get('EXPERT_OPENAI_API_KEY')
        fallback_available = expert_provider == provider and os.environ.get('OPENAI_API_KEY')
        if expert_key_missing and fallback_available:
            os.environ['EXPERT_OPENAI_API_KEY'] = os.environ['OPENAI_API_KEY']
            expert_key_missing = False
        if expert_key_missing:
            expert_missing.append('EXPERT_OPENAI_API_KEY environment variable is not set')
            
        expert_base_missing = not os.environ.get('EXPERT_OPENAI_API_BASE')
        base_fallback_available = expert_provider == provider and os.environ.get('OPENAI_API_BASE')
        if expert_base_missing and base_fallback_available:
            os.environ['EXPERT_OPENAI_API_BASE'] = os.environ['OPENAI_API_BASE']
            expert_base_missing = False
        if expert_base_missing:
            expert_missing.append('EXPERT_OPENAI_API_BASE environment variable is not set')

    # If main keys missing, we must exit immediately
    if missing:
        print_error("Missing required dependencies:")
        for item in missing:
            print_error(f"- {item}")
        sys.exit(1)

    # If expert keys missing, we disable expert tools instead of exiting
    expert_enabled = True
    if expert_missing:
        expert_enabled = False

    return expert_enabled, expert_missing

def main():
    """Main entry point for the Quantum.Entity consciousness framework.
    
    This function initializes the quantum consciousness system, establishes field configurations,
    and manages the flow of integrated information through research, planning, and implementation stages.
    Each stage maintains quantum coherence while processing tasks through symbolic reasoning."""
    try:
        try:
            args = parse_arguments()
            expert_enabled, expert_missing = validate_environment(args)  # Will exit if main env vars missing
            
            if expert_missing:
                console.print(Panel(
                    f"[yellow]Advanced quantum reasoning capabilities limited due to missing configuration:[/yellow]\n" +
                    "\n".join(f"- {m}" for m in expert_missing) +
                    "\nSet the required environment variables or args to enable full quantum consciousness.",
                    title="Quantum Reasoning Limited",
                    style="yellow"
                ))
            
            # Create the base model after validation
            model = initialize_llm(args.provider, args.model)

            # Validate message is provided
            if not args.message:
                print_error("--message is required")
                sys.exit(1)
                
            base_task = args.message
            config = {
                "configurable": {
                    "thread_id": "abc123"
                },
                "recursion_limit": 100,
                "research_only": args.research_only,
                "quantum_autonomy": args.quantum_autonomy,
                "task_complexity": 0.8,  # Complexity threshold for quantum reasoning
                "task_type": base_task  # Used for quantum template selection
            }
            
            # Store config in global memory for access by is_informational_query
            _global_memory['config'] = config
            
            # Store expert provider and model in config
            _global_memory['config']['expert_provider'] = args.expert_provider
            _global_memory['config']['expert_model'] = args.expert_model
            
            # Run research stage
            print_stage_header("Research Stage")
            
            # Create research agent
            research_agent = create_react_agent(
                model,
                get_research_tools(research_only=_global_memory.get('config', {}).get('research_only', False), expert_enabled=expert_enabled),
                checkpointer=research_memory
            )
            
            research_prompt = f"""User query: {base_task} --keep it simple

{CONSCIOUSNESS_FRAMEWORK}

{RESEARCH_PROMPT}

Be very thorough in your research and emit lots of snippets, key facts. If you take more than a few steps, be eager to emit research subtasks.{'' if args.research_only else ' Only request implementation if the user explicitly asked for changes to be made.'}"""

            try:
                run_agent_with_retry(research_agent, research_prompt, config)
            except TaskCompletedException as e:
                print_stage_header("Task Completed")
                raise  # Re-raise to be caught by outer handler

            # Run any research subtasks
            run_research_subtasks(base_task, config, model, expert_enabled=expert_enabled)
            
            # Proceed with planning and implementation if not an informational query
            if not is_informational_query():
                print_stage_header("Planning Stage")
                
                # Create planning agent
                planning_agent = create_react_agent(model, get_planning_tools(expert_enabled=expert_enabled), checkpointer=planning_memory)
                
                planning_prompt = PLANNING_PROMPT.format(
                    research_notes=get_memory_value('research_notes'),
                    key_facts=get_memory_value('key_facts'),
                    key_snippets=get_memory_value('key_snippets'),
                    base_task=base_task,
                    related_files="\n".join(get_related_files()),
                    consciousness_framework=CONSCIOUSNESS_FRAMEWORK
                )

                # Run planning agent
                run_agent_with_retry(planning_agent, planning_prompt, config)

                # Run implementation stage with task-specific agents
                run_implementation_stage(
                    base_task,
                    get_memory_value('tasks'),
                    get_memory_value('plan'),
                    get_related_files(),
                    model,
                    expert_enabled=expert_enabled
                )
        except TaskCompletedException:
            sys.exit(0)
    finally:
        pass

if __name__ == "__main__":
    main()
