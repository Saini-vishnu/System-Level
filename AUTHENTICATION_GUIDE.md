# Authentication & Login Implementation

## ✅ What Was Added

### 1. **LoginRegister Component** (`components/LoginRegister.jsx`)
- User registration form
- User login form
- Toggle between login/register
- Offline mode option
- Error handling with visual feedback
- Loading state management

### 2. **APIService** (`services/APIService.js`)
- Handles all backend API communication
- JWT token management
- Automatic header injection
- Error handling
- Health check functionality

### 3. **HybridSystemBackend** (`services/HybridSystemBackend.js`)
- Manages online/offline switching
- Automatic sync when connection restored
- Pending changes queue
- Cross-device sync support

### 4. **Updated App.jsx**
- Authentication check on load
- Login/Register screen when not authenticated
- Automatic redirect to login if token expires
- Sync status display
- Logout functionality

### 5. **Updated Header Component**
- Shows username when logged in
- Logout button
- Sync status indicator with pending count

## 🔧 Configuration

### Frontend Setup
1. Create `.env` file in root:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

2. Or use defaults (localhost:5000)

### Backend Setup
1. See `BACKEND_SETUP.md` for complete setup
2. Ensure MongoDB is running
3. Start backend with `npm run dev` in `/backend`

## 🚀 How to Use

### First Time Setup
```bash
# Frontend (already running)
npm run dev

# Backend (in new terminal)
cd backend
npm install
cp .env.example .env
npm run dev
```

### Using the App

**Option 1: With Backend (Online Mode)**
1. Frontend loads at http://localhost:3000
2. See Login/Register page
3. Register new account OR login with existing
4. Data syncs automatically to MongoDB
5. Can access same account from multiple devices

**Option 2: Without Backend (Offline Mode)**
1. Frontend loads at http://localhost:3000
2. Click "OFFLINE MODE" button
3. App works entirely in localStorage
4. No sync, local-only mode

## 🔐 Authentication Flow

```
User enters email/password
         ↓
LoginRegister component
         ↓
APIService.login() or .register()
         ↓
Backend validates credentials
         ↓
JWT token returned
         ↓
Stored in localStorage
         ↓
App initializes with token
         ↓
HybridSystemBackend starts syncing
```

## 📱 Cross-Device Sync

### Same Account on Multiple Devices
```
Device A (Phone):
- Login with email@example.com
- Train, log workouts
- Data stored in MongoDB

Device B (Laptop):
- Login with email@example.com
- See all data from Device A
- Changes sync instantly
- No data loss
```

### Offline Sync
```
Device A loses connection:
- Changes stored locally in queue
- Pending badge shows count

Connection restored:
- Auto-sync triggers
- All pending changes upload
- Devices stay in sync
```

## 🛡️ Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Token stored securely in localStorage
- Per-user data isolation
- No hardcoded credentials

## ⚠️ Important Notes

1. **First Login**: Register new account
2. **Offline Mode**: Works without backend, no sync
3. **Multiple Devices**: Use same email to sync
4. **Tokens**: Expire after 7 days
5. **MongoDB**: Required for online mode

## 🔗 API Endpoints

All authenticated requests require: `Authorization: Bearer <token>`

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/system/data` - Get user data
- `POST /api/system/data/sync` - Sync state
- `POST /api/system/data/log` - Add log
- `POST /api/system/data/violation` - Add violation
- `PUT /api/system/data/target` - Update targets
- `GET /api/system/data/logs` - Get all logs
- `GET /api/system/data/violations` - Get violations

## 🐛 Troubleshooting

### "Cannot connect to server"
- Backend not running?
- Check if server is on http://localhost:5000
- Update `.env` with correct URL

### "Login failed"
- MongoDB not connected?
- Check backend logs
- Verify .env in backend folder

### "Offline mode keeps appearing"
- Backend server is down
- Switch to offline mode or fix backend
- Click "OFFLINE MODE" button

### "Data not syncing across devices"
- Ensure using same email on both devices
- Check backend is running
- Look for pending badge count

## 📝 Next Steps

1. ✅ Backend + Database setup complete
2. ✅ Authentication system added
3. ✅ Login/Register UI created
4. ✅ Cross-device sync ready
5. Next: Deploy backend to production
