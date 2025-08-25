#!/bin/bash

# RU-MARKET-MOGUL Environment Setup Script (Simplified)
# This script sets up the Python virtual environment and installs frontend dependencies.
# It does NOT assume any JavaScript configuration in the root directory.

set -e  # Exit immediately on error

echo "🚀 Setting up RU-MARKET-MOGUL environment..."

# --- Check Python installation ---
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo "✅ Python version: $PYTHON_VERSION"

# --- Create virtual environment if missing ---
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
else
    echo "✅ Virtual environment already exists"
fi

# --- Activate virtual environment ---
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# --- Upgrade pip and setuptools ---
echo "⬆️ Upgrading pip and setuptools..."
pip install --upgrade pip setuptools wheel

# --- Install Python dependencies ---
REQ_FILE="requirements.txt"
if [ -f "Back-end/$REQ_FILE" ]; then
    echo "📚 Installing Python dependencies from Back-end/$REQ_FILE..."
    pip install -r Back-end/$REQ_FILE
else
    echo "⚠️ No requirements.txt found. Installing core dependencies individually..."
    pip install Django djangorestframework django-cors-headers
    pip install pandas numpy scikit-learn hmmlearn yfinance
fi

# --- Setup Django database ---
echo "🗄️ Setting up Django database..."
cd Back-end
python manage.py makemigrations
python manage.py migrate
cd ..

# --- Create default Django admin user if missing ---
echo "👤 Checking default Django admin user..."
cd Back-end
python manage.py shell -c "
from django.contrib.auth.models import User;
u = User.objects.filter(username='admin');
print('✅ Admin user already exists' if u else '❌ No admin user found')
" || true
cd ..

# --- Check Node.js installation for frontend ---
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi
echo "✅ Node.js version: $(node -v)"

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi
echo "✅ npm version: $(npm -v)"

# --- Install frontend dependencies ---
FRONTEND_DIR="Front-end/RUMM_Frontend"
if [ -d "$FRONTEND_DIR" ]; then
    echo "🎨 Installing frontend dependencies in $FRONTEND_DIR ..."
    cd $FRONTEND_DIR
    npm install
    cd ../..
else
    echo "⚠️ Frontend directory $FRONTEND_DIR not found. Skipping frontend setup."
fi

echo ""
echo "✅ Environment setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   - Start Django backend: cd Back-end && source ../venv/bin/activate && python manage.py runserver 0.0.0.0:8000"
echo "   - Start Angular frontend: cd Front-end/RUMM_Frontend && npx ng serve --host 0.0.0.0 --port 4200"
echo ""
echo "🌐 The application will be available at:"
echo "   - Backend API: http://localhost:8000"
echo "   - Frontend App: http://localhost:4200"
echo "   - Django Admin: http://localhost:8000/admin"
