import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_api():
    print("Testing FastAPI HRMS Backend...")
    
    # Test GET employees
    print("\n1. Testing GET /api/employees")
    try:
        response = requests.get(f"{BASE_URL}/employees")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} employees")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test POST employee
    print("\n2. Testing POST /api/employees")
    try:
        employee_data = {
            "employeeId": "EMP001",
            "fullName": "John Doe",
            "email": "john.doe@company.com",
            "department": "Engineering"
        }
        response = requests.post(f"{BASE_URL}/employees", json=employee_data)
        print(f"Status: {response.status_code}")
        if response.status_code == 201:
            print("Employee created successfully!")
            created_employee = response.json()
            print(f"Created: {created_employee}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test GET attendance
    print("\n3. Testing GET /api/attendance")
    try:
        response = requests.get(f"{BASE_URL}/attendance")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Found {len(data)} attendance records")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()