# MySQL Setup Guide for Solo Leveling Backend

The backend has been converted from MongoDB to MySQL. Follow these steps to set up your MySQL database.

## Option 1: Using MySQL Server (Recommended for Windows)

### 1. Download and Install MySQL
- Go to https://dev.mysql.com/downloads/mysql/
- Download **MySQL Community Server** (latest version)
- Run the installer and follow the setup wizard:
  - Choose "Developer Default" or "Server only"
  - Accept default port: **3306**
  - Configure MySQL as a Windows Service (recommended)
  - Root password: Set a password (or leave empty for no password)
  - Create user account (optional)

### 2. Verify Installation
Open PowerShell and run:
```powershell
mysql --version
```

### 3. Create the Database
```powershell
mysql -u root -p
```
Enter your password (or just press Enter if no password set).

Then in MySQL CLI:
```sql
CREATE DATABASE solo_leveling;
EXIT;
```

### 4. Configure Backend .env
In `backend/.env` (create from `.env.example`):
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password_here
MYSQL_DATABASE=solo_leveling
PORT=5000
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
```

### 5. Install Dependencies
```powershell
cd backend
npm install
```

### 6. Start the Backend
```powershell
npm run dev
```

You should see:
```
MYSQL CONNECTED
SERVER RUNNING ON PORT 5000
```

---

## Option 2: Using Docker (Fastest)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed

### 1. Start MySQL Container
```powershell
docker run -d `
  --name mysql-solo `
  -e MYSQL_ROOT_PASSWORD=password `
  -e MYSQL_DATABASE=solo_leveling `
  -p 3306:3306 `
  mysql:8.0
```

### 2. Wait a moment for MySQL to start, then configure .env
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=solo_leveling
PORT=5000
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
```

### 3. Install Dependencies and Start
```powershell
cd backend
npm install
npm run dev
```

### 4. Stop MySQL Container (when done)
```powershell
docker stop mysql-solo
docker rm mysql-solo
```

---

## Option 3: Using MySQL Workbench (GUI)

### 1. Download and Install
- Go to https://dev.mysql.com/downloads/workbench/
- Install MySQL Workbench

### 2. Create Connection and Database
- Launch MySQL Workbench
- Create new connection to localhost:3306
- Use root user
- Execute SQL:
```sql
CREATE DATABASE solo_leveling;
```

### 3. Configure Backend
Same as Option 1, step 4.

---

## Verification

After starting the backend, test the connection:

```powershell
curl http://localhost:5000/api/health
```

Should return:
```json
{"success": true, "message": "SYSTEM ONLINE"}
```

---

## Troubleshooting

### Port 3306 Already in Use
```powershell
netstat -ano | findstr :3306
```
Kill the process using that port or change `MYSQL_PORT` in .env

### MySQL Service Not Running
```powershell
# Start MySQL Service (Windows)
net start MySQL80

# Stop MySQL Service
net stop MySQL80
```

### "Can't connect to MySQL server"
- Verify MySQL is running: `mysql --version` returns output
- Check credentials in .env match your MySQL setup
- Verify MYSQL_HOST and MYSQL_PORT are correct

### "Access denied for user 'root'@'localhost'"
- Password mismatch in .env
- Reset MySQL root password (see MySQL docs)

---

## Database Migrations

The backend uses Sequelize ORM with automatic table creation:
- Tables are created automatically on server startup
- Use `alter: true` in `db.js` for schema changes (development only)

To reset database:
```sql
DROP DATABASE solo_leveling;
CREATE DATABASE solo_leveling;
```

---

## Next Steps

1. Start the backend: `npm run dev`
2. Frontend will automatically detect 🟢 **SERVER ONLINE**
3. Register a new account
4. Test the app!
