from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models_lite import LiteEmployee, LiteAttendance
from .serializers import EmployeeSerializer, AttendanceSerializer

# Employee API Views
@api_view(['GET', 'POST'])
def employee_list(request):
    """
    GET: Get all employees
    POST: Create a new employee
    """
    if request.method == 'GET':
        employees = LiteEmployee.objects.all().order_by('-created_at')
        serializer = EmployeeSerializer(employees, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    elif request.method == 'POST':
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Employee created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'status': 'error',
            'message': 'Validation error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def employee_detail(request, employee_id):
    """
    GET: Get employee details
    PUT: Update employee
    DELETE: Delete employee
    """
    try:
        employee = LiteEmployee.objects.get(employee_id=employee_id)
    except LiteEmployee.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Employee not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = EmployeeSerializer(employee)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    elif request.method == 'PUT':
        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Employee updated successfully',
                'data': serializer.data
            })
        
        return Response({
            'status': 'error',
            'message': 'Validation error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        employee.delete()
        return Response({
            'status': 'success',
            'message': 'Employee deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

# Attendance API Views
@api_view(['GET', 'POST'])
def attendance_list(request):
    """
    GET: Get all attendance records (with optional date filtering)
    POST: Create a new attendance record
    """
    if request.method == 'GET':
        queryset = LiteAttendance.objects.all().order_by('-date')
        
        # Filter by employee if provided
        employee_id = request.query_params.get('employee_id')
        if employee_id:
            queryset = queryset.filter(employee__employee_id=employee_id)
        
        # Filter by date range if provided
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if start_date and end_date:
            queryset = queryset.filter(date__range=[start_date, end_date])
        
        serializer = AttendanceSerializer(queryset, many=True)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    elif request.method == 'POST':
        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Attendance record created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'status': 'error',
            'message': 'Validation error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def attendance_detail(request, attendance_id):
    """
    GET: Get attendance record details
    PUT: Update attendance record
    DELETE: Delete attendance record
    """
    try:
        attendance = LiteAttendance.objects.get(id=attendance_id)
    except LiteAttendance.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Attendance record not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = AttendanceSerializer(attendance)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
    
    elif request.method == 'PUT':
        serializer = AttendanceSerializer(attendance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Attendance record updated successfully',
                'data': serializer.data
            })
        
        return Response({
            'status': 'error',
            'message': 'Validation error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        attendance.delete()
        return Response({
            'status': 'success',
            'message': 'Attendance record deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

# Additional API Views
@api_view(['GET'])
def employee_attendance_summary(request, employee_id):
    """
    Get attendance summary for a specific employee
    """
    try:
        employee = LiteEmployee.objects.get(employee_id=employee_id)
    except LiteEmployee.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Employee not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    attendance_records = LiteAttendance.objects.filter(employee=employee).order_by('-date')
    total_present = attendance_records.filter(status='Present').count()
    total_absent = attendance_records.filter(status='Absent').count()
    total_days = attendance_records.count()
    
    serializer = AttendanceSerializer(attendance_records, many=True)
    
    return Response({
        'status': 'success',
        'data': {
            'employee': EmployeeSerializer(employee).data,
            'attendance_records': serializer.data,
            'summary': {
                'total_days': total_days,
                'total_present': total_present,
                'total_absent': total_absent,
                'attendance_rate': (total_present / total_days * 100) if total_days > 0 else 0
            }
        }
    })