import requests
import json

BASE_URL = "http://localhost:5000/api"

def debug_api():
    print("Debugging FastAPI HRMS Backend...")
    
    # Test GET employees first to see what's working
    print("\n1. Testing GET /api/employees")
    try:
        response = requests.get(f"{BASE_URL}/employees")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Found {len(data)} employees")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test POST employee with detailed debugging
    print("\n2. Testing POST /api/employees with detailed debugging")
    employee_data = {
        "employeeId": "DEBUG001",
        "fullName": "Debug User",
        "email": "debug@company.com",
        "department": "Testing"
    }
    
    print(f"Sending data: {json.dumps(employee_data, indent=2)}")
    
    try:
        response = requests.post(f"{BASE_URL}/employees", json=employee_data)
        print(f"Status: {response.status_code}")
        print(f"Response headers: {response.headers}")
        print(f"Response text: {response.text}")
        
        if response.status_code == 201:
            print("✓ Employee created successfully!")
        else:
            print(f"✗ Failed with status {response.status_code}")
            
    except Exception as e:
        print(f"✗ Error: {e}")

if __name__ == "__main__":
    debug_api()