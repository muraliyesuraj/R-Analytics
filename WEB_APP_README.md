# Roulette Multi-Table Tracker - Web SPA

A fully functional React-based Single Page Application (SPA) for tracking roulette wheel spins across multiple tables with real-time analytics, historical ledger, and integrated tipping support.

## Features Implemented

### ✅ View 1: Launch Screen (Session Setup)
- **Wheel Type Selector**: Choose between European (single 0 - 2.7% edge) or American (double 00 - 5.26% edge) wheels
- **Session Configuration Form**:
  - TABLE NAME input with default "Bellagio Table #4"
  - STARTING BANKROLL input with default "$200.00"
  - Form validation and currency formatting
- **Compliance Disclaimer**: Mandatory warning about mathematical tracking utility
- **Primary CTA**: "START LOGBOOK SESSION" button with visual feedback
- **Secondary Actions**: Links for loading previous sessions and importing JSON data

### ✅ View 2: Active Multi-Table Dashboard  
- **Multi-Table Switcher**: Pill buttons showing each table's name and net P&L in real-time
- **Dynamic Table Addition**: "Add Table" button to register new tables mid-session
- **Session Header**: 
  - Current table name and bankroll display
  - Combined session statistics (total P&L, total spins)
  - History and end-session navigation buttons
- **Roulette Wheel Grid**:
  - Full 37-number European wheel layout (0-36)
  - Proper red/black/green color coding
  - Dozen and column labels (1st 12, 2nd 12, 3rd 12, 2:1 columns)
  - Outside bets row (1-18, EVEN, RED, BLACK, ODD, 19-36)
  - Click to select multiple numbers for tracking
- **Spin Logging**:
  - CLEAR button to reset selection
  - REPEAT button to quickly re-enter previous spin
  - SUBMIT SPIN button to log the spin outcome
  - Recent spins display (last 20 colored indicator circles)
- **Analytics Dashboard** (Collapsible):
  - Color distribution (Red, Black, Green %) with progress bars
  - Range distribution (Low 1-18, High 19-36 %) with progress bars
  - Parity distribution (Odd/Even %) with progress bars
  - All metrics calculated in real-time

### ✅ View 3: Historical Performance Ledger
- **Lifetime Metrics Banner**:
  - All-time net profit display
  - Win rate percentage and session count (e.g., "68.4% (13/19)")
- **Date Filter Tabs**: [ALL TIME], [LAST 7D], [THIS MONTH], [CUSTOM]
- **Historical Daily Sessions List**:
  - Date in format "AUG 22, 2026"
  - Duration and table count
  - Daily net profit in green (wins) or red (losses)
  - Expandable breakdown per table:
    - Table name, net P&L, spin count
    - Visual color coding for profit/loss
- **Action Buttons**:
  - CLEAR HISTORY (removes all session data)
  - MAIN MENU (returns to launch screen)

### ✅ View 4: Session Summary & Tipping Card
- **Final Result Banner**:
  - Today's net profit (green for positive, red for negative)
  - Total spins across all tables
- **Per-Table Breakdown**:
  - Vertical list of all active tables
  - Initial bankroll and final result for each
  - Color-coded profit/loss indicators
- **Integrated "Buy Me a Coffee" Tipping System**:
  - Header with ☕ emoji and "BUY ME A COFFEE" title
  - Supporting message: "Enjoying the tool? Support future updates!"
  - **Preset Tip Buttons**:
    - $1.99 (Espresso) - default highlighted
    - $4.99 (Double Shot)
    - $9.99 (Large Roast)
  - **Custom Tip Input**: 
    - Accepts custom amounts with $1.99 minimum enforcement
    - Validates against minimum threshold
  - **Optional Tip Note**: Text field for personal message
  - "TIP NOW" button with visual feedback and completion state
- **Action Buttons**:
  - SAVE & CLOSE: Preserves session and exits
  - NEW SESSION: Returns to launch screen to start fresh

## Design System

### Color Palette (Dark Gaming / Casino Slate)
- **Main Background**: `#0b0f17` 
- **Card Background**: `#020617`
- **Borders**: `#1e293b` & `#334155`
- **Primary Accent (Cyan)**: `#38bdf8` (highlights, tabs, analytics)
- **Success / Win State (Emerald)**: `#10b981` (profit, buttons, metrics)
- **Loss State (Crimson)**: `#ef4444` (negative values)
- **Tipping Accent (Amber)**: `#f59e0b` (coffee card, tip interactions)
- **Text Primary**: `#f8fafc` (primary content)
- **Text Secondary**: `#94a3b8` (labels, secondary info)
- **Text Muted**: `#64748b` (timestamps, tertiary)

### Typography & Sizing
- **Font Stack**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, etc.)
- **Responsive Sizing**: Font sizes scale from 7px (labels) to 16px (major headers)
- **Font Weights**: 400 (regular), 600 (semibold), 700 (bold), 800 (heavy), 900 (black)
- **Letter Spacing**: Wide tracking (0.5px-1px) for uppercase labels

### Layout Rules
- **Mobile-First Design**: Max-width 412px, fixed-width wrapper
- **Card Pattern**: Rounded borders (6-8px), 1px borders with dark slate
- **Spacing**: Consistent 8px, 12px, 16px padding/margin units
- **Grid System**: 2-4 column grids for flexible layouts

## Technical Stack

### Frontend Framework
- **React 18.2.0**: UI component library with hooks
- **React DOM 19.2.8**: Web DOM renderer
- **TypeScript 5.3.0**: Static type safety
- **Tailwind CSS 3.4.0**: Utility-first styling with custom config
- **Lucide React 1.33.0**: Icon library (used for navigation and status)

### Build & Development
- **Vite 6.4.3**: Ultra-fast build tool and dev server
- **@vitejs/plugin-react 4.7.0**: React FastRefresh support

### State & Storage
- **Browser localStorage API**: Persistent session storage (JSON serialization)
- **React Hooks**: Local component state (useState)
- **In-Memory State**: Current session tables and metrics

## File Structure

```
src/
├── App.tsx                      # Main app container, state orchestration
├── index.tsx                    # React DOM render entry point
├── index.css                    # Tailwind & custom styles
├── types/
│   └── index.ts                 # TypeScript interfaces (Session, Table, Spin, etc.)
├── utils/
│   └── wheelUtils.ts            # Wheel properties, metrics calculations
├── screens/
│   ├── LaunchScreen.tsx         # View 1: Session setup
│   ├── ActiveScreen.tsx         # View 2: Dashboard
│   ├── HistoryScreen.tsx        # View 3: Ledger
│   └── SummaryScreen.tsx        # View 4: Summary & tipping
└── components/
    ├── WheelGrid.tsx            # 37-number roulette wheel grid
    ├── Analytics.tsx            # Metrics visualization
    └── AddTableModal.tsx        # Mid-session table registration

public/
└── index.html                   # HTML entry point (also at root for Vite)

vite.config.ts                   # Vite build configuration
```

## Running the Application

### Development Server
```bash
npm run web:dev
```
Starts Vite dev server on http://localhost:5173 with hot module replacement.

### Production Build
```bash
npm run web:build
```
Generates optimized dist/ folder for deployment.

### Preview Production Build
```bash
npm run web:preview
```
Serves the production build locally for testing.

## Data Persistence

All session data is stored in browser `localStorage` under the key `roulette_sessions`:

```json
{
  "sessions": [
    {
      "id": "session_1724077200000",
      "date": 1724077200000,
      "tables": [
        {
          "id": "table_...",
          "name": "Bellagio #4",
          "wheelType": "european",
          "initialBankroll": 200,
          "currentBankroll": 530,
          "spins": [
            {"number": 17, "timestamp": 1724077234000},
            {"number": 22, "timestamp": 1724077242000}
          ],
          "createdAt": 1724077200000
        }
      ],
      "totalSpins": 14,
      "netProfit": 330,
      "completedAt": 1724077500000
    }
  ]
}
```

## Wheel Properties

- **Numbers**: 0-36 (37 total)
- **Colors**: Red (18), Black (18), Green (1 for 0)
- **Ranges**: Low (1-18), High (19-36), Zero (0)
- **Dozens**: 1st (1-12), 2nd (13-24), 3rd (25-36)
- **Columns**: 3 sets of 12 vertical columns

## Metrics Calculation

Real-time calculations after each spin:
- **Color Distribution**: Red, Black, Green percentages
- **Range Distribution**: Low (1-18) vs High (19-36) percentages
- **Parity**: Odd vs Even percentages
- **Display Format**: 1 decimal place (e.g., "45.3%")

## Browser Compatibility

- Chrome/Chromium (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- Requires ES2020+ support and localStorage API

## Responsive Design Notes

- **Fixed Width**: 380-412px centered container
- **Touch Optimized**: Minimum 44px tap targets for all buttons
- **Scrollable**: Overflow-y on long lists (history, analytics)
- **Mobile Viewport Meta Tag**: Proper scaling and touch handling

## Future Enhancements

- Export session data to CSV/PDF
- Custom racetrack betting patterns (voisins, tier, orphelins)
- Pattern detection and streak warnings
- Multi-currency support
- Dark/Light theme toggle
- Offline service worker support
- Progressive Web App (PWA) installation

## Security & Compliance

- **No Real Money**: Mathematical tracking utility only
- **Client-Side Only**: All data stays in browser, no server transmission
- **localStorage API**: Subject to browser's privacy settings
- **Disclaimer**: Mandatory compliance notice on launch screen

## Performance

- **Build Size**: ~225KB (uncompressed), ~68KB (gzip compressed)
- **First Load**: <2s typical on modern connections
- **Metrics Recalculation**: O(n) where n = number of spins (optimized on submit)
- **Hot Module Replacement**: Instant updates during development

---

**Version**: 0.1.0  
**Last Updated**: August 23, 2026  
**Status**: MVP Complete with all 4 views fully functional
