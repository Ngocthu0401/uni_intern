#!/bin/bash

# Company API Test Script
# This script tests all Company CRUD operations

# Base URL
BASE_URL="http://localhost:8080/api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="$5"
    local headers="$6"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "${BLUE}Testing: $test_name${NC}"
    
    if [ -n "$data" ]; then
        if [ -n "$headers" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
                      -H "Content-Type: application/json" \
                      -H "$headers" \
                      -d "$data")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
                      -H "Content-Type: application/json" \
                      -d "$data")
        fi
    else
        if [ -n "$headers" ]; then
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
                      -H "$headers")
        else
            response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
        fi
    fi
    
    # Extract status code
    status_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $status_code)"
        echo "Response: $response_body"
    fi
    echo ""
}

echo -e "${YELLOW}Company API Test Suite${NC}"
echo "=========================="
echo ""

# Step 1: Register a test user (admin)
echo -e "${BLUE}Step 1: Setting up test user${NC}"

ADMIN_DATA='{
    "username": "testadmin",
    "email": "testadmin@company.com",
    "password": "admin123",
    "fullName": "Test Admin",
    "role": "DEPARTMENT"
}'

# Try to register admin user (may already exist)
echo -e "${BLUE}Testing: Register admin user${NC}"
register_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/signup" \
                   -H "Content-Type: application/json" \
                   -d "$ADMIN_DATA")

register_status=$(echo "$register_response" | tail -n1)
register_body=$(echo "$register_response" | head -n -1)

if [ "$register_status" = "200" ] || [ "$register_status" = "400" ]; then
    if [ "$register_status" = "200" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: $register_status) - User registered"
    else
        echo -e "${YELLOW}⚠ SKIPPED${NC} (Status: $register_status) - User already exists"
    fi
    PASSED_TESTS=$((PASSED_TESTS + 1))
else
    echo -e "${RED}✗ FAILED${NC} (Expected: 200 or 400, Got: $register_status)"
    echo "Response: $register_body"
fi
echo ""
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Step 2: Login to get JWT token
echo -e "${BLUE}Step 2: Getting authentication token${NC}"

LOGIN_DATA='{
    "username": "testadmin",
    "password": "admin123"
}'

login_response=$(curl -s -X POST "$BASE_URL/auth/signin" \
                 -H "Content-Type: application/json" \
                 -d "$LOGIN_DATA")

# Extract JWT token (the API returns "token" field, not "accessToken")
JWT_TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$JWT_TOKEN" ]; then
    echo -e "${GREEN}✓ Authentication successful${NC}"
    AUTH_HEADER="Authorization: Bearer $JWT_TOKEN"
else
    echo -e "${RED}✗ Authentication failed${NC}"
    echo "Response: $login_response"
    exit 1
fi
echo ""

# Step 3: Test Company CRUD Operations
echo -e "${YELLOW}Step 3: Testing Company CRUD Operations${NC}"

# Test 1: Create Company with unique code
TIMESTAMP=$(date +%s)
COMPANY_CODE="TTC$TIMESTAMP"
COMPANY_DATA='{
    "companyName": "Test Tech Company",
    "companyCode": "'$COMPANY_CODE'",
    "industry": "Technology",
    "address": "123 Tech Street, Silicon Valley",
    "phoneNumber": "123-456-7890",
    "email": "contact@testtech.com",
    "website": "https://www.testtech.com",
    "companySize": "100-500",
    "description": "A leading technology company specializing in software development",
    "contactPerson": "John Doe",
    "contactPosition": "HR Manager",
    "contactPhone": "123-456-7891",
    "contactEmail": "hr@testtech.com"
}'

# Create company and extract ID
echo -e "${BLUE}Testing: Create company${NC}"
create_response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/companies" \
                 -H "Content-Type: application/json" \
                 -H "$AUTH_HEADER" \
                 -d "$COMPANY_DATA")

status_code=$(echo "$create_response" | tail -n1)
response_body=$(echo "$create_response" | head -n -1)

if [ "$status_code" = "201" ]; then
    echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    # Extract company ID from response
    COMPANY_ID=$(echo "$response_body" | grep -o '"id":[0-9]*' | cut -d':' -f2)
    echo "Created company with ID: $COMPANY_ID"
else
    echo -e "${RED}✗ FAILED${NC} (Expected: 201, Got: $status_code)"
    echo "Response: $response_body"
    exit 1
fi
echo ""
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test 2: Get all companies
run_test "Get all companies" "GET" "/companies" "" "200" "$AUTH_HEADER"

# Test 3: Get companies with pagination
run_test "Get companies with pagination" "GET" "/companies?page=0&size=5" "" "200" "$AUTH_HEADER"

# Test 4: Search companies
run_test "Search companies by keyword" "GET" "/companies/search?keyword=Tech" "" "200" "$AUTH_HEADER"

# Test 5: Get companies by industry
run_test "Get companies by industry" "GET" "/companies/industry/Technology" "" "200" "$AUTH_HEADER"

# Test 6: Get active companies
run_test "Get active companies" "GET" "/companies/active" "" "200" "$AUTH_HEADER"

# Test 7: Get company by code
run_test "Get company by code" "GET" "/companies/code/$COMPANY_CODE" "" "200" "$AUTH_HEADER"

# Test 8: Advanced search
run_test "Advanced search companies" "GET" "/companies/advanced-search?keyword=Tech&industry=Technology&isActive=true" "" "200" "$AUTH_HEADER"

# Test 9: Check company code exists
run_test "Check company code exists" "GET" "/companies/check-code/$COMPANY_CODE" "" "200" "$AUTH_HEADER"

# Test 10: Get company statistics
run_test "Get total company count" "GET" "/companies/statistics/count" "" "200" "$AUTH_HEADER"
run_test "Get active company count" "GET" "/companies/statistics/active-count" "" "200" "$AUTH_HEADER"

# Test 11: Update company
UPDATE_COMPANY_DATA='{
    "companyName": "Updated Tech Company",
    "companyCode": "'$COMPANY_CODE'",
    "industry": "Technology",
    "address": "456 Innovation Avenue, Silicon Valley",
    "phoneNumber": "123-456-7890",
    "email": "contact@updatedtech.com",
    "website": "https://www.updatedtech.com",
    "companySize": "500-1000",
    "description": "An updated leading technology company",
    "contactPerson": "Jane Smith",
    "contactPosition": "HR Director",
    "contactPhone": "123-456-7892",
    "contactEmail": "hr@updatedtech.com"
}'

# Use the extracted company ID for updates
run_test "Update company" "PUT" "/companies/$COMPANY_ID" "$UPDATE_COMPANY_DATA" "200" "$AUTH_HEADER"

# Test 12: Activate/Deactivate company
run_test "Deactivate company" "PUT" "/companies/$COMPANY_ID/deactivate" "" "200" "$AUTH_HEADER"
run_test "Activate company" "PUT" "/companies/$COMPANY_ID/activate" "" "200" "$AUTH_HEADER"

# Test 13: Export companies
run_test "Export companies" "GET" "/companies/export?industry=Technology" "" "200" "$AUTH_HEADER"

# Test 14: Error cases
echo -e "${YELLOW}Testing Error Cases${NC}"

# Test with invalid data
INVALID_COMPANY_DATA='{
    "companyName": "",
    "email": "invalid-email"
}'

run_test "Create company with invalid data" "POST" "/companies" "$INVALID_COMPANY_DATA" "400" "$AUTH_HEADER"

# Test unauthorized access
run_test "Unauthorized access" "POST" "/companies" "$COMPANY_DATA" "401" ""

# Test non-existent company
run_test "Get non-existent company" "GET" "/companies/99999" "" "404" "$AUTH_HEADER"

# Test 15: Clean up - Delete company
run_test "Delete company" "DELETE" "/companies/$COMPANY_ID" "" "204" "$AUTH_HEADER"

# Final Results
echo ""
echo -e "${YELLOW}Test Results${NC}"
echo "============="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$((TOTAL_TESTS - PASSED_TESTS))${NC}"

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    echo -e "${GREEN}All tests passed! 🎉${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please check the API implementation.${NC}"
    exit 1
fi