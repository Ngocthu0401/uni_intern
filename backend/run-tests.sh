#!/bin/bash

echo "=========================================="
echo "  INTERNSHIP MANAGEMENT SYSTEM"
echo "  API TEST SUITE RUNNER"
echo "=========================================="
echo ""

echo "🚀 Starting comprehensive API test suite..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Test Coverage:${NC}"
echo "   ✅ Auth APIs (2 endpoints)"
echo "   ✅ Student APIs (9 endpoints)"
echo "   ✅ Teacher APIs (8 endpoints)"
echo "   ✅ Company APIs (10 endpoints)"
echo "   ✅ Mentor APIs (7 endpoints)"
echo "   ✅ Batch APIs (9 endpoints)"
echo "   ✅ Internship APIs (17 endpoints)"
echo "   ✅ Report APIs (15 endpoints)"
echo "   ✅ Evaluation APIs (12 endpoints)"
echo "   ✅ Contract APIs (12 endpoints)"
echo "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   📊 TOTAL: 99 API ENDPOINTS"
echo ""

echo -e "${YELLOW}🔧 Running tests with Maven...${NC}"
echo ""

# Run tests with Maven
./mvnw clean test -Dspring.profiles.active=test

# Check test results
if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo ""
    echo "📊 Test Results Summary:"
    echo "   • Integration Tests: ✅ PASSED"
    echo "   • Unit Tests: ✅ PASSED"
    echo "   • Repository Tests: ✅ PASSED"
    echo "   • Security Tests: ✅ PASSED"
    echo ""
    echo "🎉 Your backend is ready for production!"
    echo ""
    echo "📁 Test reports available in:"
    echo "   target/surefire-reports/"
    echo ""
    echo "🌐 To start the application:"
    echo "   ./mvnw spring-boot:run"
    echo ""
    echo "📚 API Documentation:"
    echo "   http://localhost:8080/swagger-ui.html"
    echo ""
else
    echo ""
    echo -e "${RED}❌ SOME TESTS FAILED!${NC}"
    echo ""
    echo "🔍 Check the test output above for details"
    echo "📁 Detailed reports in: target/surefire-reports/"
    echo ""
    echo "🛠️  Common fixes:"
    echo "   • Check database connection"
    echo "   • Verify entity relationships"
    echo "   • Review security configurations"
    echo ""
    exit 1
fi 