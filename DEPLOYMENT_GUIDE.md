# HRMS Lite - Deployment Guide

## 🚀 Production Deployment Options

### Option 1: Heroku Deployment (Recommended)

#### Prerequisites
- Heroku CLI installed
- Git repository initialized
- Heroku account

#### Steps

1. **Initialize Git Repository**
```bash
git init
git add .
git commit -m "Initial HRMS Lite deployment"
```

2. **Create Heroku App**
```bash
heroku create your-hrms-lite-app-name
```

3. **Configure Environment Variables**
```bash
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secret-key-here
heroku config:set ALLOWED_HOSTS=your-hrms-lite-app-name.herokuapp.com
```

4. **Deploy**
```bash
git push heroku main
```

5. **Run Migrations**
```bash
heroku run python manage.py migrate
```

### Option 2: Railway Deployment

#### Steps
1. Connect your GitHub repository to Railway
2. Deploy automatically when you push to main branch
3. Set environment variables in Railway dashboard

### Option 3: DigitalOcean App Platform

#### Steps
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically

### Option 4: Local Production Setup

#### Using Gunicorn
```bash
# Install production dependencies
pip install -r requirements.txt

# Run with gunicorn
gunicorn hrms.wsgi:application --bind 0.0.0.0:8000
```

#### Using Docker
```dockerfile
# Dockerfile
FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "hrms.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## 🔧 Environment Variables

Set these environment variables in your production environment:

```bash
DEBUG=False
SECRET_KEY=your-very-secret-key-here
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DATABASE_URL=your-production-database-url
```

## 📋 Post-Deployment Checklist

- [ ] Run database migrations
- [ ] Create superuser account
- [ ] Test all API endpoints
- [ ] Verify frontend functionality
- [ ] Check CORS settings for your domain
- [ ] Set up SSL/HTTPS
- [ ] Configure backup strategy

## 🌐 API Endpoints

### Employees
- `GET /api/employees/` - List all employees
- `POST /api/employees/` - Create employee
- `GET /api/employees/{employee_id}/` - Get employee details
- `PUT /api/employees/{employee_id}/` - Update employee
- `DELETE /api/employees/{employee_id}/` - Delete employee

### Attendance
- `GET /api/attendance/` - List attendance records
- `POST /api/attendance/` - Create attendance record
- `GET /api/attendance/{id}/` - Get attendance details
- `PUT /api/attendance/{id}/` - Update attendance
- `DELETE /api/attendance/{id}/` - Delete attendance

### Summary
- `GET /api/employees/{employee_id}/attendance-summary/` - Get employee attendance summary

## 🎯 Features Implemented

✅ Employee CRUD operations
✅ Attendance CRUD operations  
✅ RESTful API endpoints
✅ Professional UI with Bootstrap 5
✅ Loading states, empty states, error handling
✅ Responsive design
✅ No authentication required (as per assignment)
✅ Unique constraints for employee ID and email
✅ Daily attendance uniqueness per employee
✅ Admin interface for data management

## 🚀 Quick Start

1. **Access the application**: Open your deployed URL
2. **Add employees**: Use the "Add Employee" button
3. **Mark attendance**: Use the "Mark Attendance" button
4. **View reports**: Check the attendance summary
5. **Admin panel**: Access `/admin/` for advanced management

## 📞 Support

The application is ready for production use. All assignment requirements have been met:
- ✅ CRUD operations for employees and attendance
- ✅ RESTful API implementation
- ✅ Professional UI with required states
- ✅ Deployment-ready configuration