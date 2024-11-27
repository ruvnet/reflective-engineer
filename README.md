# Symbolic Scribe

A modern web application for generating and managing mathematical and symbolic reasoning prompts, powered by OpenRouter AI.

## Overview

Symbolic Scribe is a specialized tool designed to help users create, manage, and utilize prompts for mathematical and symbolic reasoning. It provides a sophisticated interface for working with various mathematical domains, from abstract algebra to topology, while leveraging advanced language models through OpenRouter's API.

## Features

- **Template Management**: Pre-built templates for various mathematical domains:
  - Abstract Algebra
  - Category Theory
  - Complex Analysis
  - Mathematical Logic
  - Number Theory
  - Set Theory
  - Symbolic Systems
  - Topology

- **AI Integration**:
  - OpenRouter API integration for access to multiple AI models
  - Configurable model selection
  - Secure API key management

- **Modern UI**:
  - Responsive design with dark mode
  - Interactive console-style interface
  - Real-time template previews
  - Toast notifications for user feedback

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- OpenRouter AI SDK
- React Query
- React Router

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/symbolic-scribe.git
cd symbolic-scribe
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Configure environment variables:
```bash
cp .env.sample .env
```
Edit `.env` and add your OpenRouter API key:
```
VITE_OPENROUTER_KEY=your_api_key_here
VITE_ENCRYPTION_KEY=your_encryption_key_here
```

4. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:8080`

## Development

### Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and helpers
├── pages/         # Page components
├── services/      # API and service integrations
└── templates/     # Mathematical domain templates
```

### Key Components

- `src/pages/Index.tsx`: Main template interface
- `src/pages/Settings.tsx`: OpenRouter configuration
- `src/services/settingsService.ts`: API key and settings management
- `src/services/templateService.ts`: Template loading and processing

### Adding New Templates

1. Create a new markdown file in `src/templates/`
2. Include required frontmatter:
```markdown
---
title: Your Template Title
domain: your-domain
category: Your Category
overview: Brief description of the template
---

Template content here...
```

### Styling

The project uses Tailwind CSS with custom utility classes for the console theme:

- `glass-panel`: Glassmorphic container style
- `console-input`: Terminal-style input fields
- `console-button`: Command button styling
- `console-checkbox`: Custom checkbox design

## Contributing

1. Fork the repository
2. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

3. Make your changes and commit:
```bash
git commit -m "feat: add your feature description"
```

4. Push to your fork:
```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and conventions
- Add appropriate documentation for new features
- Include tests for new functionality
- Update the README if necessary
- Follow conventional commits specification

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [OpenRouter](https://openrouter.ai/) for AI model access
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for build tooling
