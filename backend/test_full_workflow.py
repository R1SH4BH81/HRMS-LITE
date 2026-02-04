import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5000/api"

def test_full_workflow():
    print("Testing Complete HRMS Lite Workflow...")
    
    # Step 1: Create an employee
    print("\n1. Creating test employee...")
    employee_data = {
        "employeeId": "TEST001",
        "fullName": "Alice Johnson",
        "email": "alice.johnson@company.com",
        "department": "Marketing"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/employees", json=employee_data)
        print(f"Employee creation status: {response.status_code}")
        if response.status_code == 201:
            created_employee = response.json()
            print(f"✓ Created employee: {created_employee['fullName']} (ID: {created_employee['employeeId']})")
            employee_id = created_employee['employeeId']
        else:
            print(f"✗ Failed to create employee: Status {response.status_code}")
            return
    except Exception as e:
        print(f"✗ Error creating employee: {e}")
        return
    
    # Step 2: List all employees
    print("\n2. Listing all employees...")
    try:
        response = requests.get(f"{BASE_URL}/employees")
        if response.status_code == 200:
            employees = response.json()
            print(f"✓ Found {len(employees)} employees")
            for emp in employees:
                print(f"  - {emp['fullName']} ({emp['department']})")
        else:
            print(f"✗ Failed to fetch employees: {response.text}")
    except Exception as e:
        print(f"✗ Error fetching employees: {e}")
    
    # Step 3: Mark attendance
    print("\n3. Marking attendance...")
    attendance_data = {
        "employeeId": employee_id,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "status": "Present"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/attendance", json=attendance_data)
        print(f"Attendance marking status: {response.status_code}")
        if response.status_code == 200:
            print("✓ Attendance marked successfully!")
        else:
            print(f"✗ Failed to mark attendance: {response.text}")
    except Exception as e:
        print(f"✗ Error marking attendance: {e}")
    
    # Step 4: List attendance records
    print("\n4. Listing attendance records...")
    try:
        response = requests.get(f"{BASE_URL}/attendance")
        if response.status_code == 200:
            attendance = response.json()
            print(f"✓ Found {len(attendance)} attendance records")
            for record in attendance:
                print(f"  - {record['employeeId']['fullName']}: {record['status']} on {record['date']}")
        else:
            print(f"✗ Failed to fetch attendance: {response.text}")
    except Exception as e:
        print(f"✗ Error fetching attendance: {e}")
    
    # Step 5: Delete employee
    print("\n5. Testing employee deletion...")
    try:
        # Get the employee ID from the database
        response = requests.get(f"{BASE_URL}/employees")
        if response.status_code == 200:
            employees = response.json()
            if employees:
                employee_to_delete = employees[0]
                delete_response = requests.delete(f"{BASE_URL}/employees/{employee_to_delete['_id']}")
                print(f"Employee deletion status: {delete_response.status_code}")
                if delete_response.status_code == 200:
                    print(f"✓ Deleted employee: {employee_to_delete['fullName']}")
                else:
                    print(f"✗ Failed to delete employee: {delete_response.text}")
            else:
                print("✗ No employees found to delete")
        else:
            print(f"✗ Failed to fetch employees for deletion: {response.text}")
    except Exception as e:
        print(f"✗ Error deleting employee: {e}")
    
    print("\n✅ Workflow testing completed!")

if __name__ == "__main__":
    test_full_workflow()