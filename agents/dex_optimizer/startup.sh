#!/bin/bash

# =============================================================================
# Script Name: startup.sh
# Description: Initializes the environment and runs the DEX Swap Optimizer.
# =============================================================================

# Exit immediately if a command exits with a non-zero status.
set -e

# Set configuration file path relative to script location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CONFIG_FILE="${SCRIPT_DIR}/config/config.yaml"

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: Config file not found at $CONFIG_FILE"
    exit 1
fi

# Run the main optimizer script
python src/main.py --config "$CONFIG_FILE"
