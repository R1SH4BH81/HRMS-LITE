from django.urls import path
from . import api_views

app_name = 'hrms_lite_api'

urlpatterns = [
    # Employee endpoints
    path('employees/', api_views.employee_list, name='employee_list'),
    path('employees/<str:employee_id>/', api_views.employee_detail, name='employee_detail'),
    
    # Attendance endpoints
    path('attendance/', api_views.attendance_list, name='attendance_list'),
    path('attendance/<int:attendance_id>/', api_views.attendance_detail, name='attendance_detail'),
    
    # Additional endpoints
    path('employees/<str:employee_id>/attendance-summary/', api_views.employee_attendance_summary, name='employee_attendance_summary'),
]