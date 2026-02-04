import APIService from './APIService.js';

// Hybrid SystemBackend - supports both offline (localStorage) and online (API) modes
class HybridSystemBackend {
  constructor(apiService = null) {
    this.apiService = apiService || new APIService();
    this.isOnline = false;
    this.pendingSync = [];
    this.localSystemBackend = null;
    this.checkServerConnection();
    this.setupSyncQueue();
  }

  async checkServerConnection() {
    try {
      const health = await this.apiService.healthCheck();
      this.isOnline = health.success;
    } catch (error) {
      this.isOnline = false;
    }
  }

  setupSyncQueue() {
    // Check every 5 seconds if connection restored
    setInterval(() => {
      this.checkServerConnection();
      if (this.isOnline && this.pendingSync.length > 0) {
        this.syncPendingChanges();
      }
    }, 5000);
  }

  async initializeBackend(remoteSystemBackend) {
    this.localSystemBackend = remoteSystemBackend;
    
    if (this.isOnline && this.apiService.isAuthenticated()) {
      try {
        const response = await this.apiService.getSystemData();
        if (response.success) {
          // Load from backend if online
          return response.data;
        }
      } catch (error) {
        console.log('FAILED TO SYNC, USING LOCAL DATA');
        this.isOnline = false;
      }
    }
    
    // Fall back to localStorage
    return this.localSystemBackend.loadState();
  }

  async saveState(state) {
    // Always save locally
    if (this.localSystemBackend) {
      this.localSystemBackend.state = state;
      this.localSystemBackend.saveState();
    }

    // Try to sync to backend if online
    if (this.isOnline && this.apiService.isAuthenticated()) {
      try {
        await this.apiService.syncSystemData(state);
        console.log('DATA SYNCED TO BACKEND');
      } catch (error) {
        console.error('SYNC FAILED:', error);
        this.isOnline = false;
        this.pendingSync.push({ action: 'sync', state });
      }
    } else if (!this.isOnline && this.apiService.isAuthenticated()) {
      // Queue for later sync
      this.pendingSync.push({ action: 'sync', state });
    }
  }

  async processLog(logData, localBackend) {
    // Process locally first
    const result = localBackend.processLog(logData);

    if (result.success && this.apiService.isAuthenticated()) {
      // Try to sync the log
      try {
        if (this.isOnline) {
          await this.apiService.addLog(logData);
          console.log('LOG SYNCED TO BACKEND');
        } else {
          // Queue for later
          this.pendingSync.push({ action: 'addLog', data: logData });
        }
      } catch (error) {
        console.error('LOG SYNC FAILED:', error);
        this.isOnline = false;
        this.pendingSync.push({ action: 'addLog', data: logData });
      }
    }

    return result;
  }

  async addViolation(violation, localBackend) {
    if (this.apiService.isAuthenticated()) {
      try {
        if (this.isOnline) {
          await this.apiService.addViolation(violation);
          console.log('VIOLATION SYNCED TO BACKEND');
        } else {
          this.pendingSync.push({ action: 'addViolation', data: violation });
        }
      } catch (error) {
        console.error('VIOLATION SYNC FAILED:', error);
        this.isOnline = false;
        this.pendingSync.push({ action: 'addViolation', data: violation });
      }
    }
  }

  async updateDailyTarget(dailyTarget) {
    // Save locally
    if (this.localSystemBackend) {
      this.localSystemBackend.state.dailyTarget = dailyTarget;
      this.localSystemBackend.saveState();
    }

    // Sync to backend
    if (this.isOnline && this.apiService.isAuthenticated()) {
      try {
        await this.apiService.updateDailyTarget(dailyTarget);
        console.log('TARGET SYNCED TO BACKEND');
      } catch (error) {
        console.error('TARGET SYNC FAILED:', error);
        this.isOnline = false;
        this.pendingSync.push({ action: 'updateTarget', data: dailyTarget });
      }
    } else if (!this.isOnline && this.apiService.isAuthenticated()) {
      this.pendingSync.push({ action: 'updateTarget', data: dailyTarget });
    }
  }

  async syncPendingChanges() {
    if (!this.isOnline || !this.apiService.isAuthenticated() || this.pendingSync.length === 0) {
      return;
    }

    console.log(`SYNCING ${this.pendingSync.length} PENDING CHANGES...`);

    const failed = [];

    for (const item of this.pendingSync) {
      try {
        switch (item.action) {
          case 'sync':
            await this.apiService.syncSystemData(item.state);
            break;
          case 'addLog':
            await this.apiService.addLog(item.data);
            break;
          case 'addViolation':
            await this.apiService.addViolation(item.data);
            break;
          case 'updateTarget':
            await this.apiService.updateDailyTarget(item.data);
            break;
        }
      } catch (error) {
        console.error('SYNC ITEM FAILED:', error);
        failed.push(item);
      }
    }

    this.pendingSync = failed;

    if (failed.length === 0) {
      console.log('ALL CHANGES SYNCED');
    } else {
      console.log(`${failed.length} ITEMS STILL PENDING`);
    }
  }

  getStatus() {
    return {
      isOnline: this.isOnline,
      isAuthenticated: this.apiService.isAuthenticated(),
      pendingSyncCount: this.pendingSync.length,
      message: this.isOnline 
        ? this.apiService.isAuthenticated() 
          ? 'ONLINE - SYNCING'
          : 'OFFLINE - LOCAL MODE'
        : 'OFFLINE - LOCAL MODE'
    };
  }
}

export default HybridSystemBackend;
