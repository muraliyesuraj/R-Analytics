# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Roulette Analytics Engine** – A React Native mobile app (iOS & Android, MVP) for tracking European/US roulette wheel outcomes, calculating real-time statistical distributions, and analyzing personal betting performance. Users track spins across multiple tables, view live statistics, and review betting history on their mobile device.

**MVP Scope**: Core tracking, 12 statistical metrics, multi-table support, touch-optimized UI, device storage persistence.

**Future Phases**: Pattern detection (Phase 2), session reports (Phase 3), cloud sync (Phase 4).

See `README.md` for the complete product specification, `DEVELOPMENT.md` for setup instructions, and `IMPLEMENTATION_PLAN.md` for detailed roadmap.

---

## Architecture & Key Concepts

### Core Data Model

The app manages three primary entities:

1. **Session** – Container for a day's play; persists to localStorage/device DB
   - `sessionId`, `sessionName`, `startTimestamp`, `endTimestamp`
   - `tables`: dict of Table objects indexed by name
   - `isPersistent`, `isCompleted`, `sessionNotes`

2. **Table** – Represents a single roulette table; user tracks multiple tables in one session
   - `activeBets`: array of currently selected numbers (1-36, 0)
   - `spinHistory`: array of all winning numbers logged (global table data)
   - `personalActivity`: array of PersonalActivityEntry (user's bet outcomes)
   - `betAmount`, `sessionNotes`, `isCompleted`, `completionTimestamp`

3. **PersonalActivityEntry** – One spin event
   - `spinOutcome`: winning number
   - `betPlaced`, `isWin`: boolean status
   - `numbersCovered`: array of user's bet selections
   - `timestamp`, `isClickable`

### Wheel Properties

Every number (0-36) has fixed attributes:
- **Color**: Red, Black, or Green (0 only)
- **Range**: Low (1-18), High (19-36), or Zero
- **Dozen**: 1st (1-12), 2nd (13-24), 3rd (25-36)
- **Racetrack Section**: tier, orphelins, zeroSpiel, voisins

Create a lookup table (Map or object) at app initialization to avoid recalculating on every spin.

### Metrics Calculation Pipeline

After each spin is confirmed:
1. Append spinOutcome to spinHistory
2. Record PersonalActivityEntry (compare betPlaced numbers to spinOutcome for isWin)
3. Recalculate all 12 metrics in one pass:
   - **Colors**: Red %, Black %, Green %
   - **Ranges**: Low %, High %
   - **Dozens**: 1st, 2nd, 3rd %
   - **Racetrack**: ZeroSpiel %, Orphelins %, Tier %, Voisins %
4. Detect patterns from `spinHistory.slice(-3)` against 9 pattern rules
5. Update UI (progress bars, pattern alerts, betting ledger)

Format percentages to 1 decimal place. Avoid recalculating on render—run metrics once after state change.

### Pattern Detection

After each spin, check the last 3 spins against these patterns (display when matched):
- Red/Black/Odd/Even streaks
- High/Low blocks (ranges)
- Orphelins/Tier clustering (2+ of 3)
- Alternating colors (R-B-R or B-R-B)

---

## UI Structure

**Left Panel**: Felt layout (3×12 grid, 0 full-width green top) + recent history circles (last 10)
**Right Panel**: Analytics (toggle: "Global Table Trends" ↔ "My Performance") + pattern alerts + ledger
**Header**: Session info, table tabs, "+ Register Table", "Complete Table", "End Session" buttons

Key interaction: Click any history circle or ledger entry to replay bets on felt (highlight selected numbers, show outcome).

---

## Development Phases

**Phase 1 (MVP)**: Wheel model, multi-table mgmt, spin logging, % calculations, felt UI, localStorage
**Phase 2 (Analytics)**: All 12 metrics, pattern detection, personal performance, ledger with replay
**Phase 3 (Completion)**: Table/session reports, earnings tracking, export (PDF/CSV)
**Phase 4 (Mobile)**: React Native/Flutter build, Play Store compliance

Currently (as of your request): **No implementation yet**—specification phase only.

---

## Technical Decisions & Constraints

### State Management
- Keep active session in memory; persist to localStorage after each change
- Single `currentActiveTable` variable to track which table is displayed
- Auto-save on every spin confirm and table switch

### Store Compliance (Phase 3+)
- Frame as "Statistical Analysis Tool", not gambling app
- NO simulated wheel spinning, NO virtual chips
- NO "win money" language in descriptions
- Content rating: Everyone or Teen

### Optional Features
- Earnings/loss tracking (per-table `betAmount`, calculates ROI)
- Session notes and table notes
- Export to PDF/CSV (Phase 3)

---

## When Code Arrives

Once implementation begins:
1. Create a wheel property lookup (e.g., `WHEEL_PROPERTIES` map) to avoid hardcoding color/range/dozen/racetrack per number
2. Build metrics calculator as a pure function: `calculateMetrics(spinHistory) → {colors, ranges, dozens, racetrack}`
3. Implement pattern detector as array of pattern rules: `detectPatterns(lastThreeSpins) → [matching patterns]`
4. Separate state management (session/tables/personalActivity) from UI rendering
5. Use table name as key for tables dict; validate uniqueness on registration
6. Timestamp everything (ISO format) for session replay and historical analysis

---

## Resources

- **Product Spec**: README.md (comprehensive, includes UI colors, flow diagrams, all data structures)
- **Dev Environment**: TBD (framework, build tool, testing setup)
