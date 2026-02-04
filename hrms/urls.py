
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('core.lite_urls')),
    path('api/', include('core.api_urls')),
    path('admin/', admin.site.urls),
]
