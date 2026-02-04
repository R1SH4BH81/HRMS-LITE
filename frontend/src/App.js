import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://hrms-lite-9cb9.vercel.app";

function App() {
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    employee: null,
  });

  // Employee form state
  const [employeeForm, setEmployeeForm] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    department: "",
  });

  // Attendance form state
  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/api/employees`);
      setEmployees(response.data);
    } catch (err) {
      setError("Failed to fetch employees");
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/attendance`);
      setAttendance(response.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE_URL}/api/employees`, employeeForm);
      setEmployeeForm({
        employeeId: "",
        fullName: "",
        email: "",
        department: "",
      });
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create employee");
      console.error("Error creating employee:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = (employee) => {
    setDeleteModal({ isOpen: true, employee });
  };

  const confirmDeleteEmployee = async () => {
    if (!deleteModal.employee) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/employees/${deleteModal.employee.id}`,
      );
      fetchEmployees();
      setDeleteModal({ isOpen: false, employee: null });
    } catch (err) {
      setError("Failed to delete employee");
      console.error("Error deleting employee:", err);
      setDeleteModal({ isOpen: false, employee: null });
    }
  };

  const cancelDeleteEmployee = () => {
    setDeleteModal({ isOpen: false, employee: null });
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Check if attendance already exists for this employee and date
    const existingAttendance = attendance.find(
      (record) =>
        record.employeeId === attendanceForm.employeeId &&
        record.date === attendanceForm.date,
    );

    if (existingAttendance) {
      setError(
        `Attendance already marked for this employee on ${new Date(attendanceForm.date).toLocaleDateString()}`,
      );
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/attendance`, attendanceForm);
      setAttendanceForm({
        ...attendanceForm,
        date: new Date().toISOString().split("T")[0],
      });
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark attendance");
      console.error("Error marking attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === "employees" ? "active" : ""}`}
          onClick={() => setActiveTab("employees")}
        >
          Employees
        </button>
        <button
          className={`nav-tab ${activeTab === "attendance" ? "active" : ""}`}
          onClick={() => setActiveTab("attendance")}
        >
          Attendance
        </button>
      </nav>

      {error && (
        <div className="error-message">
          {error}
          <button className="close-btn" onClick={() => setError("")}>
            ×
          </button>
        </div>
      )}

      <main className="main-content">
        {activeTab === "employees" && (
          <div className="tab-content">
            <div className="form-section">
              <h2>Add New Employee</h2>
              <form onSubmit={handleEmployeeSubmit} className="employee-form">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Employee ID"
                    value={employeeForm.employeeId}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        employeeId: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={employeeForm.fullName}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        fullName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={employeeForm.email}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Department"
                    value={employeeForm.department}
                    onChange={(e) =>
                      setEmployeeForm({
                        ...employeeForm,
                        department: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? "Adding..." : "Add Employee"}
                </button>
              </form>
            </div>

            <div className="list-section">
              <h2>Employee List</h2>
              {loading ? (
                <div className="loading">Loading employees...</div>
              ) : employees.length === 0 ? (
                <div className="empty-state">
                  <p>No employees found. Add your first employee above.</p>
                </div>
              ) : (
                <div className="employee-grid">
                  {employees.map((employee) => (
                    <div key={employee.id} className="employee-card">
                      <div className="employee-info">
                        <h3>{employee.fullName}</h3>
                        <p>
                          <strong>ID:</strong> {employee.employeeId}
                        </p>
                        <p>
                          <strong>Email:</strong> {employee.email}
                        </p>
                        <p>
                          <strong>Department:</strong> {employee.department}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteEmployee(employee)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="tab-content">
            <div className="form-section">
              <h2>Mark Attendance</h2>
              <form
                onSubmit={handleAttendanceSubmit}
                className="attendance-form"
              >
                <div className="form-row">
                  <select
                    value={attendanceForm.employeeId}
                    onChange={(e) =>
                      setAttendanceForm({
                        ...attendanceForm,
                        employeeId: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.employeeId}>
                        {employee.fullName} ({employee.employeeId})
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={attendanceForm.date}
                    onChange={(e) =>
                      setAttendanceForm({
                        ...attendanceForm,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-row">
                  <select
                    value={attendanceForm.status}
                    onChange={(e) =>
                      setAttendanceForm({
                        ...attendanceForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                  <button
                    type="submit"
                    disabled={loading}
                    className="submit-btn"
                  >
                    {loading ? "Marking..." : "Mark Attendance"}
                  </button>
                </div>
              </form>
            </div>

            <div className="list-section">
              <h2>Attendance Records</h2>
              {attendance.length === 0 ? (
                <div className="empty-state">
                  <p>No attendance records found. Mark attendance above.</p>
                </div>
              ) : (
                <div className="attendance-list">
                  {attendance.map((record) => {
                    const employee = employees.find(
                      (emp) => emp.employeeId === record.employeeId,
                    );
                    return (
                      <div
                        key={`${record.id}-${record.date}`}
                        className="attendance-item"
                      >
                        <div className="attendance-info">
                          <h4>
                            {employee ? employee.fullName : record.employeeId}
                          </h4>
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Status:</strong>
                            <span
                              className={`status-badge ${record.status.toLowerCase()}`}
                            >
                              {record.status}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="modal-overlay" onClick={cancelDeleteEmployee}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this employee?</p>
            </div>
            <div className="modal-body">
              <div className="employee-details">
                <p>
                  <strong>Name:</strong> {deleteModal.employee?.fullName}
                </p>
                <p>
                  <strong>ID:</strong> {deleteModal.employee?.employeeId}
                </p>
                <p>
                  <strong>Email:</strong> {deleteModal.employee?.email}
                </p>
                <p>
                  <strong>Department:</strong>{" "}
                  {deleteModal.employee?.department}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn cancel"
                onClick={cancelDeleteEmployee}
              >
                Cancel
              </button>
              <button
                className="modal-btn confirm"
                onClick={confirmDeleteEmployee}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
