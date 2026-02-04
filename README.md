# Solo Leveling Protocol - React Version

This is a React conversion of your Solo Leveling Protocol system tracking application. The app helps you track your fitness journey with stat progression, daily targets, and a ranking system.

## Project Structure

```
Project 3/
├── App.jsx                           # Main App component
├── main.jsx                          # React entry point
├── index.html                        # HTML template
├── vite.config.js                    # Vite configuration
├── package.json                      # Project dependencies
│
├── components/
│   ├── Header.jsx                    # Header component
│   ├── Navigation.jsx                # Tab navigation
│   ├── RankShowcase.jsx              # Rank display
│   ├── StatCard.jsx                  # Individual stat card
│   ├── SystemAlert.jsx               # System pause alert
│   ├── SystemMessage.jsx             # Toast messages
│   ├── DailyTaskCard.jsx             # Daily task display
│   ├── DailyTargetProgress.jsx       # Daily target progress bars
│   ├── DailyLogForm.jsx              # Log submission form
│   │
│   ├── tabs/
│   │   ├── StatusTab.jsx             # Stats dashboard
│   │   ├── TrainingTab.jsx           # Training log & targets
│   │   ├── LogsTab.jsx               # History & violations
│   │   └── SettingsTab.jsx           # Settings
│   │
│   └── modals/
│       ├── TaskModal.jsx             # Task & audit modals
│       └── TargetModal.jsx           # Edit daily targets
│
├── services/
│   └── SystemBackend.js              # Business logic & state management
│
└── styles/
    └── main.css                      # All styling
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

## Features

- **Rank System**: Progress from E-rank to S-rank (approximately 2 years of consistent training)
- **EXP-Based Progression**: 
  - E-rank: 100 EXP
  - D-rank: 150 EXP
  - C-rank: 300 EXP
  - B-rank: 600 EXP
  - A-rank: 1,200 EXP
  - S-rank: 2,400 EXP (total: 4,750 EXP needed)
- **Stat Tracking**: Strength, Agility, Stamina, and Perception
- **Daily Targets**: Customizable exercise targets
- **Training Logs**: Record your daily workouts (one log per day maximum)
- **Automated Tasks**: Daily challenges that scale in difficulty based on current rank
- **Rank-Based Difficulty**: Tasks become progressively harder as you advance ranks
- **Violation System**: Penalties for missed days
- **EXP Penalties**: -10 EXP for forgetting automated tasks
- **Rank Degradation**: Rank drops if you skip training for an entire month (30+ skip days)
- **Weekly Audits**: Review your progress
- **Persistent Storage**: Data saved to localStorage

## Key Components

### App.jsx
Main component that manages state and routing between tabs.

### SystemBackend.js
Contains all business logic including:
- HP gain calculations
- EXP-based rank-up mechanics
- Rank degradation for month-long skips
- Violation tracking
- Weekly audits
- System pause logic
- Rank-based automated task generation

### Tabs
- **Status**: View current rank and stats
- **Training**: Submit daily logs and manage targets
- **Logs**: View training history and violations
- **Settings**: System configuration

## Data Structure

All data is stored in localStorage under `soloLevelingSystemV3`:

```javascript
{
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
  lastLogDate: null,
  dailyTarget: { pushups: 100, squats: 100, ... },
  // ... more fields
}
```

## System HP & Stat Calculations

### Strength (STR) - HP Limit: 150/200/300/500/700/1000
- 100 Push-ups = +5 HP
- 100 Squats = +5 HP
- 100 Sit-ups = +5 HP
- 10 KM Running = +5 HP

### Agility (AGI) - HP Limit: 100/200/300/500/700/1000
- 100-meter Dash = +5 HP
- Burpees 3×10 = +15 HP

### Stamina (STA) - HP Limit: 100/200/300/500/700/1000
- 1 km Distance = +5 HP
- Breath Box 5×4 = +3 HP

### Perception (SEN) - HP Limit: 500/600/700/900/1100/1400
- Shadow Boxing 1 round = +5 HP (Daily 4 rounds recommended)
- Yoga Session = +5 HP

## Stat Limits by Rank

| Rank | STR | AGI | STA | SEN |
|------|-----|-----|-----|-----|
| E    | 150 | 100 | 100 | 500 |
| D    | 200 | 200 | 200 | 600 |
| C    | 300 | 300 | 300 | 700 |
| B    | 500 | 500 | 500 | 900 |
| A    | 700 | 700 | 700 | 1100 |
| S    | 1000| 1000| 1000| 1400|

## System Rules (Complete Ruleset)

### RULE 0 — SYSTEM AUTHORITY
The System has absolute authority. Mood, motivation, excuses, or opinions do not override rules.

### RULE 1 — RANK-UP CONDITION
- Rank increases only after ALL stats reach their EXP threshold
- One incomplete stat = rank locked
- System progression is sequential and unbreakable

### RULE 2 — NO RESET RULE
- After rank-up, EXP resets to 0
- Stats do not reset to 0
- Only EXP requirements and stat limits increase

### RULE 3 — DAILY LOG RULE
- Daily system log is mandatory
- Workout without a log = invalid workout
- Memory-based claims ("I did it") = invalid
- Maximum one log per day

### RULE 4 — MISSED DAY PENALTY
If a workout day is missed without valid reason:
- All stats −10 HP
- Next day workload +30% (only for that day)
- Current streak reset to 0
- No exception

### RULE 5 — VALID SKIP CONDITIONS
A skip is valid only if:
- Fever or injury
- Exam or genuine emergency
- Maximum 2 valid skips per month
- Valid skip = no HP loss, but no HP gain

### RULE 6 — NO DOUBLE COUNT RULE
- One activity can increase only one stat
- No exercise can increase multiple stats
- Any double-count attempt = system violation

### RULE 7 — DAILY COMPLETION RULE
A day is considered "completed" only if:
- Planned exercises for the day are fully completed
- Partial effort = failure

### RULE 8 — PAIN AUTHORITY RULE
- Muscle fatigue/burn = allowed
- Joint pain or sharp pain = stat gain disabled for that day
- Ignoring pain = rule violation

### RULE 9 — NO RANK RUSH RULE
- Delayed rank-up is not failure
- Overtraining to rank up faster = rule break
- Long-term survival > short-term progress

### RULE 10 — STREAK RULE
A streak counts only if:
- Workout completed
- Log written
- No active penalty
- Any violation = streak reset

### RULE 11 — DISCIPLINE OVER PERFORMANCE
- Low performance with rule compliance = valid
- High performance with rule violation = invalid
- The System rewards obedience, not ego

### RULE 12 — WEEKLY AUDIT RULE
Every 7th day:
- Review stats
- Review penalties
- Plan next week
- Skipping audit = rank locked for next week

### RULE 13 — SYSTEM HONESTY RULE
- Lying to the System = self-failure
- Fake reps or fake logs = system breach
- The System is only as strong as user honesty

### RULE 14 — TERMINATION RULE
If repeated violations occur (3+ consecutive):
- System is paused for 7 days
- No HP gain allowed during pause
- Discipline must be re-established before resuming

### RULE 15 — AUTOMATED DAILY TASK RULE
- The System may assign one Automated Daily Task at any time during the day
- The task is non-scripted, random, and unpredictable
- Task difficulty is proportional to current rank
- Must be completed within the same day
- Partial completion = failure
- Failure consequence: Streak reset, no HP gain, EXP -10

### RULE 22 — DAILY BOOK READING RULE
- Daily book reading is mandatory
- Reading must be: intentional, undistracted, from a real book
- Social media, summaries, or reels do not count
- Reading must be logged daily with: book name, pages/duration
- Failure consequences: No HP gain, streak reset
- Valid exceptions: Same as workout skip rules

## UI & System Design Rules

### UI RULE 1 — SYSTEM-FIRST PRESENCE
- UI feels like an independent authority
- UI never asks questions ("Do you want to…?")
- UI only states facts, orders, and results

### UI RULE 2 — MINIMAL VISUAL LANGUAGE
- Minimal text, no decoration without function
- No emojis, avatars, or playful elements
- Every element must answer one question only

### UI RULE 3 — BLACK-BOX LOGIC
- System never explains why a task appeared
- No probability indicators
- No hints about future events

### UI RULE 4 — CONDITIONAL VISIBILITY
- UI hides information unless earned or relevant
- Stats, streaks, or progress may disappear at higher ranks
- Silence is an intentional UI state

### UI RULE 5 — BINARY STATES ONLY
UI elements must be binary:
- Complete / Incomplete
- Allowed / Locked
- Active / Paused
- ❌ No sliders, "almost done", or partial bars

### UI RULE 6 — NO REAL-TIME GRATIFICATION
- No instant praise, "Good job" messages
- No confetti, sounds, or celebratory animations
- System responses: TASK COMPLETED, NO VIOLATION DETECTED, PROGRESS DENIED

### UI RULE 7 — DELAYED FEEDBACK RULE
- Results may appear later, not immediately
- Rank-up confirmation can be delayed
- HP updates may show only at day close or audit

### UI RULE 8 — SYSTEM LANGUAGE STYLE
System language must be: Short, Cold, Declarative
Examples:
- RANK UP APPROVED
- TASK FAILED
- STREAK RESET
- NO ACTION REQUIRED

### UI RULE 9 — EVENT-DRIVEN APPEARANCE
UI changes only when an event occurs:
- Task assigned
- Task failed
- Rank-up approved
- Penalty applied
- Silence = stability

### UI RULE 10 — INTERRUPTION AUTHORITY
- System can interrupt the day with Automated Task or Boss Encounter
- Interruption overrides current screen or plan
- The System does not wait for convenience

## System Work Rules (Behavioral Logic)

### SYSTEM RULE A — TASK BEFORE STATS
- Tasks are evaluated before stats
- Stats update only if all relevant tasks are valid
- Task failure blocks stat gain

### SYSTEM RULE B — FAIL-CLOSED LOGIC
- Missing data = failure
- Missing log = task not done
- Unclear completion = invalid
- System assumes non-compliance by default

### SYSTEM RULE C — EVENT HIERARCHY
Priority order:
1. Boss Encounter
2. Automated Daily Task
3. Planned Training
4. Reading Task

### SYSTEM RULE D — SILENCE ESCALATION
- Higher rank = less feedback
- At A–S rank: HP hidden, progress assumed, only violations shown
- The System fades, discipline remains

### SYSTEM RULE E — IRREVERSIBILITY
- Submitted logs cannot be edited
- Applied penalties cannot be undone
- Rank history is permanent
- No rewind. No reload.

### SYSTEM RULE F — NO META ACCESS
- User cannot see randomization logic, future tasks, or probability tables
- Breaking immersion = system failure

### SYSTEM RULE G — CONSEQUENCE OVER REWARD
- System rarely rewards
- System frequently removes privileges
- Progress denial is the primary control mechanism

## UI Theme & Visual Design

### Color Authority
- Primary colors: Black, Dark Grey, Deep Blue/Violet accents
- Bright colors only for: Violation, Boss Encounter, Rank-Up Confirmation
- Bright color = danger or authority, never decoration

### Darkness Default
- UI defaults to dark mode
- Light backgrounds forbidden
- Darkness represents: Unknown future, Hidden progress, System dominance

### Typography Law
- Fonts: Sans-serif, sharp, condensed, readable
- No rounded, playful, or handwritten fonts
- ALL CAPS for system messages
- Normal case for logs only

### Minimal Animation
- Animations: Slow, Linear, Purpose-driven
- No bounce, pop, or fun motion
- Allowed: Fade in, fade out, delayed reveal
- Movement should feel heavy, not exciting

### Sparse Information Density
- White space replaced with dark empty space
- UI should feel unfinished, even when complete
- Empty space = pressure

### Rank-Based Visual Restriction
As rank increases:
- E–D: Stats visible
- C–B: Partial stats
- A–S: Stats hidden
- Power removes the need for visibility

### Alert Priority Coloring
- Red → Violation / Failure
- Purple → Boss Encounter
- Blue → Rank-related info
- Grey → Neutral state

### No Customization
- User cannot change theme, colors, or layout
- System appearance is fixed
- Control over appearance = loss of authority

## Core Philosophy

**"The UI must feel like an entity, not an app."**

If the user feels:
- ❌ Comfortable
- ❌ Motivated
- ❌ Entertained

If the user should feel:
- ✅ Watched
- ✅ Pressured
- ✅ Accountable

**"If the UI feels comfortable, the system is failing."**

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool
- **CSS3**: Styling with custom properties
- **GSAP**: For animations (via CDN)
- **localStorage**: Data persistence

## Recent Updates (February 2026)

### Exponential EXP System
- Replaced stat limit-based rank-up with EXP requirement system
- Each rank requires progressive EXP: E(100) → D(150) → C(300) → B(600) → A(1200) → S(2400)
- Total 4,750 EXP needed to reach S-rank from E-rank
- With average 6-7 EXP per day, approximately 2 years of consistent training to reach S-rank

### One Log Per Day
- Users can now only submit one training log per day
- Attempting multiple logs per day returns error: "LOG ALREADY SUBMITTED TODAY"
- Prevents exploitation and maintains game balance

### EXP Penalties for Forgotten Tasks
- Forgetting automated daily tasks now deducts 10 EXP from current rank progress
- Creates consequence for missing assigned challenges
- Streak is reset on task failure

### Rank Degradation System
- If users skip training for an entire month (30+ skip days), their rank automatically drops
- Rank drop occurs on the first day of the following month
- EXP resets to 0 when rank drops
- Stat limits adjust to the lower rank
- Violation is logged for records

### Rank-Based Task Difficulty
- Automated tasks now scale based on player rank
- E-Rank: Beginner challenges (2 min planks, 50 burpees, basic meditation)
- D-Rank: Intermediate challenges (3 min planks, 75 burpees, ice baths)
- C-Rank: Advanced challenges (5 min planks, 100 burpees, 30 min meditation)
- B-Rank: Expert challenges (7 min planks, 150 burpees, advanced variations)
- A-Rank: Master challenges (10 min planks, 200 burpees, 60 min meditation)
- S-Rank: Ultimate challenges (15 min planks, 300 burpees, 90 min meditation)
- Each rank tier has 10 unique tasks with progressive difficulty

## Changelog

### Version 1.1.0 - February 4, 2026

#### New Features
- **Exponential EXP System**: Implemented EXP-based rank progression (Date: Feb 4, 2026)
  - File: `services/SystemBackend.js`
  - Added `RANK_EXP_REQUIREMENTS` object with scaling requirements
  - Added `currentExp` field to state for tracking
  - Modified `checkRankUp()` to use EXP instead of stat limits
  - Updated `processLog()` to accumulate EXP

- **One Log Per Day Limit**: Added daily log submission restriction (Date: Feb 4, 2026)
  - File: `services/SystemBackend.js`
  - Added `lastLogDate` field to state
  - Added validation check in `processLog()` method
  - Returns error if user attempts multiple logs on same day

- **EXP Penalty System**: Implemented EXP deduction for forgotten tasks (Date: Feb 4, 2026)
  - File: `services/SystemBackend.js`
  - Modified automated task failure handling
  - Deducts 10 EXP when task is not completed
  - Added penalty message to user feedback

- **Rank Degradation**: Implemented automatic rank drop for month-long skips (Date: Feb 4, 2026)
  - File: `services/SystemBackend.js`
  - Added `dropRank()` method
  - Modified `resetMonthlySkips()` to trigger rank drop
  - Checks for 30+ skip days at month boundary
  - Resets EXP and adjusts stat limits

- **Rank-Based Task Difficulty**: Tasks now scale with player rank (Date: Feb 4, 2026)
  - File: `services/SystemBackend.js`
  - Converted `AUTOMATED_TASKS` from array to object with rank keys
  - Added 10 unique tasks per rank (E, D, C, B, A, S)
  - Modified `generateAutomatedTask()` to select tasks by current rank
  - Tasks increase in difficulty: duration, reps, and mental focus

#### Documentation Updates
- Updated README.md with new features and system mechanics (Date: Feb 4, 2026)
- Added detailed explanation of EXP progression system
- Documented 2-year path to S-rank achievement
- Added section explaining all balance changes

### Version 1.0.0 - Initial Release

#### Core Features
- EXP-based rank system (E-rank to S-rank)
- Stat tracking (Strength, Agility, Stamina, Perception)
- Daily customizable training targets
- Training log submission
- Weekly audits
- Violation and penalty system
- LocalStorage persistence
- React component-based architecture

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool
- **CSS3**: Styling with custom properties
- **GSAP**: For animations (via CDN)
- **localStorage**: Data persistence

## Migration Notes

This React version maintains all functionality from the original vanilla JS version:
- Same stat limits and calculations
- Identical violation and penalty system
- Same localStorage structure
- All features and edge cases preserved

The main improvements are:
- Component-based architecture
- Better state management
- Reusable components
- Easier to maintain and extend
- Better performance with React's rendering optimization
