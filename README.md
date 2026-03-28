# Chronexa - Task Management Application

A full-stack task management application built with React, TypeScript, Express.js, and PostgreSQL with real-time features and file storage capabilities.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

## 📁 Project Structure

```
Chronexa/
├── client/                  # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context (Auth, Loading)
│   │   ├── api/            # API client functions
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                  # Backend (Express.js + TypeScript)
│   ├── controller/         # Request handlers
│   ├── service/            # Business logic
│   ├── repository/         # Database queries
│   ├── entity/             # TypeORM entities
│   ├── route/              # API routes
│   ├── middleware/         # Express middleware
│   ├── config/             # Configuration files
│   └── server.ts           # Entry point
├── electron/               # Electron app configuration
├── docker-compose.yml      # Docker service definitions
├── package.json            # Root dependencies
└── .env                    # Environment variables
```

## 📦 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Docker & Docker Compose** - [Download](https://www.docker.com/products/docker-desktop)
- **Git** - [Download](https://git-scm.com/)

Verify installations:
```bash
node --version
npm --version
docker --version
docker-compose --version
```

## 🔧 Environment Setup

1. **Create `.env` file** in the root directory:

```bash
cp example-env .env
```

2. **Configure `.env` with your values:**

```env
# Frontend
FRONTEND_URL=http://localhost:5173
FRONTEND_PORT=5173
VITE_BACKEND_URL=http://localhost:3000/api

# Backend
BACKEND_URL=http://localhost:3000
BACKEND_PORT=3000

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=Happyday@
DB_NAME=chronexa
DB_SYNCHRONIZE=true

# JWT Tokens
REFRESH_TOKEN_SECRET=your_refresh_secret_key_here
ACCESS_TOKEN_SECRET=your_access_secret_key_here

# Email (Resend)
RESEND_API_KEY=your_resend_api_key_here
MAIL_FROM=Chronexa <noreply@chronexa.com>
MAIL_REPLY_TO=noreply@chronexa.com

# Redis Cache
REDIS_URL=redis://localhost:6379
REDIS_PORT=6379

# MinIO Object Storage
OBJECT_STORAGE_ACCESS_KEY=minioadmin
OBJECT_STORAGE_SECRET_KEY=minio12345
OBJECT_STORAGE_PORT=9000
OBJECT_STORAGE_ENDPOINT=localhost
OBJECT_STORAGE_URL=http://localhost:9000
```

3. **Create `.env` file in `client/` directory:**

```bash
echo "VITE_BACKEND_URL=http://localhost:3000/api" > client/.env
```

## 📥 Installation

1. **Clone the repository** (if not already cloned):
```bash
git clone https://github.com/yourusername/Chronexa.git
cd Chronexa
```

2. **Install root dependencies:**
```bash
npm install
```

3. **Start Docker services** (PostgreSQL, Redis, MinIO):
```bash
npm run docker:start
```

Wait for all containers to be ready (about 10-15 seconds).

## 🚀 Running the Application

### Option 1: **Full Stack (Recommended)**
Runs backend, frontend, and Electron app concurrently:

```bash
npm start
```

This command:
- ✅ Starts Docker containers (PostgreSQL, Redis, MinIO)
- ✅ Starts the Express.js backend on `http://localhost:3000`
- ✅ Starts the Vite dev server on `http://localhost:5173`
- ✅ Launches the Electron desktop app
- ✅ Stops Docker containers when done

### Option 2: **Backend Only**
For REST API development:

```bash
npm run docker:start
npm run server
```

Backend runs on `http://localhost:3000`

### Option 3: **Frontend Only**
For UI development (requires running backend separately):

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Option 4: **Individual Services**

Start each service in separate terminals:

**Terminal 1 - Docker Services:**
```bash
npm run docker:start
```

**Terminal 2 - Backend:**
```bash
npm run server
```

**Terminal 3 - Frontend:**
```bash
cd client
npm run dev
```

**Terminal 4 - Electron (optional):**
```bash
npm run electron:dev
```

## 🌐 Access Points

After running the app:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **MinIO Console**: http://localhost:9000 (username: `minioadmin`, password: `minio12345`)
- **Redis**: localhost:6379
- **PostgreSQL**: localhost:5432

## 🛠️ Available Scripts

```bash
# Frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
npm run server       # Start Express.js server

# Docker
npm run docker:start # Start all Docker containers
npm run docker:stop  # Stop all Docker containers

# Electron
npm run electron:dev # Run Electron in development
npm run electron:prod # Run Electron in production

# General
npm run lint         # Run ESLint
npm start            # Full stack (all services)
npm run build        # Build frontend
```

## 🔍 Troubleshooting

### Port Already in Use

If you get "Port already in use" error:

```bash
# Find and kill process using the port
# On macOS/Linux
lsof -i :5173    # Frontend
lsof -i :3000    # Backend
lsof -i :5432    # PostgreSQL
kill -9 <PID>

# On Windows (PowerShell as Admin)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Docker Issues

**Containers not starting:**
```bash
npm run docker:stop
docker system prune
npm run docker:start
```

**Check container status:**
```bash
docker ps
docker logs <container_name>
```

### Database Connection Failed

1. Verify `.env` has correct `DB_*` values
2. Check if PostgreSQL container is running: `docker ps | grep postgres`
3. Ensure database was initialized: `docker exec <postgres_container> psql -U postgres -d chronexa -c "\dt"`

### Frontend Not Loading

1. Check if backend is running: `curl http://localhost:3000/api`
2. Verify `VITE_BACKEND_URL` in `client/.env`
3. Check browser console for CORS errors
4. Clear browser cache and refresh

### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules client/node_modules
npm install

# Clear cache
npm cache clean --force
```

## 📝 Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `FRONTEND_URL` | Frontend origin for CORS | http://localhost:5173 |
| `BACKEND_PORT` | Express.js server port | 3000 |
| `DB_HOST` | PostgreSQL hostname | localhost |
| `DB_NAME` | Database name | chronexa |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | any_random_string |
| `SMTP_USER` | Email for sending reset links | your_email@gmail.com |
| `OBJECT_STORAGE_*` | MinIO configuration | minioadmin |

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a pull request

## 📄 License

This project is private. All rights reserved.

## 📞 Support

For issues or questions, please check the troubleshooting section or open an issue on GitHub.

---

**Happy coding! 🌸**
