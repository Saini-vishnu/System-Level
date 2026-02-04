import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './User.js';

const SystemData = sequelize.define('SystemData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  rank: {
    type: DataTypes.ENUM('E', 'D', 'C', 'B', 'A', 'S'),
    defaultValue: 'E',
  },
  currentExp: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  stats: {
    type: DataTypes.JSON,
    defaultValue: {
      str: { current: 0, limit: 150 },
      agi: { current: 0, limit: 100 },
      sta: { current: 0, limit: 100 },
      sen: { current: 0, limit: 500 },
    },
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  logs: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  violations: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  lastWorkoutDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastLogDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastTaskAssignmentDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pendingTask: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  validSkipsThisMonth: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastSkipResetDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  systemPaused: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  pauseEndDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastAuditDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  auditLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  consecutiveViolations: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  dailyTarget: {
    type: DataTypes.JSON,
    defaultValue: {
      pushups: 100,
      squats: 100,
      situps: 100,
      running: 10,
      dash: 1,
      burpees: 30,
      distance: 1,
      breathbox: 5,
      shadowbox: 4,
      yoga: 1,
    },
  },
  syncedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  hooks: {
    beforeSave: (systemData) => {
      systemData.syncedAt = new Date();
      systemData.updatedAt = new Date();
    },
  },
});

User.hasOne(SystemData, { foreignKey: 'userId', onDelete: 'CASCADE' });
SystemData.belongsTo(User, { foreignKey: 'userId' });

export default SystemData;
