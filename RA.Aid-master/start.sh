#!/bin/bash

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# RA.Aid CLI path
RAAID_CLI="python -m ra_aid"

# Function to set API key
set_api_key() {
    echo -e "Please enter your Anthropic API key:"
    read -p "> " api_key
    if [ -n "$api_key" ]; then
        # Create directory if it doesn't exist
        mkdir -p RA.Aid-master
        # Save to .env file
        echo "ANTHROPIC_API_KEY=$api_key" > RA.Aid-master/.env
        # Export for current session
        export ANTHROPIC_API_KEY="$api_key"
        echo -e "${GREEN}API key set successfully!${NC}"
        sleep 1
        return 0
    else
        echo -e "${RED}Invalid API key${NC}"
        return 1
    fi
}

# Function to check if API key is set
check_api_key() {
    # Try to load from .env if exists
    if [ -f .env ]; then
        export $(cat .env | xargs)
    elif [ -f RA.Aid-master/.env ]; then
        export $(cat RA.Aid-master/.env | xargs)
    fi
    
    # If API key is set, return success
    if [ -n "$ANTHROPIC_API_KEY" ]; then
        return 0
    fi
    
    # Otherwise, return failure but don't prompt
    return 1
}

# Function to display header
display_header() {
    clear
    echo -e "${BLUE}================================================${NC}"
    echo -e "${GREEN}RA.Aid - Reflective AI Development Assistant${NC}"
    echo -e "${BLUE}|Ψ(t)⟩ = Current universal state in Hilbert space H${NC}"
    echo -e "${GREEN}Integrated Information Φ = Active${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
}

# Function to execute ra_aid command safely
execute_raaid() {
    local cmd="$1"
    # Check/reload API key before executing
    check_api_key
    if [ $? -eq 0 ]; then
        eval "$cmd"
        return $?
    else
        echo -e "${YELLOW}Command skipped. No API key found in .env file.${NC}"
        echo -e "${YELLOW}Please set up your API key through the setup menu to use this feature.${NC}"
        read -p "Press enter to continue..."
        return 1
    fi
}

# Function to display main menu
main_menu() {
    while true; do
        display_header
        echo -e "Main Menu:"
        echo -e "1) Create New Application (TDD)"
        echo -e "2) Mathematical Templates"
        echo -e "3) Operation Modes"
        echo -e "4) Run Setup"
        echo -e "5) Deployment Options"
        echo -e "6) Check Dependencies"
        echo -e "7) Show Help"
        echo -e "8) Update RA.Aid"
        echo -e "9) Show Version"
        echo -e "0) Exit"
        echo ""
        read -p "Enter your choice: " choice

        case $choice in
            1) create_application_menu ;;
            2) mathematical_templates_menu ;;
            3) operation_modes_menu ;;
            4) run_setup ;;
            5) deployment_menu ;;
            6) check_dependencies ;;
            7) execute_raaid "$RAAID_CLI --help" ;;
            8) update_raaid ;;
            9) show_version ;;
            0) exit 0 ;;
            *) echo -e "${RED}Invalid option${NC}"; sleep 2 ;;
        esac
    done
}

# Function for application creation menu
create_application_menu() {
    display_header
    echo -e "Create New Application:"
    echo -e "1) Fast Development Mode"
    echo -e "2) Test-Driven Development (London School)"
    echo -e "3) Full Stack Development"
    echo -e "4) Machine Learning Application"
    echo -e "5) CLI Tool"
    echo -e "6) Middleware Service"
    echo -e "7) Data Processing Application"
    echo -e "8) Back to Main Menu"
    echo ""
    read -p "Enter your choice: " choice

    case $choice in
        1) development_approach_menu "fast" ;;
        2) development_approach_menu "tdd" ;;
        3) development_approach_menu "fullstack" ;;
        4) development_approach_menu "ml" ;;
        5) development_approach_menu "cli" ;;
        6) development_approach_menu "middleware" ;;
        7) development_approach_menu "data" ;;
        8) return ;;
        *) echo -e "${RED}Invalid option${NC}"; sleep 2; create_application_menu ;;
    esac
}

# Function for development approach menu
development_approach_menu() {
    local approach=$1
    display_header
    echo -e "Select Testing Level:"
    echo -e "1) Basic Testing (Unit Tests)"
    echo -e "2) Intermediate (Unit + Integration)"
    echo -e "3) Advanced (Unit + Integration + E2E)"
    echo -e "4) Comprehensive (All Tests + Performance)"
    echo -e "5) Back to Previous Menu"
    echo ""
    read -p "Enter your choice: " choice

    case $choice in
        1) configure_testing "basic" "$approach" ;;
        2) configure_testing "intermediate" "$approach" ;;
        3) configure_testing "advanced" "$approach" ;;
        4) configure_testing "comprehensive" "$approach" ;;
        5) create_application_menu ;;
        *) echo -e "${RED}Invalid option${NC}"; sleep 2; development_approach_menu "$approach" ;;
    esac
}

# Function for mathematical templates menu
mathematical_templates_menu() {
    display_header
    echo -e "Mathematical Templates:"
    echo -e "1) Abstract Algebra"
    echo -e "2) Category Theory"
    echo -e "3) Complex Analysis"
    echo -e "4) Mathematical Logic"
    echo -e "5) Number Theory"
    echo -e "6) Set Theory"
    echo -e "7) Topology"
    echo -e "8) Back to Main Menu"
    echo ""
    read -p "Enter your choice: " choice

    local template_message=""
    case $choice in
        1) template_message="Using abstract algebra template for mathematical analysis" ;;
        2) template_message="Using category theory template for mathematical analysis" ;;
        3) template_message="Using complex analysis template for mathematical analysis" ;;
        4) template_message="Using mathematical logic template for mathematical analysis" ;;
        5) template_message="Using number theory template for mathematical analysis" ;;
        6) template_message="Using set theory template for mathematical analysis" ;;
        7) template_message="Using topology template for mathematical analysis" ;;
        8) return ;;
        *) echo -e "${RED}Invalid option${NC}"; sleep 2; mathematical_templates_menu; return ;;
    esac

    execute_raaid "$RAAID_CLI -m \"$template_message\""
    read -p "Press enter to continue..."
}

# Function for operation modes menu
operation_modes_menu() {
    display_header
    echo -e "Operation Modes:"
    echo -e "1) Chain of Thought"
    echo -e "2) Tree of Thoughts"
    echo -e "3) React Framework"
    echo -e "4) Zero-Shot Learning"
    echo -e "5) Few-Shot Learning"
    echo -e "6) Back to Main Menu"
    echo ""
    read -p "Enter your choice: " choice

    local mode_message=""
    case $choice in
        1) mode_message="Using chain of thought mode for reasoning" ;;
        2) mode_message="Using tree of thoughts mode for reasoning" ;;
        3) mode_message="Using react framework mode for reasoning" ;;
        4) mode_message="Using zero-shot learning mode" ;;
        5) mode_message="Using few-shot learning mode" ;;
        6) return ;;
        *) echo -e "${RED}Invalid option${NC}"; sleep 2; operation_modes_menu; return ;;
    esac

    execute_raaid "$RAAID_CLI -m \"$mode_message\""
    read -p "Press enter to continue..."
}

# Function for deployment menu
deployment_menu() {
    display_header
    echo -e "Deployment Options:"
    echo -e "1) AWS"
    echo -e "2) Google Cloud"
    echo -e "3) Azure"
    echo -e "4) CloudFlare"
    echo -e "5) Supabase"
    echo -e "6) Fly.io"
    echo -e "7) Hugging Face"
    echo -e "8) Docker Configuration"
    echo -e "9) Back to Main Menu"
    echo ""
    read -p "Enter your choice: " choice

    local deploy_message=""
    case $choice in
        1) deploy_message="Configure deployment for AWS" ;;
        2) deploy_message="Configure deployment for Google Cloud" ;;
        3) deploy_message="Configure deployment for Azure" ;;
        4) deploy_message="Configure deployment for CloudFlare" ;;
        5) deploy_message="Configure deployment for Supabase" ;;
        6) deploy_message="Configure deployment for Fly.io" ;;
        7) deploy_message="Configure deployment for Hugging Face" ;;
        8) deploy_message="Configure Docker deployment" ;;
        9) return ;;
        *) echo -e "${RED}Invalid option${NC}"; sleep 2; deployment_menu; return ;;
    esac

    execute_raaid "$RAAID_CLI -m \"$deploy_message\""
    read -p "Press enter to continue..."
}

# Function to configure testing
configure_testing() {
    local test_level=$1
    local approach=$2
    local message="Create new $approach application with $test_level testing"
    
    execute_raaid "$RAAID_CLI -m \"$message\""
    read -p "Press enter to continue..."
}

# Function to run setup
run_setup() {
    display_header
    echo -e "${YELLOW}Running setup...${NC}"
    set_api_key
    echo -e "\n${GREEN}Setup complete!${NC}"
    read -p "Press enter to continue..."
}

# Function to check dependencies
check_dependencies() {
    display_header
    echo -e "${YELLOW}Checking dependencies...${NC}"
    
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo -e "${RED}✗ ANTHROPIC_API_KEY not set${NC}"
    else
        echo -e "${GREEN}✓ ANTHROPIC_API_KEY is set${NC}"
    fi
    
    if command -v python &> /dev/null; then
        echo -e "${GREEN}✓ Python is installed${NC}"
    else
        echo -e "${RED}✗ Python is not installed${NC}"
    fi
    
    if command -v pip &> /dev/null; then
        echo -e "${GREEN}✓ pip is installed${NC}"
    else
        echo -e "${RED}✗ pip is not installed${NC}"
    fi
    
    read -p "Press enter to continue..."
}

# Function to update RA.Aid
update_raaid() {
    display_header
    echo -e "${YELLOW}Checking for updates...${NC}"
    pip install --upgrade ra-aid 2>/dev/null || echo -e "${RED}Failed to update RA.Aid${NC}"
    echo -e "${GREEN}Update complete!${NC}"
    read -p "Press enter to continue..."
}

# Function to show version
show_version() {
    display_header
    execute_raaid "$RAAID_CLI --version" || echo -e "${RED}Failed to get version information${NC}"
    read -p "Press enter to continue..."
}

# Create RA.Aid directory if it doesn't exist
mkdir -p RA.Aid-master

# Start the script
check_api_key
main_menu