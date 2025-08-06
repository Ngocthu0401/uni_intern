#!/bin/bash

echo "Creating student record for user ID 3..."

BASE_URL="http://localhost:8080/api"

# Login as admin to get JWT token
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "Failed to get authentication token"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

echo "Authentication successful"

# Create student record for user ID 3
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/students" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "id": 3
    },
    "studentCode": "SV2024003",
    "className": "CNTT-K21",
    "major": "Công nghệ Thông tin",
    "academicYear": "2024-2025",
    "gpa": 3.5,
    "status": "ACTIVE"
  }')

echo "Create Student Response:"
echo $CREATE_RESPONSE | jq -r '.'

echo "Student record created for user ID 3"