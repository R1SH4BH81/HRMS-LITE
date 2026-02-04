// API Configuration
const API_BASE_URL = '/api/';

// Global state
let employees = [];
let attendance = [];

// Utility functions
function showLoading(elementId) {
    document.getElementById(elementId + '-loading').style.display = 'block';
    document.getElementById(elementId + '-empty').style.display = 'none';
    document.getElementById(elementId + '-error').style.display = 'none';
    document.getElementById(elementId + '-list').style.display = 'none';
}

function hideLoading(elementId) {
    document.getElementById(elementId + '-loading').style.display = 'none';
}

function showError(elementId, message) {
    document.getElementById(elementId + '-error').style.display = 'block';
    document.getElementById(elementId + '-error-message').textContent = message;
    document.getElementById(elementId + '-empty').style.display = 'none';
    document.getElementById(elementId + '-list').style.display = 'none';
}

function showEmpty(elementId) {
    document.getElementById(elementId + '-empty').style.display = 'block';
    document.getElementById(elementId + '-error').style.display = 'none';
    document.getElementById(elementId + '-list').style.display = 'none';
}

function showContent(elementId) {
    document.getElementById(elementId + '-list').style.display = 'block';
    document.getElementById(elementId + '-empty').style.display = 'none';
    document.getElementById(elementId + '-error').style.display = 'none';
}

// API Functions
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(API_BASE_URL + endpoint, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Navigation Functions
function showSection(sectionId) {
    // Hide all sections
    document.getElementById('employees-section').style.display = 'none';
    document.getElementById('attendance-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'none';
    
    // Show selected section
    document.getElementById(sectionId).style.display = 'block';
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
}

function showEmployees() {
    showSection('employees-section');
    loadEmployees();
}

function showAttendance() {
    showSection('attendance-section');
    loadAttendance();
}

function showDashboard() {
    showSection('dashboard-section');
    loadDashboard();
}

// Employee Functions
async function loadEmployees() {
    showLoading('employees');
    
    try {
        const response = await apiRequest('employees/');
        employees = response.data;
        
        if (employees.length === 0) {
            showEmpty('employees');
        } else {
            displayEmployees();
            showContent('employees');
        }
    } catch (error) {
        showError('employees', error.message);
    }
}

function displayEmployees() {
    const container = document.getElementById('employees-list');
    container.innerHTML = '';
    
    employees.forEach(employee => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        card.innerHTML = `
            <div class="card employee-card">
                <div class="card-body">
                    <h5 class="card-title">${employee.full_name}</h5>
                    <p class="card-text">
                        <strong>ID:</strong> ${employee.employee_id}<br>
                        <strong>Email:</strong> ${employee.email}<br>
                        <strong>Department:</strong> ${employee.department}
                    </p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewEmployeeAttendance('${employee.employee_id}')">
                            <i class="fas fa-calendar"></i> Attendance
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteEmployee('${employee.employee_id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function showAddEmployeeModal() {
    const modal = new bootstrap.Modal(document.getElementById('addEmployeeModal'));
    modal.show();
}

async function addEmployee() {
    const form = document.getElementById('add-employee-form');
    const formData = new FormData(form);
    
    const employeeData = {
        employee_id: document.getElementById('employee-id').value,
        full_name: document.getElementById('full-name').value,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value
    };
    
    try {
        await apiRequest('employees/', 'POST', employeeData);
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal')).hide();
        
        // Reset form
        form.reset();
        
        // Reload employees
        loadEmployees();
        
        // Show success message
        alert('Employee added successfully!');
    } catch (error) {
        alert('Error adding employee: ' + error.message);
    }
}

async function deleteEmployee(employeeId) {
    if (!confirm('Are you sure you want to delete this employee?')) {
        return;
    }
    
    try {
        await apiRequest(`employees/${employeeId}/`, 'DELETE');
        loadEmployees();
        alert('Employee deleted successfully!');
    } catch (error) {
        alert('Error deleting employee: ' + error.message);
    }
}

// Attendance Functions
async function loadAttendance() {
    showLoading('attendance');
    
    try {
        const response = await apiRequest('attendance/');
        attendance = response.data;
        
        // Update employee dropdowns
        updateEmployeeDropdowns();
        
        if (attendance.length === 0) {
            showEmpty('attendance');
        } else {
            displayAttendance();
            showContent('attendance');
        }
    } catch (error) {
        showError('attendance', error.message);
    }
}

function updateEmployeeDropdowns() {
    const dropdowns = [
        document.getElementById('attendance-employee'),
        document.getElementById('attendance-employee-filter')
    ];
    
    dropdowns.forEach(dropdown => {
        // Keep the first option (placeholder)
        const placeholder = dropdown.options[0];
        dropdown.innerHTML = '';
        dropdown.appendChild(placeholder);
        
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.employee_id;
            option.textContent = `${employee.full_name} (${employee.employee_id})`;
            dropdown.appendChild(option);
        });
    });
}

function displayAttendance() {
    const container = document.getElementById('attendance-list');
    container.innerHTML = '';
    
    if (attendance.length === 0) {
        showEmpty('attendance');
        return;
    }
    
    const table = document.createElement('table');
    table.className = 'table table-striped';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="attendance-tbody"></tbody>
    `;
    
    const tbody = table.querySelector('tbody');
    attendance.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.employee_name}</td>
            <td>${record.employee_id}</td>
            <td>${record.date}</td>
            <td>
                <span class="badge bg-${record.status === 'Present' ? 'success' : 'danger'}">
                    ${record.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteAttendance(${record.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    container.appendChild(table);
}

function showAddAttendanceModal() {
    const modal = new bootstrap.Modal(document.getElementById('addAttendanceModal'));
    
    // Set today's date as default
    document.getElementById('attendance-date').value = new Date().toISOString().split('T')[0];
    
    modal.show();
}

async function addAttendance() {
    const employeeId = document.getElementById('attendance-employee').value;
    const date = document.getElementById('attendance-date').value;
    const status = document.getElementById('attendance-status').value;
    
    if (!employeeId || !date || !status) {
        alert('Please fill in all fields');
        return;
    }
    
    const attendanceData = {
        employee: employeeId,
        date: date,
        status: status
    };
    
    try {
        await apiRequest('attendance/', 'POST', attendanceData);
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('addAttendanceModal')).hide();
        
        // Reset form
        document.getElementById('add-attendance-form').reset();
        
        // Reload attendance
        loadAttendance();
        
        // Show success message
        alert('Attendance marked successfully!');
    } catch (error) {
        alert('Error marking attendance: ' + error.message);
    }
}

async function deleteAttendance(attendanceId) {
    if (!confirm('Are you sure you want to delete this attendance record?')) {
        return;
    }
    
    try {
        await apiRequest(`attendance/${attendanceId}/`, 'DELETE');
        loadAttendance();
        alert('Attendance record deleted successfully!');
    } catch (error) {
        alert('Error deleting attendance record: ' + error.message);
    }
}

function filterAttendance() {
    const dateFilter = document.getElementById('attendance-date-filter').value;
    const employeeFilter = document.getElementById('attendance-employee-filter').value;
    
    let filtered = attendance;
    
    if (dateFilter) {
        filtered = filtered.filter(record => record.date === dateFilter);
    }
    
    if (employeeFilter) {
        filtered = filtered.filter(record => record.employee_id === employeeFilter);
    }
    
    // Temporarily replace attendance array for display
    const originalAttendance = attendance;
    attendance = filtered;
    displayAttendance();
    attendance = originalAttendance;
}

function resetAttendanceFilters() {
    document.getElementById('attendance-date-filter').value = '';
    document.getElementById('attendance-employee-filter').value = '';
    displayAttendance();
}

async function viewEmployeeAttendance(employeeId) {
    showAttendance();
    document.getElementById('attendance-employee-filter').value = employeeId;
    filterAttendance();
}

// Dashboard Functions
async function loadDashboard() {
    try {
        // Load employees and attendance data
        const employeesResponse = await apiRequest('employees/');
        const attendanceResponse = await apiRequest('attendance/');
        
        const employees = employeesResponse.data;
        const attendance = attendanceResponse.data;
        
        // Update dashboard stats
        document.getElementById('total-employees').textContent = employees.length;
        document.getElementById('total-attendance').textContent = attendance.length;
        
        // Calculate average attendance rate
        if (employees.length > 0 && attendance.length > 0) {
            const presentDays = attendance.filter(record => record.status === 'Present').length;
            const attendanceRate = Math.round((presentDays / attendance.length) * 100);
            document.getElementById('avg-attendance-rate').textContent = attendanceRate + '%';
        } else {
            document.getElementById('avg-attendance-rate').textContent = '0%';
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load employees by default
    showEmployees();
});