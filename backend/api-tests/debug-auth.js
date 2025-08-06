#!/usr/bin/env node

const axios = require('axios');
const colors = require('colors');

const baseURL = 'http://localhost:8080';

async function debugAuth() {
    console.log('🔍 Debugging Spring Boot Authentication'.bold.blue);
    console.log('====================================='.gray);
    
    const testCases = [
        {
            name: 'Test /api/auth/signup (with /api prefix)',
            url: `${baseURL}/api/auth/signup`,
            data: {
                username: 'test',
                email: 'test@example.com',
                password: 'password123',
                fullName: 'Test User',
                role: 'DEPARTMENT'
            }
        },
        {
            name: 'Test /auth/signup (without /api prefix)',
            url: `${baseURL}/auth/signup`,
            data: {
                username: 'test',
                email: 'test@example.com',
                password: 'password123',
                fullName: 'Test User',
                role: 'DEPARTMENT'
            }
        },
        {
            name: 'Test /api/auth/signin (with /api prefix)',
            url: `${baseURL}/api/auth/signin`,
            data: {
                username: 'test',
                password: 'password123'
            }
        },
        {
            name: 'Test /auth/signin (without /api prefix)',
            url: `${baseURL}/auth/signin`,
            data: {
                username: 'test',
                password: 'password123'
            }
        },
        {
            name: 'Test Spring Boot Actuator Health',
            url: `${baseURL}/actuator/health`,
            method: 'GET'
        },
        {
            name: 'Test root endpoint',
            url: `${baseURL}/`,
            method: 'GET'
        }
    ];
    
    for (const testCase of testCases) {
        console.log(`\n🧪 ${testCase.name}`.yellow);
        console.log(`URL: ${testCase.url}`.gray);
        
        try {
            let response;
            
            if (testCase.method === 'GET') {
                response = await axios.get(testCase.url, {
                    timeout: 5000,
                    validateStatus: () => true // Accept all status codes
                });
            } else {
                response = await axios.post(testCase.url, testCase.data, {
                    timeout: 5000,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    validateStatus: () => true // Accept all status codes
                });
            }
            
            console.log(`✅ Status: ${response.status} ${response.statusText}`.green);
            
            if (response.data) {
                if (typeof response.data === 'string') {
                    console.log(`Response: ${response.data.substring(0, 200)}...`.gray);
                } else {
                    console.log(`Response: ${JSON.stringify(response.data, null, 2)}`.gray);
                }
            }
            
            // Analyze the response
            if (response.status === 401) {
                console.log('🚨 PROBLEM: Endpoint requires authentication!'.red);
                console.log('💡 This endpoint should be public for registration/login'.yellow);
            } else if (response.status === 404) {
                console.log('❓ Endpoint not found - check if URL path is correct'.yellow);
            } else if (response.status === 200 || response.status === 201) {
                console.log('✅ SUCCESS: Endpoint is accessible!'.green);
            } else if (response.status === 400) {
                console.log('⚠️  Bad Request - endpoint exists but data format may be wrong'.yellow);
            } else if (response.status === 403) {
                console.log('🚫 Forbidden - endpoint exists but role/permission issue'.yellow);
            }
            
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.log('❌ Connection refused - Spring Boot server not running'.red);
            } else {
                console.log(`❌ Error: ${error.message}`.red);
            }
        }
    }
    
    console.log('\n📋 Summary & Recommendations'.bold.cyan);
    console.log('==============================='.gray);
    console.log('If all auth endpoints return 401:'.white);
    console.log('1. Check Spring Security Configuration'.yellow);
    console.log('2. Ensure /api/auth/** endpoints are permitAll()'.yellow);
    console.log('3. Verify @CrossOrigin annotations'.yellow);
    console.log('4. Check if Spring Security is properly configured'.yellow);
    console.log('\nExpected behavior:'.white);
    console.log('- /api/auth/signup should return 400 (bad request) or 200/201 (success)'.green);
    console.log('- /api/auth/signin should return 400 (bad request) or 200 (success)'.green);
    console.log('- NOT 401 (unauthorized)'.red);
}

// Run debug
debugAuth().catch(error => {
    console.error('💥 Debug failed:'.red, error.message);
    process.exit(1);
}); 