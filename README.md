# Roulette Analytics Engine - Product Specification

## Project Overview

A multi-table roulette tracking and statistical analytics application for European (Single-Zero) and US (Single and Double Zero) roulette wheels. The app allows users to:
- Register and manage multiple casino tables simultaneously
- Input winning numbers via a visual betting layout
- Calculate real-time statistical distributions
- Track personal betting performance separately from table trends
- Detect betting patterns from the last 3 spins
- Persist session data locally with timestamps

**Target Platforms:** Web (initial), then Mobile (iOS/Android via React Native or Flutter)

**Monetization:** Paid app (€1-5) or Freemium model with in-app purchases

---

## 1. Roulette Wheel Data Model

### Wheel Properties

Every number (0-36) maps to:
- **Color:** Red, Black, or Green (0 only)
- **Range:** Low (1-18), High (19-36), or Zero (0)
- **Dozen:** 1st (1-12), 2nd (13-24), 3rd (25-36), or 0
- **Racetrack Section:** One of: tier, orphelins, zeroSpiel, voisins

### Racetrack Sections

- **Tier du Cylindre:** 6, 11, 13, 14, 16, 18, 20, 22, 24, 27, 30, 33, 36
- **Orphelins:** 1, 9, 14, 17, 20, 31, 34
- **Zero Spiel:** 0, 3, 12, 15, 26, 32, 35
- **Voisins du Zéro:** 2, 4, 5, 7, 8, 10, 19, 21, 23, 25, 28, 29, 31 (also includes Zero Spiel for percentage calculations)

---

## 2. Data Structures

### Session
```
sessionId: unique identifier with timestamp
sessionName: user-provided name (e.g., "Monaco Trip")
startTimestamp: ISO format timestamp
endTimestamp: ISO format timestamp (when session was closed)
isPersistent: boolean (true if user chose to save)
isCompleted: boolean (true when user ended the session)
tables: dictionary of registered tables
sessionNotes: optional string (user summary of the day)
```

### Table
```
activeBets: array of numbers currently selected on the felt
spinHistory: array of all winning numbers that landed (global table data)
personalActivity: array of individual bet outcomes
isCompleted: boolean (true when user finishes playing at this table)
completionTimestamp: ISO timestamp (when table was marked complete)
betAmount: optional number (per-bet unit amount for earnings calculation)
sessionNotes: optional string (user notes about this table)
```

### Personal Activity Entry
```
spinOutcome: winning number that landed
betPlaced: boolean (user had active bets)
isWin: boolean (user's selection matched outcome)
numbersCovered: array of numbers the user selected (bet selections)
timestamp: ISO format
isClickable: true (user can click entry to view details and replay bets)
```

Each entry represents one spin and stores the user's exact bet selections, allowing them to review and replay past betting decisions.

---

## 3. Earnings & Losses Tracking (Optional)

Users can optionally set a bet amount per table to calculate actual monetary gains/losses:

### Table-Level Earnings
- User sets bet amount (e.g., €10 per spin)
- System calculates:
  - **Total Wagered:** (total bets placed) × (bet amount)
  - **Wins Amount:** (winning bets) × (bet amount) × (payout ratio)
  - **Losses Amount:** (losing bets) × (bet amount)
  - **Net Gain/Loss:** Wins - Total Wagered
  - **ROI %:** (Net Gain/Loss / Total Wagered) × 100

### Session-Level Earnings
- Aggregate earnings/losses across all tables played
- Show combined P&L for the entire session
- Display in session summary report

### Notes
- This is optional; users can track statistics without monetary amounts
- Roulette payout assumptions (1:1 for color bets, 1:2 for dozen bets, etc.)
- Displayed in session and table completion reports

---

## 4. Statistical Metrics

### Live Table Statistics

Calculate for each metric using spinHistory:

**Colors:**
- Red %: (red count / total) × 100
- Black %: (black count / total) × 100
- Green %: (green count / total) × 100

**Ranges:**
- Low (1-18) %: (low count / total) × 100
- High (19-36) %: (high count / total) × 100

**Dozens:**
- 1st Dozen (1-12) %
- 2nd Dozen (13-24) %
- 3rd Dozen (25-36) %

**Racetrack Sections:**
- Zero Spiel %
- Orphelins %
- Tier du Cylindre %
- Voisins du Zéro % (includes zeroSpiel + voisins)

### Personal Performance Metrics

- **Win Rate %:** (wins / total bets) × 100
- **Total Bets Placed:** Count of spins where personalActivity.betPlaced = true
- **Betting Ledger:** Chronological list of all spins with:
  - Numbers the user bet on (numbersCovered)
  - The winning number that landed (spinOutcome)
  - Win/Loss/Skip status with indicators (🎯 WIN, ❌ LOSS, ⏭️ SKIPPED)
  - Timestamp
  - **Clickable entries:** User can click any entry to review and replay that specific spin with bets shown on felt

---

## 5. Pattern Detection (Last 3 Spins)

Automatically detect and alert on trailing 3-spin patterns:

- **Red Streak:** 3 consecutive red numbers
- **Black Streak:** 3 consecutive black numbers
- **High Block:** All 3 in High range (19-36)
- **Low Block:** All 3 in Low range (1-18)
- **Orphelins Flare:** 2+ of 3 in Orphelins section
- **Tier Activity:** 2+ of 3 in Tier du Cylindre
- **Odd Streak:** All 3 numbers are odd
- **Even Streak:** All 3 numbers are even (excluding 0)
- **Alternating Colors:** R-B-R or B-R-B sequence

Display alerts prominently in green when patterns are detected.

---

## 6. User Interface Specification

### Layout Structure

**Header**
- App title
- Current session name with start time
- Total logged spins for active table
- Button: "+ Register New Table"
- Button: "Complete Table" (finish playing at current table, generate table report)
- Button: "End Session" (finish for the day, generate session summary)

**Navigation Tabs**
- Horizontal scrollable tabs showing all tables: "Table Name (X spins)"
- Visual indicator for table status:
  - Active tables: normal styling
  - Completed tables: grayed out or badge showing "✓ Completed"
- Highlight currently active table
- Allow switching between tables (click to resume table play)

**Left Panel: Betting Input**
- Visual representation of roulette felt layout (3×12 grid)
- 0 button spans full width (green)
- Numbers 1-36 in correct order with correct colors (red/black)
- Visual indicator on selected numbers (coin icon or highlight)
- "Clear Layout" button to deselect all bets
- "Confirm Winning Number" button to log result
- Recent history: display last 10 spins as colored circles (clickable to replay)
- When user clicks a recent history spin or betting ledger entry:
  - Show that spin's bet selections highlighted on the felt
  - Display the winning number outcome
  - Show win/loss status

**Right Panel: Analytics Dashboard**
- View toggle: "📊 Global Table Trends" | "👤 My Performance"
- **Pattern Alerts Section** (highlighted, shows patterns from last 3 spins)
- **Global View:**
  - Progress bars for: Red, Black, Low, High, each Dozen, each Racetrack section
  - Show: label, percentage value, count
- **Personal View:**
  - Win/Loss ratio stat tile
  - Total bets placed stat tile
  - Betting ledger with all spins:
    - Each entry shows: numbers bet on, winning number, outcome indicator (🎯 WIN, ❌ LOSS, ⏭️ SKIPPED), timestamp
    - **Clickable entries:** Click any spin to replay and review that betting decision on the felt layout
    - Chronological order (newest first)

### Color Scheme
- Background dark: #121824
- Panel dark: #1e293b
- Accent green: #10b981
- Roulette red: #ef4444
- Roulette black: #1e293b
- Text main: #f8fafc
- Text muted: #94a3b8

---

## 7. Application Flow

### On App Launch
1. Ask: "Save today's activity?"
   - **No** → Temporary mode (data clears when app closes)
   - **Yes** → Prompt for session name → Create session with timestamp
2. Display empty dashboard
3. Show session info (name, start time) in header

### Table Registration
1. User clicks "+ Register New Table"
2. Prompt for table name/identifier
3. Validate name is unique in current session
4. Create table with empty arrays
5. Add to navigation tabs
6. Switch to new table

### Table Switching & Multi-Table Play
1. User can click any table tab to switch between active tables
2. When switching:
   - Previous table state is saved (activeBets, spinHistory, personalActivity)
   - New table loads with all its historical data
   - Analytics and recent history update for the new table
3. User can play multiple tables simultaneously, switching back and forth
4. Each table maintains independent statistics and history

### Table Completion & Analysis
1. When user finishes playing at a table, they can click "Complete Table" button
2. System generates Table Completion Report:
   - **Total Spins:** Number of spins recorded at this table
   - **Bets Placed:** Total number of bets made
   - **Win Rate:** Percentage of winning bets
   - **Total Wins:** Count of winning bets
   - **Total Losses:** Count of losing bets
   - **Skipped Spins:** Spins where no bets were placed
   - **Betting Breakdown:** Stats by color (Red/Black), range (High/Low), dozen, section
   - **Timestamp:** When table was completed
   - **Option to Export:** PDF/CSV export of table data
3. User can:
   - Archive the completed table
   - Review it later
   - Continue adding bets if needed (reopen table)
4. Completed tables remain visible in history

### Number Entry Flow
1. User taps numbers on felt to select current bets
2. Visual feedback shows selected numbers
3. User clicks "Confirm Winning Number"
   - If 1 number selected: use as winning number
   - If multiple numbers: prompt "Which number actually won?"
4. App:
   - Adds number to spinHistory
   - Records personalActivity entry (betPlaced, isWin status, numbersCovered)
   - Keeps felt layout visible with just-logged bets
   - Recalculates all percentages
   - Detects patterns from last 3
   - Updates UI
5. Ready for next spin

### Betting History & Review Flow
1. User can view betting history in two ways:
   - Click a colored circle in "Recent History" (last 10 spins)
   - Click an entry in "Betting Ledger" (all spins with details)
2. When user clicks a past spin:
   - Felt layout shows exactly which numbers they bet on (highlighted)
   - Display shows the winning number that landed
   - Win/Loss status is clearly indicated
   - User can see timestamp of that spin
3. User can analyze patterns by reviewing multiple past spins
4. Betting history entries persist across sessions
5. User can use history to:
   - Verify past bets and outcomes
   - Identify betting patterns and strategies
   - Review performance over time
   - Export/share specific sessions

### Session Completion & Analysis
1. When user finishes for the day, they click "End Session" button
2. System generates Session Summary Report:
   - **Session Name & Date:** Session identifier with start/end timestamps
   - **Total Playing Time:** Duration from session start to end
   - **Tables Played:** List of all tables with spins per table
   - **Overall Statistics:**
     - Total spins across all tables
     - Total bets placed across all tables
     - Combined win rate %
     - Total wins vs losses
   - **Table-by-Table Breakdown:**
     - Table name → wins/losses/skipped → win rate %
   - **Performance Metrics:**
     - Best performing table (highest win rate)
     - Most active table (most spins)
     - Betting patterns (most favored numbers, sections, ranges)
   - **Visual Charts:**
     - Win/Loss distribution pie chart
     - Table performance comparison
     - Betting pattern heatmap (which numbers were bet on most)
3. User can:
   - View detailed session report
   - Export report (PDF/CSV)
   - Share/print report
   - Add notes to session
4. Session is locked for editing (read-only for review)
5. User can start a new session for the next casino visit

### Data Persistence
- Save entire session to localStorage (web) or device database (mobile)
- Auto-save after each change
- Load saved sessions on app startup
- Allow viewing/exporting previous sessions
- Keep completed tables and sessions for historical reference

---

## 8. Technical Requirements

### State Management
- Keep active session in memory: sessionId, tables object
- tables object: key = table name, value = {activeBets, spinHistory, personalActivity}
- Track currentActiveTable to know which table to update

### Calculations
- Run after each spin is confirmed
- Calculate all 12 metrics in one pass through spinHistory
- Format percentages to 1 decimal place

### Pattern Detection
- After each spin, check spinHistory.slice(-3)
- Run against all 9 pattern rules
- Display matching patterns in alerts section

### Rendering
- Update progress bars in real-time
- Refresh pattern alerts
- Update personal activity ledger
- Update recent history display

### Storage
- **Web:** localStorage with JSON serialization
- **Mobile:** SQLite or native database
- Store structure: sessions[sessionId] = complete session object

---

## 9. Platform & App Store Requirements

### Web Version
- Single-page application (React/Vue/vanilla JS)
- Responsive design for desktop and mobile browsers
- localStorage for persistence

### Mobile Version (React Native / Flutter)
- Touch-optimized UI
- Device storage (SQLite)
- Session import/export for cloud sync
- Optimized for phone screen dimensions

### Google Play Store Compliance
- **Critical:** Frame as "Statistical Analysis Tool" NOT gambling app
- NO simulated wheel spinning
- NO virtual chips or betting mechanics
- NO claims like "win money" or "beat the house"
- Description focus: "Analyze Roulette Outcomes" and "Probability Statistics"
- Content rating: Everyone or Teen
- Pricing: €1.99 - €4.99

---

## 10. Development Phases

**Phase 1: MVP**
- Wheel data model
- Multi-table management
- Spin logging
- Percentage calculations
- Basic felt layout UI
- localStorage persistence

**Phase 2: Analytics**
- All 12 statistical metrics
- Pattern detection
- Personal performance tracking
- View toggle (table / personal)
- Betting ledger display with clickable entries
- Betting history replay (click to see past bets on felt)

**Phase 3: Table & Session Completion**
- "Complete Table" button with table summary report
- "End Session" button with session summary report
- Table status indicators (active/completed)
- Optional earnings/loss tracking (betting amount per table)
- Report export (PDF/CSV)

**Phase 4: Mobile & Store**
- Responsive refinement
- Native mobile build
- Export/import sessions
- Publish to Play Store

---

## 11. Additional Features (Future)

- Cloud sync across devices
- Session statistics export (PDF/CSV)
- Multiple currency support
- Historical session comparison
- Notes/comments on sessions
- Offline mode
- Dark/Light theme toggle

