#!/bin/bash

echo "========================================"
echo "DEMO DATA SETUP SCRIPT FOR INTERNSHIP MANAGEMENT SYSTEM"
echo "========================================"
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "ERROR: MySQL is not installed or not in PATH"
    echo "Please install MySQL and add it to your PATH environment variable"
    exit 1
fi

echo "MySQL found. Starting demo data setup..."
echo ""

# Check if database exists
if ! mysql -u root -e "USE internship_management; SELECT 1;" &> /dev/null; then
    echo "ERROR: Database 'internship_management' not found"
    echo "Please make sure the database exists and is accessible"
    echo "You can create it with: CREATE DATABASE internship_management;"
    exit 1
fi

echo "Database connection successful."
echo ""

# Create backup of current data (optional)
backup_file="backup_before_demo_$(date +%Y%m%d_%H%M%S).sql"
echo "Creating backup of current data..."
if mysqldump -u root internship_management > "$backup_file" 2>/dev/null; then
    echo "Backup created: $backup_file"
else
    echo "Warning: Could not create backup file"
fi
echo ""

# Execute demo data script
echo "Executing demo data generation script..."
echo "This may take a few minutes..."
echo ""

if mysql -u root internship_management < generate_demo_data.sql; then
    echo ""
    echo "========================================"
    echo "SUCCESS: Demo data has been generated successfully!"
    echo "========================================"
    echo ""
    echo "Demo data includes:"
    echo "- Users: Department, Teachers, Students, Mentors"
    echo "- Companies: FPT, VNG, TMA, STU, BKAV, Timo"
    echo "- Internship Batches: Current and past semesters"
    echo "- Internships: Active and completed internships"
    echo "- Reports: Weekly and final reports"
    echo "- Evaluations: Teacher and mentor evaluations"
    echo "- Contracts: Support contracts with payment details"
    echo "- Tasks: Work assignments and progress tracking"
    echo "- Progress Records: Weekly internship progress"
    echo ""
    echo "Login credentials for testing:"
    echo "- Department: department_admin / password123"
    echo "- Teacher: gv_nguyen_van_a / password123"
    echo "- Student: sv_19520001 / password123"
    echo "- Mentor: mentor_fpt_01 / password123"
    echo ""
    echo "You can now start the backend server and test the system!"
    echo "Backend: cd backend && mvn spring-boot:run"
    echo "Frontend: cd frontend && npm start"
else
    echo ""
    echo "========================================"
    echo "ERROR: Failed to generate demo data"
    echo "========================================"
    echo "Please check the error messages above and try again."
    if [ -f "$backup_file" ]; then
        echo ""
        echo "To restore your previous data:"
        echo "mysql -u root internship_management < $backup_file"
    fi
fi

echo ""