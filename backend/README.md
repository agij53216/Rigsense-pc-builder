# RigSense Backend API

Express.js REST API for the RigSense PC build recommendation system.

## 🎯 Overview

This backend provides:
- **Authentication** endpoints for user management
- **Build Management** API for saving and retrieving PC builds
- **Component Database** with specifications and compatibility data
- **RESTful API** with security best practices

## 🏗️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, Rate Limiting
- **Authentication**: JWT (JSON Web Tokens)

## 📋 Prerequisites

- Node.js v18 or higher
- MongoDB (Atlas or local installation)
- npm or yarn

## 🚀 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/rigsense
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rigsense

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000

# Environment
NODE_ENV=development

# JWT (Optional - for authentication)
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRE=7d
```

### 3. Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

## 🔌 API Endpoints

### Health Check
```http
GET /health
```
Returns server and database status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-15T12:00:00.000Z",
  "service": "RigSense Backend API",
  "dbStatus": "connected"
}
```

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Builds
```http
GET    /api/builds
POST   /api/builds
GET    /api/builds/:id
PUT    /api/builds/:id
DELETE /api/builds/:id
```

### Components
```http
GET /api/components
GET /api/components/:id
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── models/
│   │   ├── User.js          # User model
│   │   ├── Build.js         # Build model
│   │   └── Component.js     # Component model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── builds.js        # Build management routes
│   │   └── components.js    # Component routes
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   └── server.js             # Express app entry point
├── .env.example              # Environment variables template
├── .gitignore
└── package.json
```

## 🗄️ Database Schema

### User Model
```javascript
{
  email: String,
  password: String (hashed),
  name: String,
  createdAt: Date
}
```

### Build Model
```javascript
{
  userId: ObjectId,
  name: String,
  components: {
    cpu: Object,
    gpu: Object,
    motherboard: Object,
    ram: Object,
    storage: Array,
    psu: Object,
    case: Object,
    cooling: Object
  },
  totalPrice: Number,
  createdAt: Date
}
```

### Component Model
```javascript
{
  type: String,
  name: String,
  manufacturer: String,
  price: Number,
  specs: Object,
  inStock: Boolean,
  imageUrl: String
}
```

## 🔐 Security Features

- **Helmet**: Security headers
- **CORS**: Configured for frontend origin
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password storage
- **Input Validation**: express-validator

## 🧪 Testing the API

### Using curl

**Health check:**
```bash
curl http://localhost:3001/health
```

**Get all components:**
```bash
curl http://localhost:3001/api/components
```

### Using a REST Client

Import the API endpoints into:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)

## 🔧 Troubleshooting

### Database Connection Failed

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
1. **Check MongoDB is running**:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Verify connection string** in `.env`
3. **For Atlas**: Check IP whitelist and credentials

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Change PORT in .env
PORT=3002
```

Or kill the process using the port:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### Missing Environment Variables

**Error**: `MONGODB_URI is not defined`

**Solution:**
1. Ensure `.env` file exists in `backend/` directory
2. Check all required variables are set
3. Restart the server after editing `.env`

## 📊 Logging

The API uses Morgan for HTTP request logging in development mode. Logs include:
- HTTP method and URL
- Response status code
- Response time

## 🚀 Production Deployment

When deploying to production:

1. **Set environment variables** on your hosting platform:
   ```env
   MONGODB_URI=your-production-mongodb-uri
   PORT=3001
   FRONTEND_URL=https://your-frontend-domain.com
   NODE_ENV=production
   JWT_SECRET=your-secure-secret-key
   ```

2. **Use a process manager** like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name rigsense-api
   ```

3. **Enable MongoDB Atlas** for production database

4. **Use environment-specific configs** for security

## 📝 Development Notes

### Adding New Routes

1. Create route file in `src/routes/`
2. Define route handlers
3. Import in `server.js`
4. Add to Express app: `app.use('/api/your-route', require('./routes/your-route'))`

### Adding New Models

1. Create model file in `src/models/`
2. Define Mongoose schema
3. Export model
4. Use in route handlers

## 🤝 Contributing

When contributing:
- Never commit `.env` files
- Update `.env.example` when adding new variables
- Follow existing code style
- Add appropriate error handling
- Test all endpoints before submitting PR

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [JWT.io](https://jwt.io/)
