# RU-MARKET-MOGUL 🚀

**US Stock and Cryptocurrency markets real-time data display and simulated trade system**

RU Market Mogul provides three prediction services:

* **Daily Prediction** using Volume-Price and Strength Index
* **Weekly Prediction** using MACD trend analysis
* **Yearly Prediction** using Hidden Markov Models

---

## 🏗️ Architecture

* **Frontend**: Angular (Material Design + charting libraries)
* **Backend**: Django REST API with JWT authentication
* **Data Processing**: Python ML models (scikit-learn, HMM, yfinance)
* **Database**: SQLite (dev) 

---

## 📋 Prerequisites

* **Python** 3.8+
* **Node.js** 16+ and npm
* **Git**

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Cesartwothousands/RU-MARKET-MOGUL.git
cd RU-MARKET-MOGUL
```

### 2. Setup environment

```bash
./setup_environment.sh
```

This will:

* Create and activate a Python virtual environment
* Install backend dependencies
* Install frontend dependencies in `Front-end/RUMM_Frontend/`
* Initialize the database and create a default admin user

### 3. Run the project

```bash
./run.sh
```

Services will be available at:

* **Frontend** → [http://localhost:4200](http://localhost:4200)
* **Backend API** → [http://localhost:8000](http://localhost:8000)
* **Django Admin** → [http://localhost:8000/admin](http://localhost:8000/admin) (admin/admin123)

---

## 📁 Project Structure

```
RU-MARKET-MOGUL/
├── Back-end/                  # Django backend
│   ├── RUMM_Backend/          # Django settings
│   ├── predictions/           # ML models
│   └── ...                    
├── Front-end/RUMM_Frontend/   # Angular frontend
├── DataProcessing/            # Jupyter notebooks / training code
├── requirements.txt           # Python dependencies
├── setup_environment.sh       # Environment setup script
└── run.sh                     # Runner script (backend + frontend)
```

---

## 📊 Data Processing

```bash
source venv/bin/activate
cd DataProcessing
jupyter notebook
```

---

## 🔧 Configuration

For production, create a `.env` file in `Back-end/`:

```ini
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost/dbname
ALLOWED_HOSTS=yourdomain.com
```

---

## 🚀 Deployment Notes

1. Use PostgreSQL instead of SQLite
2. Serve Django via Gunicorn/Uvicorn + Nginx
3. Build Angular frontend with `npx ng build --configuration production`
4. Configure reverse proxy for HTTPS

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a pull request

---

## 🆘 Troubleshooting

* **Port conflicts** → free ports 8000/4200 or override with env vars:

  ```bash
  BACKEND_PORT=8001 FRONTEND_PORT=4300 ./run.sh
  ```
* **Python/Node version mismatch** → check with `python3 --version` and `node -v`
* **Clean reinstall** →

  ```bash
  ./setup_environment.sh --clean
  ```

---

## 👨‍💻 Author

**Cesar**

* Email: [cesarchen616@outlook.com](mailto:cesarchen616@outlook.com)
* GitHub: [@Cesartwothousands](https://github.com/Cesartwothousands)

---

✨ Happy Simulated Trading! 📈
