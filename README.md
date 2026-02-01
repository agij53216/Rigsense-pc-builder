# RigSense - PC Build Recommendation System

A comprehensive web application that helps users design, customize, and optimize PC builds with performance predictions, compatibility checking, and intelligent recommendations.

## 🏗️ Architecture

This is a monorepo containing:
- **Frontend**: Next.js application with React and TypeScript
- **Backend**: Express.js REST API with MongoDB

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MongoDB** - Choose one of:
  - [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud - Recommended for beginners)
  - [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (Local installation)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd rigsense
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file from example
cp .env.example .env

# Edit .env and configure your settings
# Required: MONGODB_URI, PORT, FRONTEND_URL
```

**Configure `.env` file:**
```env
# For MongoDB Atlas (Recommended):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rigsense

# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/rigsense

PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Start the backend:**
```bash
npm run dev
```

The backend should now be running on **http://localhost:3001**

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file from example
cp .env.example .env.local

# Edit .env.local and configure your settings
```

**Configure `.env.local` file:**
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Application URL (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Start the frontend:**
```bash
npm run dev
```

The frontend should now be running on **http://localhost:3000**

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create a free account** at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create a new cluster** (Free tier available)
3. **Create a database user** with username and password
4. **Whitelist your IP address** (or use `0.0.0.0/0` for development)
5. **Get your connection string**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
6. **Update** `backend/.env` with your connection string

### Option 2: MongoDB Local Installation

1. **Install MongoDB Community Edition** from [MongoDB Downloads](https://www.mongodb.com/try/download/community)
2. **Start MongoDB service**:
   - Windows: MongoDB should start automatically as a service
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`
3. **Use local connection string** in `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/rigsense
   ```

### Verify Database Connection

Visit **http://localhost:3001/health** and check the response:
```json
{
  "status": "healthy",
  "dbStatus": "connected"
}
```

## 🎯 Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |

## 📂 Project Structure

```
rigsense/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Entry point
│   ├── .env.example        # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   ├── components/     # React components
│   │   └── lib/            # Utility libraries
│   ├── .env.example        # Environment variables template
│   └── package.json
│
└── README.md               # This file
```

## 🔧 Troubleshooting

### Port Already in Use

If you get an error about port 3001 or 3000 being in use:

**Windows:**
```powershell
# Find process using the port
netstat -ano | findstr :3001

# Kill the process (replace <PID> with the process ID)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill process using the port
lsof -ti:3001 | xargs kill -9
```

Or change the port in your `.env` file:
```env
PORT=3002
```

### Database Connection Failed

1. **Check MongoDB is running**:
   - Atlas: Verify IP whitelist and credentials
   - Local: Ensure MongoDB service is running

2. **Verify connection string**:
   - Check for typos in `MONGODB_URI`
   - Ensure password special characters are URL-encoded
   - For Atlas: Make sure you replaced `<password>` with actual password

3. **Check backend logs** for specific error messages

### Frontend Can't Connect to Backend

1. **Verify backend is running**: Visit http://localhost:3001/health
2. **Check `NEXT_PUBLIC_API_URL`** in `frontend/.env.local` matches backend port
3. **Clear browser cache** and restart frontend dev server

### Missing Environment Variables

If you see errors about missing variables:
1. Ensure you copied `.env.example` to `.env` (backend) or `.env.local` (frontend)
2. Check that all required variables are filled in
3. Restart the development server after changing `.env` files

## 🔐 Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/rigsense` |
| `PORT` | Backend server port | `3001` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |
| `NEXT_PUBLIC_APP_URL` | Application base URL (optional) | `http://localhost:3000` |

## 📚 Additional Documentation

- [Backend Documentation](./backend/README.md) - API endpoints and backend details
- [Frontend Documentation](./frontend/README.md) - Frontend architecture and components

## 🤝 Contributing

When contributing to this project:
1. Never commit `.env` or `.env.local` files
2. Always update `.env.example` files when adding new environment variables
3. Test your changes with a fresh clone to ensure setup works

## 📝 License

This project is licensed under the MIT License.

## 🐛 Issues

If you encounter any issues not covered here, please:
1. Check if the issue is related to environment configuration
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed (`npm install`)
4. Open an issue on GitHub with detailed error messages

## Documentation Update - Feb 15
