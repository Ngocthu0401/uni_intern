#!/bin/bash

# Test script for the new API: GET /api/students/batch/{batchId}
# This script tests the API that returns students by batch ID

BASE_URL="http://localhost:8080/api"
BATCH_ID="2"  # Using batch ID 2 as mentioned in the error

echo "Testing API: GET /api/students/batch/$BATCH_ID"
echo "================================================"

# Test 1: Get students by batch ID
echo "Test 1: Get students by batch ID $BATCH_ID"
echo "----------------------------------------"
curl -X GET "$BASE_URL/students/batch/$BATCH_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "================================================"

# Test 2: Test with non-existent batch ID
echo "Test 2: Test with non-existent batch ID (999)"
echo "---------------------------------------------"
curl -X GET "$BASE_URL/students/batch/999" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "================================================"

# Test 3: Test without authorization
echo "Test 3: Test without authorization"
echo "---------------------------------"
curl -X GET "$BASE_URL/students/batch/$BATCH_ID" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "================================================"

# Test 4: Test with invalid batch ID format
echo "Test 4: Test with invalid batch ID format (abc)"
echo "------------------------------------------------"
curl -X GET "$BASE_URL/students/batch/abc" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "================================================"
echo "Test completed!"
echo ""
echo "Expected results:"
echo "- Test 1: Should return 200 OK with list of students in batch 2"
echo "- Test 2: Should return 200 OK with empty list (no students in non-existent batch)"
echo "- Test 3: Should return 401 Unauthorized (no token)"
echo "- Test 4: Should return 400 Bad Request (invalid ID format)"
