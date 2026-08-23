# Development Guide – Roulette Analytics Engine

**Status**: Pre-implementation (Phase 0 setup pending)  
**Last Updated**: 2026-07-30

This guide covers local development setup, common commands, and project structure.

---

## Quick Start

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org/))
- npm 9+ or pnpm 8+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac): Use Xcode
- Android Emulator: Use Android Studio
- Expo Go app (physical device): Download from App Store or Google Play

### Initial Setup

```bash
# 1. Navigate to project directory
cd /Users/my/develop/personal/R-Analytics

# 2. Install dependencies (run once)
npm install

# 3. Start Expo dev server
npm start

# 4. Test the app
# Option A: Scan QR code with Expo Go app (physical device)
# Option B: Press 'i' for iOS Simulator
# Option C: Press 'a' for Android Emulator
# Option D: Press 'w' for web (preview only, not primary target)
```

The app should load with hot-reload enabled. Edit code, save, and see changes instantly on your device/simulator.

---

## Available Commands

### Development

```bash
# Start Expo dev server (interactive menu)
npm start

# Start on iOS Simulator (Mac only)
npm run ios

# Start on Android Emulator
npm run android

# Start on web (preview only, not primary)
npm run web

# Start with specific environment
npm start -- --scheme production
```

### Testing

```bash
# Run all tests (Jest)
npm test

# Run tests in watch mode (re-run on save)
npm test -- --watch

# Run specific test file
npm test metricsCalculator

# Run tests with coverage report
npm test -- --coverage

# Update snapshots (for snapshot tests)
npm test -- -u

# Run E2E tests (Detox, if installed)
npm run e2e
```

### Code Quality

```bash
# Lint all files (ESLint)
npm run lint

# Fix linting errors automatically
npm run lint -- --fix

# Format code (Prettier)
npm run format

# Type check (TypeScript)
npm run type-check

# Run linting + type check
npm run check
```

### Build & Deployment

```bash
# Build optimized iOS bundle
eas build --platform ios

# Build optimized Android bundle
eas build --platform android

# Build both simultaneously
eas build

# Local production build (testing only)
npm run prebuild

# Submit to App Store (requires Apple Developer account)
eas submit --platform ios

# Submit to Google Play (requires Google Play Developer account)
eas submit --platform android
```

---

## Project Structure Explained

### `/src/types/`
**TypeScript interfaces** for all data structures.

```
src/types/
├── index.ts  # Session, Table, PersonalActivityEntry, WheelNumber, Metrics
```

Used across store and components. Update here when adding new data fields.

### `/src/data/`
**Immutable constants** used throughout the app.

```
src/data/
├── wheelProperties.ts  # WHEEL_PROPERTIES map (all 37 numbers with color/range/dozen/racetrack)
```

The wheel is **never** hardcoded—always use `WHEEL_PROPERTIES[number]`.

### `/src/store/`
**Centralized state management** using Zustand.

```
src/store/
├── sessionStore.ts  # Session state, table management, mutations + getters
```

Contains:
- `currentSession` state
- `currentTableName` state
- Mutations: `setCurrentSession()`, `addTable()`, `updateTable()`
- Getters: `getActiveTable()`, `getTableMetrics()`
- **AsyncStorage middleware** for device persistence

**How to add state:**
```typescript
// In sessionStore.ts
const store = create<StoreState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      setCurrentSession: (session) => set({ currentSession: session }),
      // ... mutations and getters
    }),
    {
      name: 'roulette-session-store',
      storage: AsyncStorage,  // Device storage
    }
  )
);

// In components
const { currentSession, setCurrentSession } = useSessionStore();
```

### `/src/utils/`
**Pure functions** for calculations and helpers.

```
src/utils/
├── metricsCalculator.ts   # calculateMetrics(spinHistory) → Metrics
├── feltLayout.ts          # Felt grid utilities (touch layout)
├── historyReplay.ts       # Get spin details for replay
├── storage.ts             # AsyncStorage wrapper (save/load sessions)
└── helpers.ts             # Generic helpers
```

These should be **testable** and **side-effect free**.

### `/src/components/`
**React Native components** organized by feature.

```
src/components/
├── FeltLayout.tsx           # 3×12 grid (touch-optimized)
├── NumberButton.tsx         # Single tappable number
├── RecentHistory.tsx        # Last 10 spins (horizontal scroll)
├── MetricsPanel.tsx         # All 12 metrics display
├── ProgressBar.tsx          # Single metric bar
├── SpinConfirm.tsx          # "Confirm Winning Number" button
├── TableTabs.tsx            # Tab bar for table switching
├── SessionHeader.tsx        # Header with session info
├── RegisterTableModal.tsx   # New table modal
└── SessionModal.tsx         # New/load session modal
```

**Component responsibilities:**
- `FeltLayout`: Render 3×12 grid, handle taps
- `MetricsPanel`: Display 12 metrics (receives metrics object via props)
- `RecentHistory`: Show last 10 spins, handle replay on tap
- `SessionHeader`: Display session name, current table, button actions

**Mobile-specific considerations:**
- Use `SafeAreaView` to avoid notches/home indicators
- Test layouts on multiple screen sizes
- Optimize touch targets (min 44×44pt)
- Avoid horizontal scroll except where necessary (history)

**Avoid:**
- Business logic in components (move to utils)
- Passing 10+ props (use store or composition)
- Rendering without keys in lists

### `/src/__tests__/`
**Test files** mirroring `/src/` structure.

```
src/__tests__/
├── metricsCalculator.test.ts     # Test calculateMetrics() with known data
├── wheelProperties.test.ts       # Verify all 37 numbers are correct
├── sessionStore.test.ts          # Test store mutations and persistence
├── FeltLayout.test.tsx           # Component rendering tests
├── MetricsPanel.test.tsx         # Metrics display tests
├── RecentHistory.test.tsx        # History + replay tests
└── integration.test.tsx          # End-to-end flow tests
```

---

## Core Concepts

### State Flow

```
User Action
    ↓
Component calls store mutation
    ↓
Store updates state (in-memory)
    ↓
localStorage middleware auto-saves
    ↓
Component re-renders (via store subscription)
```

Example: Spinning a number

```typescript
// User clicks "Confirm Winning Number"
const confirmSpin = (winningNumber: number) => {
  // 1. Update spinHistory
  updateTable(currentTableName, {
    spinHistory: [...currentTable.spinHistory, winningNumber]
  });
  
  // 2. Create PersonalActivityEntry
  // 3. Clear activeBets
  // 4. Metrics recalculate automatically (stored component props)
  // 5. localStorage saves (middleware)
};
```

### Metrics Calculation

**When**: After every spin confirmation
**Where**: Triggered by store mutation
**How**: Pure function `calculateMetrics(spinHistory)`

```typescript
// metricsCalculator.ts
export const calculateMetrics = (spinHistory: number[]): Metrics => {
  if (spinHistory.length === 0) return getEmptyMetrics();
  
  const counts = { red: 0, black: 0, green: 0, /* ... */ };
  
  for (const num of spinHistory) {
    const wheel = WHEEL_PROPERTIES[num];
    counts[wheel.color]++;
    // ... count other categories
  }
  
  const total = spinHistory.length;
  return {
    colors: {
      red: (counts.red / total) * 100,
      // ... other metrics
    }
  };
};
```

Call in store:

```typescript
const updateTable = (name: string, updates: Partial<Table>) => {
  // ... merge updates into table
  const metrics = calculateMetrics(updatedTable.spinHistory);
  // Use metrics for display (not stored, derived)
};
```

### Replay Functionality

When user clicks a spin in recent history or ledger:

```typescript
// historyReplay.ts
export const getSpinDetails = (
  table: Table,
  spinIndex: number
) => {
  const entry = table.personalActivity[spinIndex];
  const winningNumber = table.spinHistory[spinIndex];
  
  return {
    numbersCovered: entry.numbersCovered,
    winningNumber,
    isWin: entry.isWin,
    timestamp: entry.timestamp,
  };
};

// Component updates UI to show this spin's state
```

---

## Common Workflows

### Adding a New Feature

1. **Define types** in `src/types/index.ts` (if needed)
2. **Add store mutations** in `src/store/sessionStore.ts`
3. **Create utility functions** in `src/utils/`
4. **Build UI components** in `src/components/`
5. **Write tests** in `src/__tests__/`
6. **Update CLAUDE.md** if architectural changes

### Adding a Metric

1. Add to `Metrics` interface in `src/types/index.ts`
2. Update `calculateMetrics()` in `src/utils/metricsCalculator.ts`
3. Add progress bar in `src/components/MetricsPanel.tsx`
4. Test in `src/__tests__/metricsCalculator.test.ts`

Example: Adding "Odd %"

```typescript
// types/index.ts
interface Metrics {
  // ... existing
  odd: number; // Add this
}

// utils/metricsCalculator.ts
const isOdd = (num: number) => num !== 0 && num % 2 === 1;
const oddCount = spinHistory.filter(isOdd).length;
return {
  // ... existing
  odd: (oddCount / total) * 100,
};

// components/MetricsPanel.tsx
<ProgressBar label="Odd %" value={metrics.odd} count={oddCount} />
```

### Fixing a Bug

1. Write a failing test first
2. Run test: `npm test -- --watch`
3. Fix code until test passes
4. Commit with: `git commit -m "fix: [description]"`

---

## Environment Setup

### VS Code Extensions (Recommended)
- **ESLint** – Linting
- **Prettier** – Formatting
- **TypeScript Vue Plugin** – TS support
- **React Developer Tools** – React debugging (Chrome only)

### VS Code Settings (Optional)
Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Debugging

### React Native Components
Use **Flipper** (recommended):
1. Download [Flipper](https://fbflipper.com/)
2. Open Flipper, select your device/simulator
3. View console logs, inspect React tree, track network

Or use **React DevTools** in Expo:
```bash
npm start
# Press 'shift+m' to open React DevTools
```

### State Management
Debug Zustand state:

```typescript
// In code, inspect store state
const store = useSessionStore.getState();
console.log('Store state:', store);

// Or add a Zustand middleware
const store = create<StoreState>((set, get) => ({
  // ... store definition
}));

store.subscribe(state => console.log('Store changed:', state));
```

### Device Logs
- **iOS Simulator**: Xcode → Window → Devices and Simulators → Logs
- **Android Emulator**: `adb logcat | grep ReactNativeJS`
- **Expo Go**: Terminal shows all logs from physical device

### Console Debugging
```typescript
console.log('Debug message');
console.error('Error message');
console.warn('Warning message');
```

View in Expo terminal or Flipper console.

### AsyncStorage Debugging
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// View all stored data
const allData = await AsyncStorage.getAllKeys();
console.log('All keys:', allData);

// View specific session
const session = await AsyncStorage.getItem('session_123');
console.log('Session:', JSON.parse(session!));
```

### Jest Debugging
```bash
# Run tests with debugger
node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand
```

Then open `chrome://inspect` in Chrome.

---

## Performance Tips

### Metrics Calculation
- **One pass**: Iterate spinHistory once, count all categories
- **Cache**: Don't recalculate on render—store in component state if needed
- **Memoize**: Use Zustand selectors to avoid unnecessary re-renders

### Component Re-renders
- Use `React.memo()` for heavy components (especially FeltLayout)
  ```typescript
  const ProgressBar = React.memo(({ label, value, count }) => (
    // ... render
  ));
  ```
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for event handlers passed to children

### Device Performance
- **Don't**: Calculate metrics on every render
- **Do**: Calculate metrics once after spin, store in state
- **FlatList/SectionList**: Use for long lists (history), virtualize rendering
- **Images**: Optimize icons/assets for mobile

### Bundle Size
- Target: < 50MB app size (iOS/Android combined)
- Keep dependencies minimal (Zustand ~3KB)
- Lazy load Phase 2+ features (pattern detection, reporting)
- Use code splitting for future navigation

### AsyncStorage Performance
- Don't call AsyncStorage in render functions—use useEffect
- Batch operations: save once after multiple state changes
- Use `setImmediate()` to defer non-critical saves

---

## Deployment – App Stores (MVP → Store Launch)

### Prerequisites
- Expo account (free at expo.dev)
- iOS: Apple Developer account ($99/year) – for App Store
- Android: Google Play Developer account ($25 one-time) – for Google Play
- GitHub account (for Git)

### Building for App Stores

#### Setup (One-time)
```bash
eas login
eas init
```

#### Build for iOS
```bash
eas build --platform ios
```

#### Build for Android
```bash
eas build --platform android
```

#### Build Both Simultaneously
```bash
eas build
```

### App Store Submission Checklist

**Before First Submission:**
- [ ] App icon (1024×1024 PNG)
- [ ] Screenshots for each store
- [ ] Description: Frame as "Statistical Analysis Tool" (NOT gambling)
- [ ] Privacy policy URL
- [ ] Support email
- [ ] No console errors on real device
- [ ] Tested on iOS Simulator & Android Emulator

**Compliance Critical:**
- ✅ Frame as statistical/educational tool
- ❌ NO gambling terminology ("win money", "beat the house")
- ❌ NO simulated wheel spinning
- ❌ NO virtual chips or betting mechanics

### iOS App Store

```json
// app.json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourdomain.roulettapp",
      "buildNumber": "1"
    }
  }
}
```

Submit:
```bash
eas submit --platform ios
```

Review time: 24-48 hours typically.

### Android Google Play

```json
// app.json
{
  "expo": {
    "android": {
      "package": "com.yourdomain.roulettapp",
      "versionCode": 1
    }
  }
}
```

Submit:
```bash
eas submit --platform android
```

Review time: 2-4 hours typically.

### Environment Variables

In `app.json`:
```json
{
  "expo": {
    "extra": {
      "API_URL": "https://api.example.com"
    }
  }
}
```

Access in code:
```typescript
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig?.extra?.API_URL;
```

---

## Troubleshooting

### Dev server not starting
```bash
# Kill Expo dev server
lsof -ti:19000 | xargs kill -9
lsof -ti:19001 | xargs kill -9

# Clear cache and reinstall
npm start -- --clear

# Or full reset
rm -rf node_modules .expo package-lock.json
npm install
npm start
```

### Tests failing after changes
```bash
# Clear Jest cache
npm test -- --clearCache

# Run in watch mode to debug
npm test -- --watch
```

### AsyncStorage issues (Device Storage)
```bash
# In code: Clear all saved sessions
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.clear();
// App will prompt to create new session on next launch
```

### Device/Simulator Issues
```bash
# Rebuild native modules
npm run prebuild

# Restart Expo dev server
npm start -- --clear

# On iOS Simulator: xcrun simctl erase all (resets simulator)
# On Android Emulator: Cold boot from Android Studio
```

### Build fails
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Fix all auto-fixable issues
npm run lint -- --fix
```

---

## Branch & Commit Strategy

### Branch Naming
- `main` – Production-ready (deployed)
- `develop` – Integration branch
- `feature/[name]` – New features (e.g., `feature/metrics-panel`)
- `fix/[name]` – Bug fixes (e.g., `fix/felt-layout-colors`)

### Commit Messages
```
feat: add metrics calculation engine
fix: correct roulette red numbers
refactor: split MetricsPanel into smaller components
test: add integration test for spin flow
docs: update DEVELOPMENT.md
```

Use prefixes: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.

### Pull Requests
Before merging to main:
1. Pass all tests: `npm test`
2. No linting errors: `npm run lint`
3. No TypeScript errors: `npm run type-check`
4. Manual QA on different browsers/devices

---

## Resources

### React & React Native
- [React Docs](https://react.dev/) – Learn React fundamentals
- [React Native Docs](https://reactnative.dev/) – Mobile-specific APIs & components
- [Expo Docs](https://docs.expo.dev/) – Development & deployment guide
- [React Navigation Docs](https://reactnavigation.org/) – App navigation

### State & Storage
- [Zustand Docs](https://github.com/pmndrs/zustand) – State management
- [AsyncStorage Docs](https://react-native-async-storage.github.io/) – Device persistence

### Styling & UI
- [NativeWind Docs](https://www.nativewind.dev/) – Tailwind for React Native
- [React Native StyleSheet](https://reactnative.dev/docs/stylesheet) – Performance-optimized styles

### Testing & Debugging
- [Jest Docs](https://jestjs.io/) – Testing framework
- [React Native Testing Library](https://testing-library.com/react-native) – Component testing
- [Flipper](https://fbflipper.com/) – Native app debugger
- [Detox](https://wix.github.io/Detox/) – E2E testing

### App Stores
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)

---

## Support

For questions or issues:
1. Check [README.md](README.md) for product spec
2. Check [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for architecture
3. Check [CLAUDE.md](CLAUDE.md) for high-level context
4. Check Vitest/React/Zustand docs for API questions
5. Check git history: `git log --oneline` for recent changes

---

**Next Step**: Run `npm install` and `npm run dev` when Phase 0 project setup begins.
