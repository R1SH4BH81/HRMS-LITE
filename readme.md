# HRMS Lite - Human Resource Management System

A lightweight, full-stack Human Resource Management System built with FastAPI (Python) and React.js.

## 🚀 Features

- **Employee Management**: Create, read, update, and delete employee records
- **Attendance Tracking**: Mark and view employee attendance records
- **Modern UI**: Clean, responsive design with custom color palette
- **Confirmation Modal**: User-friendly confirmation overlay for deletions
- **Data Validation**: Comprehensive input validation on both frontend and backend
- **Database Persistence**: MongoDB integration with proper indexing
- **RESTful APIs**: Well-structured API endpoints with proper HTTP status codes

## 🛠️ Tech Stack

### Backend

- **FastAPI** - Modern, fast Python web framework
- **Pydantic** - Data validation using Python type annotations
- **MongoDB** - NoSQL database with pymongo driver
- **CORS** - Cross-origin resource sharing support

### Frontend

- **React.js** - Modern JavaScript library for building user interfaces
- **Axios** - Promise-based HTTP client for API calls
- **CSS3** - Modern styling with custom properties

### Deployment

- **Render** - Backend hosting (FastAPI)
- **Vercel** - Frontend hosting (React)
- **MongoDB Atlas** - Cloud database hosting

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB Atlas account (for production)
- Git

## 🏃‍♂️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hrms-lite.git
cd hrms-lite
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the backend directory:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms-lite?retryWrites=true&w=majority
PORT=5000
```

Start the backend server:

```bash
uvicorn main:app --reload
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🔧 API Endpoints

### Employees

- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `DELETE /api/employees/{id}` - Delete employee

### Attendance

- `GET /api/attendance` - Get all attendance records
- `POST /api/attendance` - Mark attendance

## 🎨 Color Palette

The application uses a modern color scheme:

- **Primary**: `#0C2C55` (Deep Navy)
- **Secondary**: `#296374` (Teal)
- **Accent**: `#629FAD` (Light Blue)
- **Background**: `#EDEDCE` (Cream)

## 🧪 Testing

### Backend Tests

```bash
cd backend
python test_api.py
python test_complete_workflow.py
```

### Frontend Tests

The frontend includes manual testing capabilities through the UI.

## 🚀 Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && pip install -r requirements.txt`
4. Set start command: `cd backend && uvicorn main_prod:app --host 0.0.0.0 --port $PORT`
5. Add environment variables: `MONGODB_URI`, `PORT=10000`

### Frontend (Vercel)

1. Create a new project on Vercel
2. Import your GitHub repository
3. Set framework to React
4. Set build command: `cd frontend && npm run build`
5. Set output directory: `frontend/build`

### Database (MongoDB Atlas)

1. Create a free cluster
2. Create a database user with read/write permissions
3. Whitelist your IP address (or 0.0.0.0/0 for testing)
4. Get your connection string

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── main_prod.py         # Production server
│   ├── requirements.txt     # Python dependencies
│   ├── test_*.py             # Test scripts
│   └── .env                  # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   ├── App.css          # Styling with color palette
│   │   └── index.js         # React entry point
│   ├── public/
│   ├── package.json         # Node.js dependencies
│   └── build/               # Production build
├── render.yaml              # Render deployment config
├── vercel.json              # Vercel deployment config
└── README.md               # This file
```

## 🔒 Security Features

- Input validation on both frontend and backend
- Unique constraints for employee ID and email
- Proper error handling and status codes
- CORS configuration for secure cross-origin requests

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FastAPI for the excellent Python web framework
- React.js for the powerful frontend library
- MongoDB for the flexible NoSQL database
- Render and Vercel for providing excellent hosting services

---

**Live Demo**: [Your deployed app URL will be here]
**Backend API**: [Your deployed backend URL will be here]

Built with ❤️ for the HRMS Lite assignment.
