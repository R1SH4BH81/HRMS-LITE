from rest_framework import serializers
from .models_lite import LiteEmployee, LiteAttendance

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiteEmployee
        fields = ['employee_id', 'full_name', 'email', 'department', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_email(self, value):
        # Check if email already exists for a different employee
        if LiteEmployee.objects.filter(email=value).exists() and not (self.instance and self.instance.email == value):
            raise serializers.ValidationError("An employee with this email already exists.")
        return value

    def validate_employee_id(self, value):
        # Check if employee_id already exists for a different employee
        if LiteEmployee.objects.filter(employee_id=value).exists() and not (self.instance and self.instance.employee_id == value):
            raise serializers.ValidationError("An employee with this ID already exists.")
        return value

class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    employee_id = serializers.CharField(source='employee.employee_id', read_only=True)
    
    class Meta:
        model = LiteAttendance
        fields = ['id', 'employee', 'employee_id', 'employee_name', 'date', 'status', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        # Check if attendance record already exists for this employee and date
        employee = data.get('employee')
        date = data.get('date')
        
        if employee and date:
            existing_attendance = LiteAttendance.objects.filter(employee=employee, date=date)
            if self.instance:
                existing_attendance = existing_attendance.exclude(id=self.instance.id)
            
            if existing_attendance.exists():
                raise serializers.ValidationError("Attendance record already exists for this employee on this date.")
        
        return data