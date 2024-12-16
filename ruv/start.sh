#!/bin/bash

# Get the absolute path to the root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Load environment variables from root .env first
if [ -f "$ROOT_DIR/.env" ]; then
    echo "Loading environment from $ROOT_DIR/.env"
    export $(cat "$ROOT_DIR/.env" | grep -v '^#' | xargs)
else
    echo "Root .env not found at $ROOT_DIR/.env"
fi

# Load environment variables from local .env (overrides root if exists)
if [ -f .env ]; then
    echo "Loading environment from local .env"
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "Local .env not found"
fi

# Debug: Print API key (masked)
if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo "ANTHROPIC_API_KEY is set (starts with: ${ANTHROPIC_API_KEY:0:10}...)"
else
    echo "ANTHROPIC_API_KEY is not set"
fi

# Install dependencies quietly
pip install -e . > /dev/null 2>&1

# Run RUV with provided arguments
ruv "$@"