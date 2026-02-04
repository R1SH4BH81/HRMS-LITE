#!/bin/bash
# GitHub Repository Setup Script for HRMS Lite
# This script helps set up the GitHub repository for deployment

echo "🚀 HRMS Lite - GitHub Repository Setup"
echo "========================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.env
.venv

# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
frontend/build/
frontend/.env

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Database
*.db
*.sqlite

# Temporary files
tmp/
temp/
EOF
fi

# Check if remote repository exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "Remote repository already configured: $(git remote get-url origin)"
else
    echo "Please create a GitHub repository first and then run:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git"
    echo "Then run this script again."
    exit 1
fi

# Add all files
echo "Adding files to repository..."
git add .

# Initial commit
if [ -z "$(git status --porcelain)" ]; then
    echo "No changes to commit."
else
    echo "Creating initial commit..."
    git commit -m "Initial commit: HRMS Lite - Full-stack HR Management System

🎯 Features:
- FastAPI backend with MongoDB integration
- React frontend with modern design
- Employee management (CRUD operations)
- Attendance tracking system
- Deletion confirmation modals
- Professional color palette (0C2C55, 296374, 629FAD, EDEDCE)
- Production-ready deployment configuration

🛠️ Tech Stack:
- Backend: FastAPI, Pydantic, PyMongo
- Frontend: React 18, Axios
- Database: MongoDB Atlas
- Deployment: Render (backend), Vercel (frontend)

📁 Structure:
- /backend - FastAPI application
- /frontend - React application
- /deployment - Configuration files
- Comprehensive documentation and testing"
fi

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

echo "✅ Repository setup complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Set up MongoDB Atlas (see DEPLOYMENT_GUIDE.md)"
echo "2. Deploy backend to Render"
echo "3. Deploy frontend to Vercel"
echo "4. Update vercel.json with your actual backend URL"
echo ""
echo "📚 Documentation:"
echo "- README.md - Project overview and setup"
echo "- DEPLOYMENT_GUIDE.md - Complete deployment instructions"
echo "- render.yaml - Render deployment configuration"
echo "- vercel.json - Vercel deployment configuration"