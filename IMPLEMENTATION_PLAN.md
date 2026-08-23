# Roulette Analytics Engine – Implementation Plan

**Project**: Roulette Analytics Engine (Web MVP)  
**Target**: Phase 1 completion (core tracking, statistics, multi-table support)  
**Status**: Planning → Development  
**Last Updated**: 2026-07-30

---

## Table of Contents

1. [Phase Overview](#phase-overview)
2. [Project Setup (Week 1)](#phase-0-project-setup-week-1)
3. [Phase 1: Core MVP (Weeks 2-4)](#phase-1-core-mvp-weeks-2-4)
4. [Testing & QA (Week 5)](#testing--qa-week-5)
5. [Deployment Readiness (Week 6)](#deployment-readiness-week-6)
6. [File Structure](#file-structure)
7. [Technology Stack](#technology-stack)
8. [Key Milestones & Checkpoints](#key-milestones--checkpoints)

---

## Phase Overview

### MVP Scope (Phase 1) – React Native Mobile App
- ✅ Multi-table session management
- ✅ Spin logging and number entry
- ✅ Basic statistical calculations (12 metrics)
- ✅ Visual felt layout (3×12 grid, touch-optimized)
- ✅ Recent spin history (last 10, swipeable)
- ✅ Device storage persistence (AsyncStorage)
- ✅ Table switching and management
- ✅ iOS & Android simultaneous support via React Native

### Out of Scope for MVP
- ❌ Pattern detection (Phase 2)
- ❌ Personal performance ledger (Phase 2)
- ❌ Session/table completion reports (Phase 3)
- ❌ Earnings tracking (Phase 3)
- ❌ Export/PDF (Phase 3)
- ❌ Web version (future, if needed)
- ❌ Cloud sync (Phase 4)

---

## Phase 0: Project Setup (Week 1)

### 0.1 Initialize React Native Project with Expo

**Tasks:**
- [ ] Create new Expo project:
  ```bash
  npx create-expo-app@latest RoulettApp --template
  cd RoulettApp
  ```
- [ ] Install dependencies:
  - Framework: **React Native 0.72+** + **Expo**
  - State: **Zustand** or **Context API** (lightweight)
  - Styling: **NativeWind** (Tailwind for React Native)
  - Storage: **AsyncStorage** (device storage)
  - Navigation: **React Navigation** (tab navigation)
  - Testing: **Jest** + **React Native Testing Library**
  - Linting: **ESLint** + **Prettier**
  
  ```bash
  npm install react-native-reanimated react-native-screens react-navigation react-navigation-bottom-tabs
  npm install zustand async-storage nativewind
  npm install --save-dev @testing-library/react-native jest @react-native-async-storage/async-storage
  ```

- [ ] Create `.gitignore` (Expo-specific)
- [ ] Create `tsconfig.json` for TypeScript
- [ ] Initialize Git repository

**Deliverable:**
```
app.json (Expo config)
package.json
tsconfig.json
.gitignore
eas.json (EAS Build config, optional)
```

**Verify**:
```bash
npm start
# Scans QR code with Expo Go app on physical device
# Or use iOS Simulator / Android Emulator
```

### 0.2 Set Up Project Structure

**Tasks:**
- [ ] Create directory structure (see [File Structure](#file-structure))
- [ ] Create `src/` with `index.tsx`, `App.tsx`, `main.css`
- [ ] Create `src/types/` for TypeScript interfaces
- [ ] Create `src/data/` for constants and wheel properties
- [ ] Create `src/store/` for state management
- [ ] Create `src/components/` for UI components
- [ ] Create `src/utils/` for helper functions
- [ ] Create `src/__tests__/` for test files
- [ ] Create `public/` for static assets

**Deliverable:**
Full directory structure ready for implementation.

### 0.3 Define Core Types & Interfaces

**File:** `src/types/index.ts`

**Tasks:**
- [ ] Define `Session` interface
- [ ] Define `Table` interface
- [ ] Define `PersonalActivityEntry` interface
- [ ] Define `WheelNumber` interface
- [ ] Define `Metric` interface
- [ ] Define `Pattern` interface

**Example:**
```typescript
interface Session {
  sessionId: string;
  sessionName: string;
  startTimestamp: string;
  endTimestamp?: string;
  isPersistent: boolean;
  isCompleted: boolean;
  tables: Record<string, Table>;
  sessionNotes?: string;
}

interface Table {
  name: string;
  activeBets: number[];
  spinHistory: number[];
  personalActivity: PersonalActivityEntry[];
  isCompleted: boolean;
  completionTimestamp?: string;
  betAmount?: number;
  sessionNotes?: string;
}

interface PersonalActivityEntry {
  spinOutcome: number;
  betPlaced: boolean;
  isWin: boolean;
  numbersCovered: number[];
  timestamp: string;
  isClickable: boolean;
}

interface WheelNumber {
  number: number;
  color: 'red' | 'black' | 'green';
  range: 'low' | 'high' | 'zero';
  dozen: '1st' | '2nd' | '3rd' | 'zero';
  racetrack: 'tier' | 'orphelins' | 'zeroSpiel' | 'voisins' | null;
}

interface Metrics {
  colors: { red: number; black: number; green: number };
  ranges: { low: number; high: number };
  dozens: { first: number; second: number; third: number };
  racetrack: { tier: number; orphelins: number; zeroSpiel: number; voisins: number };
}
```

**Deliverable:**
`src/types/index.ts` with all interfaces documented.

### 0.4 Create Wheel Data Lookup

**File:** `src/data/wheelProperties.ts`

**Tasks:**
- [ ] Define WHEEL_PROPERTIES map (number → WheelNumber)
- [ ] Map all 37 numbers (0-36) with correct:
  - Color (Red/Black/Green)
  - Range (Low 1-18, High 19-36, Zero)
  - Dozen (1st 1-12, 2nd 13-24, 3rd 25-36, Zero)
  - Racetrack (Tier, Orphelins, ZeroSpiel, Voisins)

**Reference from README:**
- Red numbers: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
- Black numbers: 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35
- Green: 0
- Racetrack Tier du Cylindre: 6, 11, 13, 14, 16, 18, 20, 22, 24, 27, 30, 33, 36
- Racetrack Orphelins: 1, 9, 14, 17, 20, 31, 34
- Racetrack Zero Spiel: 0, 3, 12, 15, 26, 32, 35
- Racetrack Voisins du Zéro: 2, 4, 5, 7, 8, 10, 19, 21, 23, 25, 28, 29, 31

**Example:**
```typescript
export const WHEEL_PROPERTIES: Record<number, WheelNumber> = {
  0: { number: 0, color: 'green', range: 'zero', dozen: 'zero', racetrack: 'zeroSpiel' },
  1: { number: 1, color: 'red', range: 'low', dozen: '1st', racetrack: 'orphelins' },
  // ... all 37 numbers
};

export const getWheelNumber = (num: number): WheelNumber | null => {
  return WHEEL_PROPERTIES[num] ?? null;
};
```

**Deliverable:**
Complete `wheelProperties.ts` with all 37 numbers mapped.

### 0.5 Set Up State Management

**File:** `src/store/sessionStore.ts` (using Zustand or Context)

**Tasks:**
- [ ] Create session store with:
  - `currentSession: Session | null`
  - `currentTableName: string | null`
  - `setCurrentSession(session: Session)`
  - `setCurrentTableName(name: string)`
  - `addTable(name: string)`
  - `updateTable(name: string, table: Partial<Table>)`
  - `getActiveTable(): Table | null`
- [ ] Add persistence middleware (auto-save to localStorage)

**Deliverable:**
`src/store/sessionStore.ts` with full store setup.

### 0.6 Create Initial UI Scaffold

**Files:**
- `src/App.tsx`
- `src/components/Header.tsx`
- `src/components/LeftPanel.tsx`
- `src/components/RightPanel.tsx`

**Tasks:**
- [ ] Build `App.tsx` layout (three-column grid)
- [ ] Create Header with session info placeholder
- [ ] Create Left Panel with felt placeholder + recent history placeholder
- [ ] Create Right Panel with analytics placeholder
- [ ] Apply color scheme from README

**Deliverable:**
Wireframe layout with proper styling and responsive design.

---

## Phase 1: Core MVP (Weeks 2-4)

### 1.1 Implement Session Lifecycle

**Files:**
- `src/store/sessionStore.ts` (expand)
- `src/components/SessionModal.tsx`

**Tasks:**
- [ ] Create "New Session" modal
  - Prompt: "Save today's activity?" (Yes/No)
  - If Yes: prompt for session name
  - Create session with timestamp, isPersistent=true
  - Auto-save to localStorage
- [ ] Load saved sessions on app startup
- [ ] Display current session info in Header
- [ ] Implement "End Session" button (Phase 1: just lock session, no report)

**Checkpoint:**
- [ ] User can create new session or resume existing
- [ ] Session persists across page reloads
- [ ] Header shows current session name + start time

### 1.2 Implement Multi-Table Management

**Files:**
- `src/components/TableTabs.tsx`
- `src/components/RegisterTableModal.tsx`
- `src/store/sessionStore.ts` (expand)

**Tasks:**
- [ ] Create table tabs component (horizontal scrollable)
  - Show all tables with spin count
  - Highlight active table
  - Click to switch tables
- [ ] Implement "+ Register New Table" button + modal
  - Prompt for table name
  - Validate unique name
  - Create table with empty arrays
  - Add to session.tables
- [ ] Auto-save table state on switch
- [ ] Display "Active (X spins)" badge

**Checkpoint:**
- [ ] User can register multiple tables in one session
- [ ] Switching tables persists previous table state
- [ ] Table data survives page reload

### 1.3 Implement Felt Layout & Number Selection

**Files:**
- `src/components/FeltLayout.tsx`
- `src/components/NumberButton.tsx`
- `src/utils/feltLayout.ts`

**Tasks:**
- [ ] Create 3×12 grid component
  - 0 button (full width, green background)
  - Numbers 1-36 in correct order
  - Red/black colors per WHEEL_PROPERTIES
- [ ] Implement click-to-select for numbers
  - Visual feedback (coin icon or highlight)
  - Update `activeBets` in store
- [ ] Implement "Clear Layout" button (deselect all)
- [ ] Show active bets count

**Checkpoint:**
- [ ] Felt displays correctly (0 top, 1-36 in grid)
- [ ] Numbers are correct colors
- [ ] Clicking toggles selection state
- [ ] Visual feedback is clear

### 1.4 Implement Spin Logging & History

**Files:**
- `src/components/SpinConfirm.tsx`
- `src/utils/spinCalculator.ts`
- `src/store/sessionStore.ts` (expand)

**Tasks:**
- [ ] Create "Confirm Winning Number" button
  - If 1 number selected in activeBets: use as winner
  - If 0 or 2+ numbers selected: prompt "Which number won?"
- [ ] On confirmation:
  - Add winning number to `spinHistory`
  - Create PersonalActivityEntry (betPlaced=true/false, isWin=match, numbersCovered=activeBets)
  - Clear activeBets (reset felt)
  - Recalculate metrics (see 1.5)
  - Update recent history display
  - Auto-save
- [ ] Display recent 10 spins as colored circles (clickable)

**Checkpoint:**
- [ ] Spinning records data correctly
- [ ] Recent history shows last 10 spins with correct colors
- [ ] State persists on reload

### 1.5 Implement Metrics Calculation Engine

**Files:**
- `src/utils/metricsCalculator.ts`
- `src/store/sessionStore.ts` (expand)

**Tasks:**
- [ ] Create `calculateMetrics(spinHistory: number[]): Metrics` function
  - Iterate spinHistory once, count each metric
  - Calculate percentages (rounded to 1 decimal)
  - Return Metrics object
- [ ] Call after each spin confirmation
- [ ] Metrics to calculate (12 total):
  - **Colors**: Red %, Black %, Green %
  - **Ranges**: Low %, High %
  - **Dozens**: 1st %, 2nd %, 3rd %
  - **Racetrack**: ZeroSpiel %, Orphelins %, Tier %, Voisins %

**Formula Example:**
```
Red % = (red count / total spins) × 100
```

**Checkpoint:**
- [ ] Metrics calculate correctly for test data
- [ ] Percentages display to 1 decimal place
- [ ] Calculation is fast (< 1ms for 1000 spins)

### 1.6 Implement Metrics Display (Progress Bars)

**Files:**
- `src/components/MetricsPanel.tsx`
- `src/components/ProgressBar.tsx`

**Tasks:**
- [ ] Create progress bar component (label, %, count)
- [ ] Display all 12 metrics with progress bars
- [ ] Update in real-time after each spin
- [ ] Use color scheme from README (accent green for bars)
- [ ] Group by category (Colors, Ranges, Dozens, Racetrack)

**Checkpoint:**
- [ ] All 12 metrics display correctly
- [ ] Bars update after each spin
- [ ] Layout is clean and readable

### 1.7 Implement Recent History & Replay

**Files:**
- `src/components/RecentHistory.tsx`
- `src/utils/historyReplay.ts`

**Tasks:**
- [ ] Display last 10 spins as colored circles
  - Color = roulette color of that spin
  - Clickable to replay
- [ ] On click: show bet selections on felt + outcome
  - Highlight numbers from `numbersCovered`
  - Show winning number in different style
  - Display timestamp
  - Show win/loss status
- [ ] Add "Clear History View" to return to current game

**Checkpoint:**
- [ ] Recent history displays correctly
- [ ] Clicking shows past bet state on felt
- [ ] User can click multiple times to review different spins

### 1.8 Implement Responsive Layout & Styling

**Files:**
- `src/main.css`
- All component files (add responsive classes)

**Tasks:**
- [ ] Apply Tailwind CSS classes to all components
- [ ] Use color scheme from README:
  - Background: #121824
  - Panel: #1e293b
  - Accent: #10b981
  - Roulette red: #ef4444
  - Text main: #f8fafc
  - Text muted: #94a3b8
- [ ] Make layout responsive (mobile/tablet/desktop)
- [ ] Test on different screen sizes

**Checkpoint:**
- [ ] App looks polished with correct colors
- [ ] Mobile responsive layout works
- [ ] No layout shifts or overflow issues

### 1.9 Implement localStorage Persistence

**Files:**
- `src/utils/storage.ts`
- `src/store/sessionStore.ts` (integrate)

**Tasks:**
- [ ] Create storage utility:
  - `saveSession(session: Session)`
  - `loadSession(sessionId: string): Session | null`
  - `getAllSessions(): Session[]`
  - `deleteSession(sessionId: string)`
- [ ] Add middleware to store to auto-save on every change
- [ ] Load saved sessions on app startup
- [ ] Show session list on first load (or "New Session" prompt)

**Checkpoint:**
- [ ] Sessions persist across page reloads
- [ ] Multiple sessions can be loaded/switched
- [ ] No data loss on browser crash

### 1.10 Create "Complete Table" Skeleton (No Report Yet)

**Files:**
- `src/components/CompleteTableModal.tsx`

**Tasks:**
- [ ] Add "Complete Table" button to Header
- [ ] Implement modal to mark table as completed
  - Confirm action
  - Set `isCompleted = true`
  - Set `completionTimestamp`
  - Disable further editing
  - Gray out table tab
- [ ] Phase 2/3: Add detailed report generation

**Checkpoint:**
- [ ] Tables can be marked complete
- [ ] Completed tables are visually distinct
- [ ] Completed tables persist

---

## Testing & QA (Week 5)

### 2.1 Unit Tests for Utilities

**Files:**
- `src/__tests__/metricsCalculator.test.ts`
- `src/__tests__/wheelProperties.test.ts`
- `src/__tests__/sessionStore.test.ts`

**Tasks:**
- [ ] Test `calculateMetrics()` with known spin sequences
- [ ] Test WHEEL_PROPERTIES for all 37 numbers
- [ ] Test session store mutations
- [ ] Test localStorage persistence
- [ ] Aim for 80%+ code coverage

**Checkpoint:**
- [ ] All utilities pass unit tests
- [ ] No edge cases missed

### 2.2 Component Tests

**Files:**
- `src/__tests__/FeltLayout.test.tsx`
- `src/__tests__/MetricsPanel.test.tsx`
- `src/__tests__/RecentHistory.test.tsx`

**Tasks:**
- [ ] Test felt layout renders all 37 numbers
- [ ] Test number selection works
- [ ] Test metrics display correct values
- [ ] Test recent history displays last 10 spins

**Checkpoint:**
- [ ] Components render correctly
- [ ] User interactions work as expected

### 2.3 Integration Tests

**Files:**
- `src/__tests__/integration.test.tsx`

**Tasks:**
- [ ] Test full flow: new session → add table → spin → metrics update
- [ ] Test table switching preserves state
- [ ] Test localStorage persistence
- [ ] Test replay functionality

**Checkpoint:**
- [ ] Full workflow works end-to-end
- [ ] No data loss or corruption

### 2.4 Cross-Platform QA Checklist

**iOS Testing:**
- [ ] iPhone Simulator (multiple sizes: SE, 12, Pro Max)
- [ ] Real iPhone device (recommended: iPhone 12 or newer)
- [ ] Safe Area rendering (notch/Dynamic Island handling)
- [ ] Swipe gestures (if used)
- [ ] Status bar layout
- [ ] Dark mode toggle (if implemented)
- [ ] App state transitions (background/foreground)

**Android Testing:**
- [ ] Android Emulator (Pixel 4, Pixel 6)
- [ ] Real Android device (recommended: Galaxy S21 or Pixel 6)
- [ ] Gesture navigation (Android 9+)
- [ ] System navigation buttons (Android 8)
- [ ] Large screen (tablet-like, if possible)
- [ ] Dark mode toggle
- [ ] Back button behavior
- [ ] App state transitions (background/foreground)

**Cross-Platform Checks (both platforms):**
- [ ] Felt layout displays correctly (colors, grid alignment)
- [ ] Numbers are correct colors (red, black, green)
- [ ] Touch targets are >= 44×44pt (tappable)
- [ ] Metrics calculate accurately
- [ ] Data persists after app restart
- [ ] Recent history displays last 10 spins
- [ ] Table switching works
- [ ] Performance: no lag with 100+ spins
- [ ] No console errors or crashes
- [ ] Buttons/modals respond to taps
- [ ] Text is readable (font size, contrast)

**Platform Parity:**
- [ ] Both platforms have same features
- [ ] Both show same calculations
- [ ] Both persist data identically
- [ ] Both UI layouts look similar (allowing for platform conventions)

**Checkpoint:**
- [ ] App is stable on both iOS and Android
- [ ] No platform-specific crashes
- [ ] Feature parity verified
- [ ] Performance acceptable on both platforms

---

## Deployment Readiness (Week 6)

### 3.1 Build Optimization (Both Platforms)

**Tasks:**
- [ ] Build iOS optimized bundle: `eas build --platform ios`
- [ ] Build Android optimized bundle: `eas build --platform android`
- [ ] Check app size (iOS target < 30MB, Android < 50MB)
- [ ] Test production build on real devices (not just simulators)
- [ ] Verify no console errors in production
- [ ] Test performance with 100+ spins
- [ ] Verify AsyncStorage data is encrypted on device

**Deliverable:**
- iOS .ipa file (from EAS)
- Android .aab file (from EAS)
- Both ready for app store submission

### 3.2 Documentation

**Tasks:**
- [ ] Update `CLAUDE.md` with project setup instructions
- [ ] Write `DEVELOPMENT.md` with:
  - How to run dev server: `npm run dev`
  - How to run tests: `npm test`
  - How to build: `npm run build`
  - Architecture overview (what was implemented)
- [ ] Create `TESTING.md` with testing strategy
- [ ] Document any environment variables needed

**Deliverable:**
- `DEVELOPMENT.md`
- `TESTING.md`
- Updated `CLAUDE.md`

### 3.3 Submit to App Stores (iOS & Android Simultaneously)

**Configuration (one-time setup):**
```json
{
  "expo": {
    "name": "Roulette Analytics",
    "ios": {
      "bundleIdentifier": "com.yourdomain.roulettapp",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourdomain.roulettapp",
      "versionCode": 1
    }
  }
}
```

**Submit to both stores in parallel:**
```bash
eas submit --platform ios &
eas submit --platform android &
wait  # Wait for both to complete
```

**Review timeline:**
- iOS: ~24-48 hours (Apple)
- Android: ~2-4 hours (Google)
- Both may request clarifications (respond same day)

**Post-submission:**
- Monitor Apple App Store Connect dashboard
- Monitor Google Play Console dashboard
- Handle any rejections or questions

**Deliverable:**
Both apps live on app stores, users can download on iOS and Android devices.

---

## File Structure (React Native)

```
/Users/my/develop/personal/R-Analytics/
├── CLAUDE.md                          # Architecture guidance
├── IMPLEMENTATION_PLAN.md             # This document
├── README.md                          # Product specification
├── DEVELOPMENT.md                     # Dev setup instructions
├── TESTING.md                         # Testing strategy
│
├── app.json                           # Expo app config
├── package.json
├── tsconfig.json
├── .gitignore
├── eas.json                           # EAS Build config (optional)
│
├── app/                               # Expo Router (or screens/ for Tab Navigator)
│   ├── _layout.tsx                    # Root layout + navigation
│   ├── index.tsx                      # Home screen (session/table management)
│   ├── table/
│   │   ├── [id].tsx                   # Table play screen
│   │   └── new.tsx                    # Register table screen
│   └── session/
│       ├── new.tsx                    # New session modal
│       └── list.tsx                   # Load existing sessions
│
├── src/
│   ├── types/
│   │   └── index.ts                   # All TypeScript interfaces
│   │
│   ├── data/
│   │   └── wheelProperties.ts         # WHEEL_PROPERTIES map (0-36)
│   │
│   ├── store/
│   │   └── sessionStore.ts            # Zustand state management
│   │
│   ├── utils/
│   │   ├── metricsCalculator.ts       # Calculate 12 metrics
│   │   ├── feltLayout.ts              # Felt grid utilities
│   │   ├── historyReplay.ts           # Spin replay logic
│   │   ├── storage.ts                 # AsyncStorage wrapper
│   │   └── helpers.ts                 # Generic helpers
│   │
│   ├── components/
│   │   ├── FeltLayout.tsx             # 3×12 grid (touch-optimized)
│   │   ├── NumberButton.tsx           # Individual number button
│   │   ├── RecentHistory.tsx          # Last 10 spins (horizontal scroll)
│   │   ├── MetricsPanel.tsx           # All 12 metrics display
│   │   ├── ProgressBar.tsx            # Single metric bar
│   │   ├── SpinConfirm.tsx            # "Confirm Winning Number" button
│   │   ├── TableTabs.tsx              # Tab bar for table switching
│   │   ├── SessionHeader.tsx          # Top header with session info
│   │   ├── RegisterTableModal.tsx     # New table modal
│   │   └── SessionModal.tsx           # New/load session modal
│   │
│   ├── screens/
│   │   ├── TablePlayScreen.tsx        # Main play screen (felt + metrics)
│   │   ├── HomeScreen.tsx             # Session/table management
│   │   └── HistoryScreen.tsx          # View/replay all spins
│   │
│   └── __tests__/
│       ├── metricsCalculator.test.ts
│       ├── wheelProperties.test.ts
│       ├── sessionStore.test.ts
│       ├── FeltLayout.test.tsx
│       ├── MetricsPanel.test.tsx
│       └── integration.test.tsx
│
└── assets/
    ├── fonts/                         # Custom fonts if needed
    └── icons/                         # App icons (auto-generated by Expo)
```

---

## Development Strategy: Both iOS & Android Simultaneously

**Why**: React Native shares 90%+ code between platforms. Separate sequential development would duplicate effort and delay iOS launch. Both platforms launch together in ~6 weeks.

**Testing approach**:
- **Development**: Test on iOS Simulator (Mac) & Android Emulator (any OS) simultaneously
- **Week 3-4**: Test on real iOS device (iPhone) + real Android device
- **Week 5**: Cross-platform QA (screen sizes, rotations, edge cases)
- **Week 6**: Submit both stores in parallel

**Platform-specific considerations**:
- **iOS**: Notches (Safe Area), iPhone screen sizes (SE, 12, Pro Max), status bar
- **Android**: Notches, punch holes, gesture navigation, system button bar, tablets
- **Both**: Font rendering, color accuracy, touch targets (44×44pt minimum)

**Single test matrix** (one set of test cases, run on both platforms):
```
Platform  | Device Type     | Test Focus
----------|-----------------|----------------------------
iOS       | iPhone 12 Sim   | Main flow, layout
iOS       | iPhone SE Real  | Small screen, Safe Area
Android   | Emulator        | Main flow, layout
Android   | Galaxy S21 Real | Large screen, gesture nav
```

---

## Technology Stack

### Mobile Framework
- **React Native 0.72+** (JavaScript/TypeScript for iOS & Android)
- **Expo** (managed service for rapid development, testing, and deployment)
- **TypeScript** (type safety)

### State Management
- **Zustand** (lightweight, < 3KB) OR **Context API** (no deps)
- **AsyncStorage** middleware for device persistence (replaces localStorage)

### Styling & UI
- **NativeWind** (Tailwind CSS for React Native, utility-first)
- **React Native Paper** (Material Design components, optional)
- Custom StyleSheet for performance-critical areas

### Navigation
- **React Navigation** (stack, bottom tabs, drawer navigation)

### Testing
- **Jest** (React Native standard test runner)
- **React Native Testing Library** (component testing)
- **Detox** (E2E testing for native apps, optional for MVP)

### Linting & Formatting
- **ESLint** (code quality)
- **Prettier** (code formatting)

### Deployment
- **Expo Go** (instant testing on device during development)
- **EAS Build** (cloud builds for iOS & Android, Expo service)
- **App Store** (iOS), **Google Play** (Android) (Phase 3)

### Development Tools
- **VS Code** with React Native extensions
- **Expo DevTools** (browser-based dev dashboard)
- **React DevTools** (component inspection)
- **Flipper** (native debugging)

---

## Key Milestones & Checkpoints

| Week | Milestone | Checkpoint |
|------|-----------|-----------|
| 1 | Project setup + types + wheel data | Can create session, see empty felt |
| 2 | Session lifecycle + multi-table | Can create table, see UI scaffolding |
| 3 | Felt layout + spin logging + metrics | Can spin numbers, see metrics update |
| 4 | Recent history + replay + styling | MVP feature-complete + polished UI |
| 5 | Testing + documentation | All tests passing, docs written |
| 6 | Deploy + launch | Live app accessible |

---

## Notes for Implementation

### Performance Considerations
- Metrics calculation: O(n) single pass through spinHistory, should be < 1ms
- Recent history: show last 10, not all spins
- Re-render only affected components (use React.memo on ProgressBar, etc.)

### State Management Tips
- Keep `currentTableName` as string, use it to index `tables` dict
- Auto-save after every mutation (debounce if needed)
- Don't recalculate metrics on render, only on spin confirmation

### UI/UX Best Practices
- Disable "Confirm Winning Number" if no bets or > 1 number selected
- Show feedback (toast/modal) when action succeeds
- Highlight recently added spin in history
- Make felt numbers large enough for mobile touch

### Future Phases (Post-MVP)
- **Phase 2**: Pattern detection (9 patterns), personal ledger, betting view
- **Phase 3**: Session/table reports (PDF/CSV), earnings tracking
- **Phase 4**: Mobile app (React Native), Play Store compliance

---

## Questions & Decisions

**Q: React or Vue?**  
A: React (more ecosystem, team familiarity). Use Vite for tooling.

**Q: State management: Zustand or Context?**  
A: Zustand (simpler, no provider nesting, devtools support).

**Q: TypeScript or JavaScript?**  
A: TypeScript (catches bugs, better IDE support, worth the compile step).

**Q: Tailwind or CSS Modules?**  
A: Tailwind (faster prototyping, consistent colors, responsive helpers built-in).

---

## Success Criteria

MVP is **complete** when:
- ✅ User can create session, register tables, input spins
- ✅ All 12 metrics calculate and display correctly
- ✅ Felt layout is pixel-perfect to spec
- ✅ Recent history works and is clickable to replay
- ✅ Data persists across page reloads
- ✅ Responsive design works on mobile
- ✅ No console errors or warnings
- ✅ App loads in < 3 seconds
- ✅ All tests passing (80%+ coverage)
- ✅ Deployed and accessible publicly

---

**Next Step**: Begin Phase 0.1 (Repository setup) and confirm tech stack choices.
