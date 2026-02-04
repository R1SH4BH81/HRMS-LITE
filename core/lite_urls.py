from django.urls import path
from . import lite_views, api_views

app_name = 'lite'

urlpatterns = [
    # Main HRMS Lite interface
    path('', lite_views.hrms_lite_home, name='home'),
    
    # API endpoints
    path('api/employees/', api_views.employee_list, name='api_employee_list'),
    path('api/employees/<str:employee_id>/', api_views.employee_detail, name='api_employee_detail'),
    path('api/attendance/', api_views.attendance_list, name='api_attendance_list'),
    path('api/attendance/<int:attendance_id>/', api_views.attendance_detail, name='api_attendance_detail'),
    path('api/employees/<str:employee_id>/attendance-summary/', api_views.employee_attendance_summary, name='api_employee_attendance_summary'),
]