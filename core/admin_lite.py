from django.contrib import admin
from .models_lite import Employee, Attendance

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'full_name', 'email', 'department', 'created_at']
    search_fields = ['employee_id', 'full_name', 'email', 'department']
    list_filter = ['department', 'created_at']
    ordering = ['full_name']

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'date', 'status', 'created_at']
    search_fields = ['employee__full_name', 'employee__employee_id']
    list_filter = ['status', 'date', 'created_at']
    ordering = ['-date']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('employee')