from django.shortcuts import render

def hrms_lite_home(request):
    """Simple home view for HRMS Lite - no authentication required"""
    return render(request, 'core/hrms_lite.html')