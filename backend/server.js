import express from 'express';
import cors from 'cors';
import sequelize from './db.js';
import authRoutes from './routes/auth.js';
import systemRoutes from './routes/system.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/system', systemRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SYSTEM ONLINE' });
});

// Connect to MySQL
sequelize.sync({ alter: false })
  .then(() => {
    console.log('MYSQL CONNECTED');
    app.listen(PORT, () => {
      console.log(`SERVER RUNNING ON PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MYSQL CONNECTION FAILED:', error);
    process.exit(1);
  });

export default app;
