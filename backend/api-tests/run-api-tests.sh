#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Internship Management API Test Suite${NC}"
echo -e "${BLUE}=======================================${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found. Please run this script from the api-tests directory.${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
    echo ""
fi

# Check if Spring Boot application is running
echo -e "${YELLOW}🏥 Checking if Spring Boot application is running...${NC}"
if curl -s --max-time 5 http://localhost:8080 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Spring Boot application is running on port 8080${NC}"
else
    echo -e "${RED}❌ Spring Boot application is not reachable on port 8080${NC}"
    echo -e "${YELLOW}💡 Please start your Spring Boot application first:${NC}"
    echo -e "${CYAN}   cd backend${NC}"
    echo -e "${CYAN}   ./mvnw spring-boot:run${NC}"
    echo ""
    echo -e "${YELLOW}❓ Do you want to continue anyway? (y/N)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}👋 Exiting...${NC}"
        exit 1
    fi
fi

echo ""

# Parse command line arguments
MODULE=""
VERBOSE=""
URL=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--module)
            MODULE="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE="--verbose"
            shift
            ;;
        -u|--url)
            URL="--url $2"
            shift 2
            ;;
        -h|--help)
            echo -e "${CYAN}Usage: $0 [OPTIONS]${NC}"
            echo ""
            echo -e "${CYAN}Options:${NC}"
            echo -e "  -m, --module <module>   Test specific module (auth, students, teachers, companies, mentors, batches, internships)"
            echo -e "  -v, --verbose           Verbose output"
            echo -e "  -u, --url <url>         Override base URL (default: http://localhost:8080/api)"
            echo -e "  -h, --help              Show this help message"
            echo ""
            echo -e "${CYAN}Examples:${NC}"
            echo -e "  $0                      # Run all tests"
            echo -e "  $0 -m auth              # Test only authentication module"
            echo -e "  $0 -m students -v       # Test students module with verbose output"
            echo -e "  $0 -u http://localhost:9090/api  # Use custom URL"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Unknown option: $1${NC}"
            echo -e "${YELLOW}Use -h or --help for usage information${NC}"
            exit 1
            ;;
    esac
done

# Build the command
CMD="node test-runner.js"
if [ ! -z "$MODULE" ]; then
    CMD="$CMD --module $MODULE"
fi
if [ ! -z "$VERBOSE" ]; then
    CMD="$CMD $VERBOSE"
fi
if [ ! -z "$URL" ]; then
    CMD="$CMD $URL"
fi

# Run the tests
echo -e "${PURPLE}🧪 Running API tests...${NC}"
echo -e "${CYAN}Command: $CMD${NC}"
echo ""

eval $CMD
TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests completed successfully!${NC}"
else
    echo -e "${RED}❌ Some tests failed. Exit code: $TEST_EXIT_CODE${NC}"
fi

exit $TEST_EXIT_CODE 