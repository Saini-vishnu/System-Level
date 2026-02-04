# Backend Setup Guide

## Prerequisites
- Node.js 14+ installed
- MongoDB installed locally OR MongoDB Atlas account
- npm or yarn

## Installation Steps

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend folder (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```
MONGODB_URI=mongodb://localhost:27017/solo-leveling
PORT=5000
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=development
```

### 3. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   - **Windows**: MongoDB should run as a service automatically
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string and add to `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/solo-leveling?retryWrites=true&w=majority
```

### 4. Start Backend Server
```bash
npm run dev
```

Server will start at `http://localhost:5000`

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user

### System Data
- **GET** `/api/system/data` - Get user's system data
- **POST** `/api/system/data/sync` - Sync full system state
- **POST** `/api/system/data/log` - Add training log
- **POST** `/api/system/data/violation` - Add violation
- **PUT** `/api/system/data/target` - Update daily target
- **GET** `/api/system/data/logs` - Get all logs
- **GET** `/api/system/data/violations` - Get all violations

## Frontend Configuration

### 1. Update API URL
In your frontend code, configure the API service:
```javascript
import APIService from './services/APIService.js';
import HybridSystemBackend from './services/HybridSystemBackend.js';

const apiService = new APIService('http://localhost:5000/api');
const hybridBackend = new HybridSystemBackend(apiService);
```

### 2. How Hybrid Mode Works

**Online Mode:**
- User logs in → Data syncs from backend
- Changes save to localStorage immediately
- Changes also sync to backend in background
- If server goes down, app continues in offline mode

**Offline Mode:**
- All data stored in localStorage
- Changes queued for sync
- When connection restored, all pending changes sync automatically
- No data loss

**Features:**
- ✅ Works completely offline
- ✅ Automatic sync when online
- ✅ Per-user data isolation
- ✅ Cross-device sync (when online)
- ✅ Secure JWT authentication
- ✅ No data loss

## Deployment

### Backend Deployment Options

#### Heroku
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-secret-key
git push heroku main
```

#### Railway.app
1. Connect GitHub repo
2. Add MongoDB addon
3. Set environment variables
4. Deploy

#### AWS/DigitalOcean
1. Set up Node.js server
2. Install MongoDB
3. Deploy code
4. Set environment variables
5. Start server with PM2 or similar

### Frontend Deployment

Update API URL in frontend to point to deployed backend:
```javascript
const apiService = new APIService('https://your-backend-url/api');
```

## Database Schema

### Users Collection
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  lastLogin: Date
}
```

### SystemData Collection
```javascript
{
  userId: ObjectId (ref to User),
  rank: String,
  currentExp: Number,
  stats: {
    str: { current, limit },
    agi: { current, limit },
    sta: { current, limit },
    sen: { current, limit }
  },
  streak: Number,
  logs: Array,
  violations: Array,
  dailyTarget: Object,
  syncedAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check connection string in `.env`
- For local: `mongodb://localhost:27017/solo-leveling`
- For Atlas: Check IP whitelist

### "Cannot connect to backend from frontend"
- Ensure backend server is running on port 5000
- Check CORS settings in server.js
- Verify API URL in frontend matches backend URL

### "Authentication failed"
- Clear browser localStorage and restart
- Ensure JWT_SECRET is set in `.env`
- Check token expiration (7 days by default)

### "Data not syncing"
- Check browser console for errors
- Ensure user is authenticated (token present)
- Check network tab in DevTools
- Verify backend is online

## Features

✅ User registration and authentication
✅ Secure JWT token-based auth
✅ Per-user data isolation
✅ Full offline support with automatic sync
✅ Cross-device sync capability
✅ Persistent data with MongoDB
✅ RESTful API design
✅ Error handling and logging
✅ Hybrid local + cloud architecture
