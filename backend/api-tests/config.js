const config = {
    // API Base URL
    baseURL: 'http://localhost:8080/api',
    
    // Test timeout (ms)
    timeout: 10000,
    
    // Test Users (will be created during tests)
    testUsers: {
        department: {
            username: 'test_department',
            password: 'password123',
            email: 'department@test.com',
            fullName: 'Test Department User',
            role: 'DEPARTMENT'
        },
        teacher: {
            username: 'test_teacher', 
            password: 'password123',
            email: 'teacher@test.com',
            fullName: 'Test Teacher User',
            role: 'TEACHER'
        },
        student: {
            username: 'test_student',
            password: 'password123', 
            email: 'student@test.com',
            fullName: 'Test Student User',
            role: 'STUDENT'
        },
        mentor: {
            username: 'test_mentor',
            password: 'password123',
            email: 'mentor@test.com', 
            fullName: 'Test Mentor User',
            role: 'MENTOR'
        }
    },
    
    // Test Data Templates
    testData: {
        student: {
            studentCode: 'STU001',
            major: 'Computer Science',
            academicYear: '2023',
            className: 'CS2023A',
            gpa: 3.5,
            address: '123 Test Street',
            parentName: 'Test Parent',
            parentPhone: '0123456789'
        },
        teacher: {
            teacherCode: 'TCH001',
            department: 'Computer Science',
            position: 'Lecturer',
            degree: 'PhD',
            specialization: 'Software Engineering',
            officeLocation: 'Room 101'
        },
        company: {
            companyCode: 'COM001',
            companyName: 'Test Company Ltd',
            industry: 'Technology',
            address: '456 Business Street',
            phoneNumber: '0987654321',
            email: 'info@testcompany.com',
            website: 'https://testcompany.com',
            contactPerson: 'John Doe',
            contactEmail: 'contact@testcompany.com',
            contactPhone: '0111222333',
            contactPosition: 'HR Manager',
            companySize: 'Medium',
            description: 'A test company for internship'
        },
        mentor: {
            position: 'Senior Developer',
            department: 'Engineering',
            specialization: 'Full Stack Development',
            yearsOfExperience: 5,
            officeLocation: 'Floor 2'
        },
        batch: {
            batchCode: 'BATCH001',
            batchName: 'Spring 2024 Internship',
            academicYear: '2024',
            semester: 'Spring',
            maxStudents: 50,
            description: 'Spring 2024 internship batch',
            startDate: '2024-03-01',
            endDate: '2024-06-30',
            registrationStartDate: '2024-02-01',
            registrationEndDate: '2024-02-28'
        },
        internship: {
            internshipCode: 'INT001',
            jobTitle: 'Software Developer Intern',
            jobDescription: 'Develop web applications using modern technologies',
            requirements: 'Basic knowledge of Java, JavaScript',
            benefits: 'Learning opportunities, mentorship',
            salary: 5000000,
            workingHoursPerWeek: 40,
            startDate: '2024-03-01',
            endDate: '2024-06-30',
            notes: 'Remote work available'
        },
        report: {
            title: 'Weekly Report #1',
            content: 'This week I worked on the user authentication module',
            weekNumber: 1,
            achievements: 'Completed login functionality',
            challenges: 'Understanding JWT implementation',
            nextWeekPlan: 'Work on user registration'
        },
        evaluation: {
            evaluationType: 'TEACHER',
            overallScore: 8.5,
            technicalScore: 8.0,
            softSkillScore: 9.0,
            communicationScore: 8.5,
            attitudeScore: 9.0,
            comments: 'Good performance overall',
            strengths: 'Quick learner, proactive',
            weaknesses: 'Needs improvement in documentation',
            recommendations: 'Focus on writing better documentation'
        },
        contract: {
            contractCode: 'CTR001',
            title: 'Internship Contract - Spring 2024',
            content: 'This contract outlines the terms and conditions...',
            termsAndConditions: 'Standard internship terms apply',
            startDate: '2024-03-01',
            endDate: '2024-06-30',
            notes: 'Standard internship contract'
        }
    }
};

module.exports = config; 