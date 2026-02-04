from django.contrib import admin

from core.models import User, Employer, Employee, Asset, AssignedAsset
from .models_lite import LiteEmployee, LiteAttendance

# Original models (keeping for compatibility)
admin.site.register(User)
admin.site.register(Employer)
admin.site.register(Employee)
admin.site.register(Asset)
admin.site.register(AssignedAsset)

# Lite models for HRMS Lite
@admin.register(LiteEmployee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'full_name', 'email', 'department', 'created_at']
    search_fields = ['employee_id', 'full_name', 'email', 'department']
    list_filter = ['department', 'created_at']
    ordering = ['full_name']

@admin.register(LiteAttendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['employee', 'date', 'status', 'created_at']
    search_fields = ['employee__full_name', 'employee__employee_id']
    list_filter = ['status', 'date', 'created_at']
    ordering = ['-date']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('employee')