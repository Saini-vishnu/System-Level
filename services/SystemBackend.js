class SystemBackend {
  constructor() {
    this.RANK_EXP_REQUIREMENTS = {
      'E': 100,
      'D': 150,
      'C': 300,
      'B': 600,
      'A': 1200,
      'S': 2400
    };

    this.RANK_LIMITS = {
      'E': { str: 150, agi: 100, sta: 100, sen: 500 },
      'D': { str: 200, agi: 200, sta: 200, sen: 600 },
      'C': { str: 300, agi: 300, sta: 300, sen: 700 },
      'B': { str: 500, agi: 500, sta: 500, sen: 900 },
      'A': { str: 700, agi: 700, sta: 700, sen: 1100 },
      'S': { str: 1000, agi: 1000, sta: 1000, sen: 1400 }
    };

    this.RANKS = ['E', 'D', 'C', 'B', 'A', 'S'];

    this.AUTOMATED_TASKS = {
      'E': [
        "Hold plank position for 2 minutes without breaking form",
        "Complete 50 burpees within 10 minutes",
        "Meditate in silence for 15 minutes",
        "Write down 3 discipline failures from this week and their corrections",
        "Hold a wall sit for 3 minutes",
        "Complete 100 jumping jacks without rest",
        "Practice breath control: 4-7-8 breathing for 10 cycles",
        "Perform 20 perfect form push-ups (5 second descent)",
        "Shadow boxing: 3 rounds of 2 minutes with 30 second rest",
        "Cold shower for minimum 3 minutes"
      ],
      'D': [
        "Hold plank position for 3 minutes without breaking form",
        "Complete 75 burpees within 10 minutes",
        "Meditate in silence for 20 minutes with focus on breathing",
        "Write detailed analysis of weekly performance and improvements",
        "Hold a wall sit for 4 minutes",
        "Complete 150 jumping jacks without stopping",
        "Practice advanced breath control: 5-8-10 breathing for 15 cycles",
        "Perform 35 perfect form push-ups (5 second descent)",
        "Shadow boxing: 4 rounds of 3 minutes with 20 second rest",
        "Ice bath immersion for 2 minutes"
      ],
      'C': [
        "Hold plank position for 5 minutes without breaking form",
        "Complete 100 burpees within 12 minutes",
        "Meditate in silence for 30 minutes with full body awareness",
        "Complete comprehensive personal analysis: strengths, weaknesses, action plan",
        "Hold horse stance for 6 minutes",
        "Complete 200 jumping jacks without stopping",
        "Advanced breath control: 6-8-12 breathing for 20 cycles",
        "Perform 50 perfect form push-ups (5 second descent)",
        "Shadow boxing: 5 rounds of 4 minutes with minimal rest",
        "Ice bath immersion for 3 minutes"
      ],
      'B': [
        "Hold plank position for 7 minutes - advanced form variations",
        "Complete 150 burpees within 15 minutes with perfect form",
        "Meditate in silence for 45 minutes with advanced concentration",
        "Create detailed personal development strategy for next quarter",
        "Hold horse stance for 10 minutes without wavering",
        "Complete 300 jumping jacks - increase intensity throughout",
        "Master breath control: 7-9-14 breathing for 30 cycles",
        "Perform 75 perfect form push-ups with one-hand variations",
        "Shadow boxing: 6 rounds of 5 minutes with devastating combinations",
        "Ice bath immersion for 4 minutes with meditation"
      ],
      'A': [
        "Hold plank position for 10 minutes - test mental fortitude",
        "Complete 200 burpees within 15 minutes - extreme intensity",
        "Meditate in silence for 60 minutes with transcendent focus",
        "Design comprehensive life transformation blueprint",
        "Hold horse stance for 15 minutes - warrior endurance test",
        "Complete 500 jumping jacks - sustained maximal effort",
        "Achieve perfect breath control mastery: 8-10-16 breathing for 40 cycles",
        "Perform 100 perfect form push-ups with advanced variations",
        "Shadow boxing: 8 rounds of 6 minutes - match-level intensity",
        "Ice bath immersion for 5 minutes - mental barrier breakthrough"
      ],
      'S': [
        "Hold plank position for 15 minutes - ultimate physical and mental test",
        "Complete 300 burpees within 20 minutes - warrior's final challenge",
        "Meditate in silence for 90 minutes - achieve enlightened state",
        "Document complete mastery: teach others your discipline system",
        "Hold horse stance for 20 minutes - transcend physical limits",
        "Complete 1000 jumping jacks - push beyond human limits",
        "Perfect breath control at will: 10-12-20 breathing for 50 cycles",
        "Perform 150 perfect form push-ups - demonstrate S-rank superiority",
        "Shadow boxing: 10 rounds of 8 minutes - unstoppable fighter",
        "Ice bath immersion for 10 minutes - become one with the elements"
      ]
    };

    this.state = this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem('soloLevelingSystemV3');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      rank: 'E',
      currentExp: 0,
      stats: {
        str: { current: 0, limit: 150 },
        agi: { current: 0, limit: 100 },
        sta: { current: 0, limit: 100 },
        sen: { current: 0, limit: 500 }
      },
      streak: 0,
      logs: [],
      violations: [],
      lastWorkoutDate: null,
      lastLogDate: null,
      pendingTask: null,
      validSkipsThisMonth: 0,
      lastSkipResetDate: null,
      systemPaused: false,
      pauseEndDate: null,
      lastAuditDate: null,
      auditLocked: false,
      consecutiveViolations: 0,
      lastTaskAssignmentDate: null,
      dailyTarget: {
        pushups: 100,
        squats: 100,
        situps: 100,
        running: 10,
        dash: 1,
        burpees: 30,
        distance: 1,
        breathbox: 5,
        shadowbox: 4,
        yoga: 1
      }
    };
  }

  saveState() {
    localStorage.setItem('soloLevelingSystemV3', JSON.stringify(this.state));
  }

  checkMissedDays() {
    if (!this.state.lastWorkoutDate || this.state.systemPaused) return null;
    
    const lastDate = new Date(this.state.lastWorkoutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) {
      const missedDays = daysDiff - 1;
      this.applyMissedDayPenalty(missedDays);
      return missedDays;
    }
    
    return null;
  }

  applyMissedDayPenalty(days) {
    for (let i = 0; i < days; i++) {
      this.state.stats.str.current = Math.max(0, this.state.stats.str.current - 10);
      this.state.stats.agi.current = Math.max(0, this.state.stats.agi.current - 10);
      this.state.stats.sta.current = Math.max(0, this.state.stats.sta.current - 10);
      this.state.stats.sen.current = Math.max(0, this.state.stats.sen.current - 10);
    }
    
    this.state.streak = 0;
    this.state.consecutiveViolations++;
    
    this.state.violations.push({
      date: new Date().toISOString().split('T')[0],
      type: 'MISSED_DAY',
      penalty: `ALL STATS -${days * 10} HP`,
      details: `${days} missed day(s)`
    });
    
    this.checkTermination();
    this.saveState();
  }

  resetMonthlySkips() {
    const now = new Date();
    const lastReset = this.state.lastSkipResetDate ? new Date(this.state.lastSkipResetDate) : null;
    
    if (!lastReset || lastReset.getMonth() !== now.getMonth()) {
      // Check if entire previous month was skipped (validSkipsThisMonth = 30+ days)
      if (lastReset && this.state.validSkipsThisMonth >= 30) {
        this.dropRank();
      }
      this.state.validSkipsThisMonth = 0;
      this.state.lastSkipResetDate = now.toISOString();
      this.saveState();
    }
  }

  dropRank() {
    const currentIndex = this.RANKS.indexOf(this.state.rank);
    
    if (currentIndex > 0) {
      const newRank = this.RANKS[currentIndex - 1];
      this.state.rank = newRank;
      this.state.currentExp = 0;
      
      const newLimits = this.RANK_LIMITS[newRank];
      this.state.stats.str.limit = newLimits.str;
      this.state.stats.agi.limit = newLimits.agi;
      this.state.stats.sta.limit = newLimits.sta;
      this.state.stats.sen.limit = newLimits.sen;
      
      this.state.violations.push({
        date: new Date().toISOString().split('T')[0],
        type: 'RANK_DOWN',
        penalty: 'RANK DROPPED',
        details: 'Month-long skip: insufficient discipline shown'
      });
      
      this.saveState();
    }
  }

  checkWeeklyAudit() {
    const today = new Date();
    const lastAudit = this.state.lastAuditDate ? new Date(this.state.lastAuditDate) : null;
    
    if (!lastAudit) {
      this.state.lastAuditDate = today.toISOString();
      this.saveState();
      return false;
    }
    
    const daysSinceAudit = Math.floor((today - lastAudit) / (1000 * 60 * 60 * 24));
    
    if (daysSinceAudit >= 7) {
      this.state.auditLocked = true;
      this.saveState();
      return true;
    }
    
    return false;
  }

  completeWeeklyAudit() {
    this.state.auditLocked = false;
    this.state.lastAuditDate = new Date().toISOString();
    this.saveState();
  }

  checkTermination() {
    if (this.state.consecutiveViolations >= 3) {
      this.state.systemPaused = true;
      const pauseEnd = new Date();
      pauseEnd.setDate(pauseEnd.getDate() + 7);
      this.state.pauseEndDate = pauseEnd.toISOString();
      
      this.state.violations.push({
        date: new Date().toISOString().split('T')[0],
        type: 'SYSTEM_PAUSE',
        penalty: 'SYSTEM PAUSED FOR 7 DAYS',
        details: 'Repeated violations detected'
      });
      
      this.saveState();
    }
  }

  checkSystemPause() {
    if (this.state.systemPaused && this.state.pauseEndDate) {
      const today = new Date();
      const pauseEnd = new Date(this.state.pauseEndDate);
      
      if (today >= pauseEnd) {
        this.state.systemPaused = false;
        this.state.pauseEndDate = null;
        this.state.consecutiveViolations = 0;
        this.saveState();
        return false;
      }
      return true;
    }
    return false;
  }

  generateAutomatedTask() {
    const today = new Date().toISOString().split('T')[0];
    
    if (this.state.systemPaused || this.state.auditLocked) return null;
    
    if (this.state.pendingTask && this.state.pendingTask.assignedDate === today) {
      return this.state.pendingTask;
    }
    
    if (this.state.lastTaskAssignmentDate !== today && Math.random() < 0.15) {
      const currentRankTasks = this.AUTOMATED_TASKS[this.state.rank];
      const task = currentRankTasks[Math.floor(Math.random() * currentRankTasks.length)];
      
      this.state.pendingTask = {
        description: task,
        assignedDate: today,
        completed: false
      };
      
      this.state.lastTaskAssignmentDate = today;
      this.saveState();
      
      return this.state.pendingTask;
    }
    
    return null;
  }

  completeAutomatedTask() {
    if (this.state.pendingTask) {
      this.state.pendingTask.completed = true;
      this.saveState();
    }
  }

  checkRankUp() {
    const expRequired = this.RANK_EXP_REQUIREMENTS[this.state.rank];
    
    if (this.state.currentExp < expRequired) return null;
    
    const currentIndex = this.RANKS.indexOf(this.state.rank);
    
    if (currentIndex < this.RANKS.length - 1) {
      this.state.currentExp = 0;
      const newRank = this.RANKS[currentIndex + 1];
      this.state.rank = newRank;
      
      const newLimits = this.RANK_LIMITS[newRank];
      this.state.stats.str.limit = newLimits.str;
      this.state.stats.agi.limit = newLimits.agi;
      this.state.stats.sta.limit = newLimits.sta;
      this.state.stats.sen.limit = newLimits.sen;
      
      this.saveState();
      return newRank;
    }
    
    return null;
  }

  processLog(logData) {
    // Check if already logged today
    if (this.state.lastLogDate === logData.date) {
      return {
        success: false,
        message: 'LOG ALREADY SUBMITTED TODAY\nCAN ONLY LOG ONCE PER DAY\nRETURN TOMORROW TO LOG AGAIN'
      };
    }

    if (this.state.systemPaused) {
      return {
        success: false,
        message: 'SYSTEM PAUSED\nNO HP GAIN ALLOWED\nDISCIPLINE MUST BE RE-ESTABLISHED'
      };
    }

    if (this.state.auditLocked) {
      return {
        success: false,
        message: 'RANK LOCKED\nWEEKLY AUDIT REQUIRED\nCOMPLETE AUDIT TO PROCEED'
      };
    }

    if (!logData.bookName || !logData.bookPages) {
      this.state.streak = 0;
      this.state.consecutiveViolations++;
      
      this.state.violations.push({
        date: logData.date,
        type: 'READING_FAILURE',
        penalty: 'NO HP GAIN / STREAK RESET',
        details: 'Reading requirement not met'
      });
      
      this.checkTermination();
      this.saveState();
      
      return {
        success: false,
        message: 'TASK FAILED\nREADING NOT COMPLETED\nNO HP GAIN ALLOWED\nSTREAK RESET'
      };
    }

    if (logData.skipReason) {
      this.resetMonthlySkips();
      
      if (this.state.validSkipsThisMonth >= 2) {
        this.applyMissedDayPenalty(1);
        return {
          success: false,
          message: 'SKIP DENIED\nMAXIMUM SKIPS EXCEEDED\nPENALTY APPLIED'
        };
      }
      
      this.state.validSkipsThisMonth++;
      this.state.logs.push({
        date: logData.date,
        type: 'skip',
        reason: logData.skipReason.toUpperCase(),
        book: `${logData.bookName} - ${logData.bookPages}`
      });
      
      this.saveState();
      
      return {
        success: true,
        message: 'VALID SKIP LOGGED\nNO HP GAIN\nNO HP LOSS'
      };
    }

    if (this.state.pendingTask && 
      this.state.pendingTask.assignedDate === logData.date && 
      !this.state.pendingTask.completed) {
      
      this.state.streak = 0;
      this.state.consecutiveViolations++;
      
      // Deduct 10 EXP for forgetting task
      this.state.currentExp = Math.max(0, this.state.currentExp - 10);
      
      this.state.violations.push({
        date: logData.date,
        type: 'TASK_FAILURE',
        penalty: 'NO HP GAIN / EXP -10 / STREAK RESET',
        details: 'Automated task not completed'
      });
      
      this.state.pendingTask = null;
      this.checkTermination();
      this.state.lastLogDate = logData.date;
      this.saveState();
      
      return {
        success: false,
        message: 'AUTOMATED TASK INCOMPLETE\nNO HP GAIN ALLOWED\nEXP -10\nSTREAK RESET'
      };
    }

    const gains = this.calculateHPGains(logData);
    
    // Add EXP to current rank
    this.state.currentExp += gains.totalHP;
    
    this.state.stats.str.current = Math.min(
      this.state.stats.str.limit,
      this.state.stats.str.current + gains.str
    );
    this.state.stats.agi.current = Math.min(
      this.state.stats.agi.limit,
      this.state.stats.agi.current + gains.agi
    );
    this.state.stats.sta.current = Math.min(
      this.state.stats.sta.limit,
      this.state.stats.sta.current + gains.sta
    );
    this.state.stats.sen.current = Math.min(
      this.state.stats.sen.limit,
      this.state.stats.sen.current + gains.sen
    );

    this.state.streak++;
    this.state.lastWorkoutDate = logData.date;
    this.state.lastLogDate = logData.date;
    this.state.consecutiveViolations = 0;

    const newRank = this.checkRankUp();

    this.state.logs.push({
      date: logData.date,
      type: 'workout',
      gains: gains,
      book: `${logData.bookName} - ${logData.bookPages}`,
      notes: logData.notes
    });

    if (this.state.pendingTask && this.state.pendingTask.completed) {
      this.state.pendingTask = null;
    }

    this.saveState();

    let message = `LOG ACCEPTED\nSTR +${gains.str} / AGI +${gains.agi}\nSTA +${gains.sta} / SEN +${gains.sen}`;
    
    if (newRank) {
      const expRequired = this.RANK_EXP_REQUIREMENTS[newRank];
      message += `\n\nRANK UP APPROVED\nNEW RANK: ${newRank}\nEXP REQUIREMENT: ${expRequired}`;
    }

    return {
      success: true,
      message: message,
      rankUp: newRank
    };
  }

  calculateHPGains(data) {
    let str = 0, agi = 0, sta = 0, sen = 0;

    str += Math.floor(data.pushups / 100) * 5;
    str += Math.floor(data.squats / 100) * 5;
    str += Math.floor(data.situps / 100) * 5;
    str += Math.floor(data.running / 10) * 5;

    agi += data.dash * 5;
    agi += data.burpees * 5;

    sta += Math.floor(data.distance / 1) * 5;
    sta += data.breathbox * 3;

    sen += data.shadowbox * 5;
    sen += data.yoga * 5;

    return { str, agi, sta, sen };
  }

  updateDailyTarget(target) {
    this.state.dailyTarget = { ...target };
    this.saveState();
  }

  getDailyProgress(currentData) {
    const progress = {};
    for (let key in this.state.dailyTarget) {
      const target = this.state.dailyTarget[key];
      const current = currentData[key] || 0;
      progress[key] = {
        current: current,
        target: target,
        percentage: target > 0 ? Math.min(100, (current / target) * 100) : 0,
        completed: current >= target
      };
    }
    return progress;
  }

  getSystemStatus() {
    this.resetMonthlySkips();
    const isPaused = this.checkSystemPause();
    const missedDays = this.checkMissedDays();
    const auditRequired = this.checkWeeklyAudit();
    const automatedTask = this.generateAutomatedTask();

    return {
      state: this.state,
      missedDays,
      auditRequired,
      automatedTask,
      isPaused
    };
  }
}

export default SystemBackend;
