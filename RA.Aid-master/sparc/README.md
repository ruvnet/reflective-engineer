# SPARC CLI

SPARC (Systematic Programming and Refinement Companion) is a modular CLI tool that implements the SPARC methodology using RA.Aid. It helps developers create well-structured, maintainable applications by following a systematic approach to software development.

## Features

- **Modular Architecture**: Each phase of development is handled by specialized modules
- **RA.Aid Integration**: Leverages RA.Aid's capabilities for intelligent code generation and analysis
- **Systematic Approach**: Follows the SPARC methodology:
  - **S**pecification: Define clear objectives and user scenarios
  - **P**seudocode: Outline logic in language-agnostic form
  - **A**rchitecture: Design maintainable, scalable systems
  - **R**efinement: Iteratively optimize for performance and clarity
  - **C**ompletion: Test thoroughly, document, deploy, and integrate

## Installation

```bash
# Install from PyPI
pip install sparc-cli

# Or install from source
git clone https://github.com/ai-christianson/ra-aid.git
cd ra-aid
pip install -e .
```

## Prerequisites

- Python 3.8 or higher
- RA.Aid installed and configured
- API keys set up for your preferred AI provider (see RA.Aid documentation)

## Usage

### Basic Commands

```bash
# Generate specification from description
sparc spec "Create a REST API for user management" -o spec.md

# Generate pseudocode from specification
sparc pseudo spec.md -o pseudo.md

# Generate architecture design from pseudocode
sparc arch pseudo.md -o arch.md

# Refine architecture design
sparc refine arch.md -i 3 -o refined.md

# Complete implementation with testing
sparc complete refined.md --test
```

### Command Options

#### Specification Generation
```bash
sparc spec [DESCRIPTION] [OPTIONS]
  Options:
    -o, --output FILE  Output file for specification (default: specification.md)
```

#### Pseudocode Generation
```bash
sparc pseudo [SPEC_FILE] [OPTIONS]
  Options:
    -o, --output FILE  Output file for pseudocode (default: pseudocode.md)
```

#### Architecture Design
```bash
sparc arch [PSEUDO_FILE] [OPTIONS]
  Options:
    -o, --output FILE  Output file for architecture (default: architecture.md)
```

#### Design Refinement
```bash
sparc refine [ARCH_FILE] [OPTIONS]
  Options:
    -i, --iterations N  Number of refinement iterations (default: 1)
    -o, --output FILE   Output file for refined design (default: refined.md)
```

#### Implementation Completion
```bash
sparc complete [DESIGN_FILE] [OPTIONS]
  Options:
    --test/--no-test       Run tests after completion (default: --test)
    --deploy/--no-deploy   Deploy after completion (default: --no-deploy)
```

## Example Workflow

1. Start with a project description:
```bash
sparc spec "Create a secure user authentication system with OAuth2 support"
```

2. Generate pseudocode from the specification:
```bash
sparc pseudo specification.md
```

3. Create architecture design:
```bash
sparc arch pseudocode.md
```

4. Refine the design:
```bash
sparc refine architecture.md -i 2
```

5. Complete implementation:
```bash
sparc complete refined.md --test --deploy
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](../LICENSE) file for details.

## Acknowledgments

- Built on top of [RA.Aid](https://github.com/ai-christianson/ra-aid)
- Inspired by systematic software development methodologies