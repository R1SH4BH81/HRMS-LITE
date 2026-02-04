from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from pymongo import MongoClient
from bson import ObjectId
from typing import List, Optional
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="HRMS Lite API",
    description="Human Resource Management System Lite",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://hrms-lite-git-main-r1sh4bh81s-projects.vercel.app",
        "https://hrms-lite-9cb9.vercel.app",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGODB_URI)
db = client["hrms_lite"]
employees_collection = db["employees"]
attendance_collection = db["attendance"]

# Create indexes
try:
    employees_collection.create_index("employeeId", unique=True)
    employees_collection.create_index("email", unique=True)
    attendance_collection.create_index([("employeeId", 1), ("date", 1)], unique=True)
except Exception as e:
    print(f"Error creating indexes: {e}")

# Pydantic models
class EmployeeCreate(BaseModel):
    employeeId: str = Field(..., min_length=1)
    fullName: str = Field(..., min_length=1)
    email: EmailStr
    department: str = Field(..., min_length=1)

class EmployeeResponse(BaseModel):
    id: str
    employeeId: str
    fullName: str
    email: str
    department: str
    createdAt: datetime

class AttendanceCreate(BaseModel):
    employeeId: str
    date: str
    status: str = Field(..., pattern="^(Present|Absent)$")

class AttendanceResponse(BaseModel):
    id: str
    employeeId: str
    employeeName: Optional[str]
    date: str
    status: str
    createdAt: datetime

# Helper functions
def employee_helper(employee) -> dict:
    return {
        "id": str(employee["_id"]),
        "employeeId": employee["employeeId"],
        "fullName": employee["fullName"],
        "email": employee["email"],
        "department": employee["department"],
        "createdAt": employee["createdAt"]
    }

def attendance_helper(attendance) -> dict:
    return {
        "id": str(attendance["_id"]),
        "employeeId": attendance["employeeId"],
        "employeeName": attendance.get("employeeName"),
        "date": attendance["date"],
        "status": attendance["status"],
        "createdAt": attendance["createdAt"]
    }

# Routes
@app.get("/api/employees", response_model=List[EmployeeResponse])
async def get_employees():
    employees = list(employees_collection.find())
    return [employee_helper(emp) for emp in employees]

@app.post("/api/employees", response_model=EmployeeResponse)
async def create_employee(employee: EmployeeCreate):
    if employees_collection.find_one({"employeeId": employee.employeeId}):
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    if employees_collection.find_one({"email": employee.email}):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    employee_dict = employee.dict()
    employee_dict["createdAt"] = datetime.utcnow()
    result = employees_collection.insert_one(employee_dict)
    created_employee = employees_collection.find_one({"_id": result.inserted_id})
    return employee_helper(created_employee)

@app.delete("/api/employees/{employee_id}")
async def delete_employee(employee_id: str):
    try:
        obj_id = ObjectId(employee_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid employee ID format")
    result = employees_collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}

@app.get("/api/attendance", response_model=List[AttendanceResponse])
async def get_attendance():
    attendance = list(attendance_collection.find())
    for record in attendance:
        employee = employees_collection.find_one({"employeeId": record["employeeId"]})
        if employee:
            record["employeeName"] = employee["fullName"]
    return [attendance_helper(att) for att in attendance]

@app.post("/api/attendance", response_model=AttendanceResponse)
async def create_attendance(attendance: AttendanceCreate):
    employee = employees_collection.find_one({"employeeId": attendance.employeeId})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    existing = attendance_collection.find_one({
        "employeeId": attendance.employeeId,
        "date": attendance.date
    })
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this employee on this date")
    
    attendance_dict = attendance.dict()
    attendance_dict["employeeName"] = employee["fullName"]
    attendance_dict["createdAt"] = datetime.utcnow()
    result = attendance_collection.insert_one(attendance_dict)
    created_attendance = attendance_collection.find_one({"_id": result.inserted_id})
    return attendance_helper(created_attendance)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/")
async def root():
    return {"message": "HRMS API is running"}
