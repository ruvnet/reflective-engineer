"""Main CLI entry point for SPARC"""

import click
from .core import SparcCore
from .modules import (
    specification,
    pseudocode,
    architecture,
    refinement,
    completion
)

@click.group()
@click.version_option()
def cli():
    """SPARC CLI - Systematic Programming and Refinement Companion
    
    A modular interface for RA.Aid that implements the SPARC methodology:
    - Specification: Define clear objectives and user scenarios
    - Pseudocode: Outline logic in language-agnostic form
    - Architecture: Design maintainable, scalable systems
    - Refinement: Iteratively optimize for performance and clarity
    - Completion: Test thoroughly, document, deploy, and integrate
    """
    pass

@cli.command()
@click.argument('description', required=True)
def spec(description):
    """Generate a detailed specification from a description"""
    core = SparcCore()
    result = specification.generate(core, description)
    if result['success']:
        click.echo("Specification generated successfully")
    else:
        click.echo(f"Error: {result['error']}")
    return result

@cli.command()
@click.argument('spec_file', type=click.Path(exists=True))
@click.option('--output', '-o', default='pseudocode.md',
              help='Output file for the pseudocode')
def pseudo(spec_file, output):
    """Generate pseudocode from a specification"""
    core = SparcCore()
    result = pseudocode.generate(core, spec_file)
    click.echo(f"Pseudocode generated and saved to {output}")
    return result

@cli.command()
@click.argument('pseudo_file', type=click.Path(exists=True))
@click.option('--output', '-o', default='architecture.md',
              help='Output file for the architecture design')
def arch(pseudo_file, output):
    """Generate architecture design from pseudocode"""
    core = SparcCore()
    result = architecture.generate(core, pseudo_file)
    click.echo(f"Architecture design generated and saved to {output}")
    return result

@cli.command()
@click.argument('arch_file', type=click.Path(exists=True))
@click.option('--iterations', '-i', default=1,
              help='Number of refinement iterations')
@click.option('--output', '-o', default='refined.md',
              help='Output file for the refined design')
def refine(arch_file, iterations, output):
    """Refine architecture design iteratively"""
    core = SparcCore()
    result = refinement.generate(core, arch_file, iterations)
    click.echo(f"Refined design generated and saved to {output}")
    return result

@cli.command()
@click.argument('design_file', type=click.Path(exists=True))
@click.option('--test/--no-test', default=True,
              help='Run tests after completion')
@click.option('--deploy/--no-deploy', default=False,
              help='Deploy after completion')
def complete(design_file, test, deploy):
    """Complete implementation with testing and deployment"""
    core = SparcCore()
    result = completion.generate(core, design_file, test, deploy)
    click.echo("Implementation completed successfully")
    return result

if __name__ == '__main__':
    cli()