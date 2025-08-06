#!/bin/bash

# Test script for Internship Management API
BASE_URL="http://localhost:8080/api/internships"

echo "=== Testing Internship Management API ==="

# 1. Test GET all internships (should work)
echo "1. Testing GET /internships"
curl -X GET "$BASE_URL?page=0&size=5" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null || echo "Connection failed"

echo -e "\n=================================\n"

# 2. Test GET internship by ID (should work)  
echo "2. Testing GET /internships/1"
curl -X GET "$BASE_URL/1" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null || echo "Connection failed"

echo -e "\n=================================\n"

# 3. Test POST create internship (check validation)
echo "3. Testing POST /internships (CREATE)"
curl -X POST "$BASE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "jobTitle": "Backend Developer Intern",
    "jobDescription": "Develop and maintain backend services",
    "requirements": "Java, Spring Boot knowledge",
    "benefits": "Learning opportunity, mentorship",
    "startDate": "2025-08-01",
    "endDate": "2025-11-01",
    "status": "PENDING"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null || echo "Connection failed"

echo -e "\n=================================\n"

# 4. Test PUT update internship (check validation)
echo "4. Testing PUT /internships/1 (UPDATE)"
curl -X PUT "$BASE_URL/1" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "jobTitle": "Updated Intern Position", 
    "jobDescription": "Updated description",
    "status": "APPROVED"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null || echo "Connection failed"

echo -e "\n=================================\n"

# 5. Test search internships
echo "5. Testing GET /internships/search"
curl -X GET "$BASE_URL/search?keyword=developer&page=0&size=5" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null || echo "Connection failed"

echo -e "\n=================================\n"

# 6. Test approve internship (check if endpoint exists)
echo "6. Testing PUT /internships/1/approve"
curl -X PUT "$BASE_URL/1/approve" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null || echo "Endpoint not found or connection failed"

echo -e "\n=================================\n"

# 7. Test reject internship (check if endpoint exists)
echo "7. Testing PUT /internships/1/reject"
curl -X PUT "$BASE_URL/1/reject" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null || echo "Endpoint not found or connection failed"

echo -e "\n=================================\n"

# 8. Test DELETE internship (check status code)
echo "8. Testing DELETE /internships/999 (non-existent)"
curl -X DELETE "$BASE_URL/999" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n" \
  2>/dev/null || echo "Connection failed"

echo -e "\n=================================\n"

echo "Test completed. Check the HTTP status codes:"
echo "- 200: OK (but should be 201 for CREATE, 204 for DELETE)"
echo "- 201: Created (correct for POST)"
echo "- 204: No Content (correct for DELETE)"
echo "- 400: Bad Request (validation errors)"
echo "- 404: Not Found (missing endpoints or resources)"
echo "- 500: Internal Server Error"