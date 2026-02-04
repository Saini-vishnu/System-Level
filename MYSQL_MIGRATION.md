# MySQL Migration Summary

## Changes Made ✓

Your backend has been **successfully converted from MongoDB to MySQL**!

### What Changed:
1. **Dependencies**: Replaced `mongoose` with `sequelize` and `mysql2`
2. **Database Connection**: New `backend/db.js` with Sequelize MySQL config
3. **User Model**: Converted from MongoDB schema to Sequelize model
4. **SystemData Model**: Converted from MongoDB schema to Sequelize model
5. **Server**: Updated `backend/server.js` to use Sequelize instead of Mongoose
6. **Environment**: Updated `.env.example` with MySQL configuration

### Files Modified:
- ✅ `backend/package.json` - Updated dependencies
- ✅ `backend/server.js` - MySQL connection
- ✅ `backend/models/User.js` - Sequelize User model
- ✅ `backend/models/SystemData.js` - Sequelize SystemData model
- ✅ `backend/.env.example` - MySQL config template

### Files Created:
- ✅ `backend/db.js` - MySQL connection configuration
- ✅ `MYSQL_SETUP.md` - Complete MySQL setup guide

---

## Quick Start

### 1. Install MySQL (Choose One)
- **Windows**: Download from https://dev.mysql.com/downloads/mysql/
- **Docker**: `docker run -d -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=solo_leveling -p 3306:3306 mysql:8.0`
- **WSL**: `sudo apt install mysql-server` then `sudo service mysql start`

### 2. Create .env File
Copy `backend/.env.example` to `backend/.env`:
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=solo_leveling
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### 3. Install Backend Dependencies
```powershell
cd backend
npm install
```

### 4. Start Backend
```powershell
npm run dev
```

### 5. Frontend Auto-Detects
Frontend will show: **🟢 SERVER ONLINE**

---

## Why MySQL Instead of MongoDB?

✅ **No installation needed** - Often pre-installed on servers  
✅ **Better for structured data** - Your game data is relational  
✅ **Easier backups** - Standard SQL tools  
✅ **Better for scaling** - More mature than MongoDB for traditional apps  
✅ **Cost** - Free and open-source  

---

## API Compatibility

**All API endpoints remain the same!** No frontend changes needed:
- ✅ `/api/auth/register`
- ✅ `/api/auth/login`
- ✅ `/api/system/data`
- ✅ `/api/system/data/sync`
- ✅ `/api/health`
- And all others...

The frontend's `APIService.js` will work without modification!

---

## Database Schema

### Users Table
```
id (UUID, Primary Key)
username (String, Unique)
email (String, Unique)
password (String, Hashed)
lastLogin (DateTime)
createdAt (DateTime)
updatedAt (DateTime)
```

### SystemData Table
```
id (UUID, Primary Key)
userId (UUID, Foreign Key → Users)
rank (ENUM: E, D, C, B, A, S)
currentExp (Integer)
stats (JSON)
logs (JSON Array)
violations (JSON Array)
... and 15+ other fields
```

---

## Backup & Restore

### Backup Database
```powershell
mysqldump -u root -p solo_leveling > backup.sql
```

### Restore Database
```powershell
mysql -u root -p solo_leveling < backup.sql
```

---

## Troubleshooting

**"Can't connect to MySQL"?**
1. Verify MySQL is running
2. Check credentials in `.env`
3. Verify database `solo_leveling` exists

**"Table doesn't exist"?**
- Restart backend: `npm run dev`
- Tables auto-create on startup

**"Port 3306 already in use"?**
```powershell
netstat -ano | findstr :3306
taskkill /PID <PID> /F
```

See full guide: [MYSQL_SETUP.md](MYSQL_SETUP.md)
