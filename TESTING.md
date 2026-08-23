# Testing Strategy – Roulette Analytics Engine

**Status**: Pre-implementation (for Phase 1+)  
**Last Updated**: 2026-07-30

This guide covers testing approach, test patterns, and running tests locally.

---

## Testing Philosophy

**Goal**: Catch bugs early, document expected behavior, enable refactoring with confidence.

**Strategy**:
- **Unit tests**: Pure functions (metrics, wheel properties, storage)
- **Component tests**: UI components (felt, history, panels)
- **Integration tests**: Full workflows (session → spin → metrics update)
- **Manual QA**: Cross-browser, mobile, performance edge cases

**Target Coverage**: 80%+ for critical paths (metrics, storage, state)

---

## Test Structure

### Directory Layout
```
src/__tests__/
├── metricsCalculator.test.ts        # Unit: calculateMetrics()
├── wheelProperties.test.ts          # Unit: WHEEL_PROPERTIES
├── sessionStore.test.ts             # Unit/Integration: store mutations
├── FeltLayout.test.tsx              # Component: felt grid rendering
├── MetricsPanel.test.tsx            # Component: metrics display
├── RecentHistory.test.tsx           # Component: history + replay
├── SpinConfirm.test.tsx             # Component: spin confirmation
└── integration.test.tsx             # Integration: full workflows
```

### File Naming
- Test file name = source file name + `.test.ts(x)`
- Test location = `src/__tests__/`
- Organize by feature, not by type (unit vs component)

---

## Unit Tests (Utilities)

### Testing Metrics Calculation

**File**: `src/__tests__/metricsCalculator.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { calculateMetrics } from '@/utils/metricsCalculator';

describe('calculateMetrics', () => {
  it('returns zero metrics for empty spin history', () => {
    const result = calculateMetrics([]);
    expect(result.colors.red).toBe(0);
    expect(result.colors.black).toBe(0);
  });

  it('calculates red percentage correctly', () => {
    // Red numbers: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
    const spins = [1, 1, 1]; // All red (3 reds)
    const result = calculateMetrics(spins);
    expect(result.colors.red).toBe(100); // 3/3 * 100
  });

  it('calculates mixed colors correctly', () => {
    const spins = [1, 2]; // 1 red, 1 black
    const result = calculateMetrics(spins);
    expect(result.colors.red).toBe(50);
    expect(result.colors.black).toBe(50);
  });

  it('calculates low/high range correctly', () => {
    const spins = [1, 2, 3, 4, 5]; // All low (1-18)
    const result = calculateMetrics(spins);
    expect(result.ranges.low).toBe(100);
    expect(result.ranges.high).toBe(0);
  });

  it('includes green (0) in calculations', () => {
    const spins = [0, 0];
    const result = calculateMetrics(spins);
    expect(result.colors.green).toBe(100);
  });

  it('calculates dozen percentages correctly', () => {
    const spins = [1, 2, 3, 4, 5, 6]; // First 6 in 1st dozen
    const result = calculateMetrics(spins);
    expect(result.dozens.first).toBe(100);
    expect(result.dozens.second).toBe(0);
  });

  it('calculates racetrack sections correctly', () => {
    // Tier du Cylindre: 6, 11, 13, 14, 16, 18, 20, 22, 24, 27, 30, 33, 36
    const spins = [6, 11, 13]; // All in tier
    const result = calculateMetrics(spins);
    expect(result.racetrack.tier).toBe(100);
  });

  it('formats percentages to 1 decimal place', () => {
    const spins = [1, 2, 3]; // 1/3 red ≈ 33.333...
    const result = calculateMetrics(spins);
    const redPercentage = result.colors.red.toString();
    const decimalPlaces = redPercentage.split('.')[1]?.length || 0;
    expect(decimalPlaces).toBeLessThanOrEqual(1);
  });
});
```

**Key Patterns**:
- Test edge cases (empty, single, large datasets)
- Test boundary values (first/last numbers in ranges)
- Verify calculations are correct
- Check formatting

### Testing Wheel Properties

**File**: `src/__tests__/wheelProperties.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { WHEEL_PROPERTIES } from '@/data/wheelProperties';

describe('WHEEL_PROPERTIES', () => {
  it('has entries for all 37 numbers (0-36)', () => {
    for (let i = 0; i <= 36; i++) {
      expect(WHEEL_PROPERTIES[i]).toBeDefined();
    }
  });

  it('only has entries for 0-36', () => {
    expect(WHEEL_PROPERTIES[37]).toBeUndefined();
    expect(WHEEL_PROPERTIES[-1]).toBeUndefined();
  });

  it('assigns correct color to all red numbers', () => {
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    redNumbers.forEach(num => {
      expect(WHEEL_PROPERTIES[num].color).toBe('red');
    });
  });

  it('assigns correct color to all black numbers', () => {
    const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
    blackNumbers.forEach(num => {
      expect(WHEEL_PROPERTIES[num].color).toBe('black');
    });
  });

  it('assigns green to 0 only', () => {
    expect(WHEEL_PROPERTIES[0].color).toBe('green');
    for (let i = 1; i <= 36; i++) {
      expect(WHEEL_PROPERTIES[i].color).not.toBe('green');
    }
  });

  it('assigns correct range (low/high/zero)', () => {
    // Low: 1-18
    for (let i = 1; i <= 18; i++) {
      expect(WHEEL_PROPERTIES[i].range).toBe('low');
    }
    // High: 19-36
    for (let i = 19; i <= 36; i++) {
      expect(WHEEL_PROPERTIES[i].range).toBe('high');
    }
    // Zero
    expect(WHEEL_PROPERTIES[0].range).toBe('zero');
  });

  it('assigns correct dozen', () => {
    // 1st: 1-12
    for (let i = 1; i <= 12; i++) {
      expect(WHEEL_PROPERTIES[i].dozen).toBe('1st');
    }
    // 2nd: 13-24
    for (let i = 13; i <= 24; i++) {
      expect(WHEEL_PROPERTIES[i].dozen).toBe('2nd');
    }
    // 3rd: 25-36
    for (let i = 25; i <= 36; i++) {
      expect(WHEEL_PROPERTIES[i].dozen).toBe('3rd');
    }
    // Zero
    expect(WHEEL_PROPERTIES[0].dozen).toBe('zero');
  });

  it('assigns correct racetrack sections', () => {
    // Tier du Cylindre
    const tier = [6, 11, 13, 14, 16, 18, 20, 22, 24, 27, 30, 33, 36];
    tier.forEach(num => {
      expect(WHEEL_PROPERTIES[num].racetrack).toBe('tier');
    });

    // Orphelins
    const orphelins = [1, 9, 14, 17, 20, 31, 34];
    orphelins.forEach(num => {
      expect(WHEEL_PROPERTIES[num].racetrack).toBe('orphelins');
    });

    // ZeroSpiel
    const zeroSpiel = [0, 3, 12, 15, 26, 32, 35];
    zeroSpiel.forEach(num => {
      expect(WHEEL_PROPERTIES[num].racetrack).toBe('zeroSpiel');
    });

    // Voisins
    const voisins = [2, 4, 5, 7, 8, 10, 19, 21, 23, 25, 28, 29, 31];
    voisins.forEach(num => {
      expect(WHEEL_PROPERTIES[num].racetrack).toBe('voisins');
    });
  });

  it('has no overlaps or conflicts in racetrack sections', () => {
    const sections = ['tier', 'orphelins', 'zeroSpiel', 'voisins'];
    const numberToSection = new Map<number, string[]>();

    for (let i = 0; i <= 36; i++) {
      const wheel = WHEEL_PROPERTIES[i];
      if (wheel.racetrack) {
        if (!numberToSection.has(i)) {
          numberToSection.set(i, []);
        }
        numberToSection.get(i)!.push(wheel.racetrack);
      }
    }

    // Check that each number belongs to at most 1 section (or is null)
    numberToSection.forEach((sections) => {
      expect(sections.length).toBeLessThanOrEqual(1);
    });
  });
});
```

**Key Patterns**:
- Verify data completeness (all 37 numbers)
- Check categorical mappings (colors, ranges, dozens)
- Validate no conflicts/duplicates
- Test boundary cases

### Testing Session Store

**File**: `src/__tests__/sessionStore.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSessionStore } from '@/store/sessionStore';

describe('sessionStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useSessionStore.getState();
    store.reset?.();
    localStorage.clear();
  });

  it('initializes with null session', () => {
    const store = useSessionStore.getState();
    expect(store.currentSession).toBeNull();
  });

  it('creates new session', () => {
    const store = useSessionStore.getState();
    const session = {
      sessionId: '123',
      sessionName: 'Test Session',
      startTimestamp: new Date().toISOString(),
      isPersistent: true,
      isCompleted: false,
      tables: {},
    };
    store.setCurrentSession(session);
    expect(store.currentSession).toEqual(session);
  });

  it('persists session to localStorage', () => {
    const store = useSessionStore.getState();
    const session = { sessionId: '123', /* ... */ };
    store.setCurrentSession(session);
    
    const saved = localStorage.getItem(`session_${session.sessionId}`);
    expect(saved).toBeDefined();
    expect(JSON.parse(saved!)).toEqual(session);
  });

  it('adds table to current session', () => {
    const store = useSessionStore.getState();
    const session = { sessionId: '123', tables: {} };
    store.setCurrentSession(session);
    
    store.addTable('Table 1');
    
    expect(store.currentSession?.tables['Table 1']).toBeDefined();
    expect(store.currentSession?.tables['Table 1'].spinHistory).toEqual([]);
  });

  it('prevents duplicate table names', () => {
    const store = useSessionStore.getState();
    const session = { sessionId: '123', tables: { 'Table 1': {} } };
    store.setCurrentSession(session);
    
    expect(() => store.addTable('Table 1')).toThrow('Table already exists');
  });

  it('updates table state', () => {
    const store = useSessionStore.getState();
    const session = { sessionId: '123', tables: { 'Table 1': { spinHistory: [] } } };
    store.setCurrentSession(session);
    
    store.updateTable('Table 1', { spinHistory: [1, 2, 3] });
    
    expect(store.currentSession?.tables['Table 1'].spinHistory).toEqual([1, 2, 3]);
  });

  it('gets active table', () => {
    const store = useSessionStore.getState();
    const session = { sessionId: '123', tables: { 'Table 1': { spinHistory: [] } } };
    store.setCurrentSession(session);
    store.setCurrentTableName('Table 1');
    
    const activeTable = store.getActiveTable();
    expect(activeTable).toBeDefined();
    expect(activeTable?.spinHistory).toEqual([]);
  });
});
```

**Key Patterns**:
- Reset store before each test (clean state)
- Test mutations and state changes
- Verify localStorage persistence
- Test getter functions

---

## Component Tests

### Testing FeltLayout Component

**File**: `src/__tests__/FeltLayout.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeltLayout } from '@/components/FeltLayout';

describe('FeltLayout', () => {
  it('renders all 37 numbers (0-36)', () => {
    render(<FeltLayout activeBets={[]} onSelectNumber={() => {}} />);
    
    for (let i = 0; i <= 36; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('renders 0 button at full width', () => {
    const { container } = render(<FeltLayout activeBets={[]} onSelectNumber={() => {}} />);
    const zeroButton = screen.getByText('0').closest('button');
    
    expect(zeroButton).toHaveClass('col-span-12'); // Full width in 12-column grid
  });

  it('renders numbers in correct order (1-36)', () => {
    const { container } = render(<FeltLayout activeBets={[]} onSelectNumber={() => {}} />);
    const numberButtons = container.querySelectorAll('[data-number]');
    
    const numbers = Array.from(numberButtons).map(btn => 
      parseInt(btn.getAttribute('data-number') || '')
    );
    
    expect(numbers).toEqual(Array.from({ length: 37 }, (_, i) => i));
  });

  it('applies red color to red numbers', () => {
    render(<FeltLayout activeBets={[]} onSelectNumber={() => {}} />);
    
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    redNumbers.forEach(num => {
      const button = screen.getByText(num.toString()).closest('button');
      expect(button).toHaveClass('bg-red-500');
    });
  });

  it('applies black color to black numbers', () => {
    render(<FeltLayout activeBets={[]} onSelectNumber={() => {}} />);
    
    const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
    blackNumbers.forEach(num => {
      const button = screen.getByText(num.toString()).closest('button');
      expect(button).toHaveClass('bg-gray-900');
    });
  });

  it('applies green color to 0', () => {
    render(<FeltLayout activeBets={[]} onSelectNumber={() => {}} />);
    
    const zeroButton = screen.getByText('0').closest('button');
    expect(zeroButton).toHaveClass('bg-green-500');
  });

  it('highlights selected numbers', () => {
    render(<FeltLayout activeBets={[1, 2, 3]} onSelectNumber={() => {}} />);
    
    [1, 2, 3].forEach(num => {
      const button = screen.getByText(num.toString()).closest('button');
      expect(button).toHaveClass('ring-2'); // or similar highlight class
    });
  });

  it('calls onSelectNumber when number is clicked', async () => {
    const onSelectNumber = vi.fn();
    render(<FeltLayout activeBets={[]} onSelectNumber={onSelectNumber} />);
    
    await userEvent.click(screen.getByText('5'));
    
    expect(onSelectNumber).toHaveBeenCalledWith(5);
  });

  it('toggles selection on multiple clicks', async () => {
    const onSelectNumber = vi.fn();
    render(<FeltLayout activeBets={[]} onSelectNumber={onSelectNumber} />);
    
    const button = screen.getByText('5');
    await userEvent.click(button);
    await userEvent.click(button);
    
    expect(onSelectNumber).toHaveBeenCalledTimes(2);
  });
});
```

**Key Patterns**:
- Use `render()` from React Testing Library
- Test with `screen` to query DOM
- Use `userEvent` for realistic interactions
- Mock callbacks with `vi.fn()`

### Testing MetricsPanel Component

**File**: `src/__tests__/MetricsPanel.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricsPanel } from '@/components/MetricsPanel';

describe('MetricsPanel', () => {
  const mockMetrics = {
    colors: { red: 50, black: 40, green: 10 },
    ranges: { low: 60, high: 40 },
    dozens: { first: 35, second: 33, third: 32 },
    racetrack: { tier: 25, orphelins: 20, zeroSpiel: 15, voisins: 18 },
  };

  it('renders all 12 metrics', () => {
    render(<MetricsPanel metrics={mockMetrics} spinCount={10} />);
    
    // Colors
    expect(screen.getByText(/Red/)).toBeInTheDocument();
    expect(screen.getByText(/Black/)).toBeInTheDocument();
    expect(screen.getByText(/Green/)).toBeInTheDocument();
    
    // Ranges
    expect(screen.getByText(/Low/)).toBeInTheDocument();
    expect(screen.getByText(/High/)).toBeInTheDocument();
    
    // Dozens
    expect(screen.getByText(/1st Dozen/)).toBeInTheDocument();
    expect(screen.getByText(/2nd Dozen/)).toBeInTheDocument();
    expect(screen.getByText(/3rd Dozen/)).toBeInTheDocument();
    
    // Racetrack
    expect(screen.getByText(/Tier du Cylindre/)).toBeInTheDocument();
    expect(screen.getByText(/Orphelins/)).toBeInTheDocument();
    expect(screen.getByText(/Zero Spiel/)).toBeInTheDocument();
    expect(screen.getByText(/Voisins du Zéro/)).toBeInTheDocument();
  });

  it('displays correct percentages', () => {
    render(<MetricsPanel metrics={mockMetrics} spinCount={10} />);
    
    expect(screen.getByText('50%')).toBeInTheDocument(); // Red
    expect(screen.getByText('40%')).toBeInTheDocument(); // Black
    expect(screen.getByText('10%')).toBeInTheDocument(); // Green
  });

  it('displays correct counts', () => {
    render(<MetricsPanel metrics={mockMetrics} spinCount={10} />);
    
    // Count = (percentage / 100) * spinCount
    expect(screen.getByText(/5 spins/)).toBeInTheDocument(); // Red: 50% of 10
    expect(screen.getByText(/4 spins/)).toBeInTheDocument(); // Black: 40% of 10
  });

  it('groups metrics by category', () => {
    const { container } = render(<MetricsPanel metrics={mockMetrics} spinCount={10} />);
    
    expect(container.querySelector('[data-category="colors"]')).toBeInTheDocument();
    expect(container.querySelector('[data-category="ranges"]')).toBeInTheDocument();
    expect(container.querySelector('[data-category="dozens"]')).toBeInTheDocument();
    expect(container.querySelector('[data-category="racetrack"]')).toBeInTheDocument();
  });
});
```

---

## Integration Tests

### Testing Full Spin Flow

**File**: `src/__tests__/integration.test.tsx`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@/App';

describe('Spin Flow (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('completes full spin workflow', async () => {
    const user = userEvent.setup();
    render(<App />);

    // 1. Create session
    await user.click(screen.getByText(/New Session/i));
    await user.type(screen.getByPlaceholderText(/session name/i), 'Test Session');
    await user.click(screen.getByText(/Create/i));

    // 2. Register table
    await user.click(screen.getByText(/Register New Table/i));
    await user.type(screen.getByPlaceholderText(/table name/i), 'Table 1');
    await user.click(screen.getByText(/Add Table/i));

    // 3. Select bets
    await user.click(screen.getByText('5'));
    await user.click(screen.getByText('10'));

    // 4. Confirm spin
    await user.click(screen.getByText(/Confirm Winning Number/i));
    await user.click(screen.getByText('5')); // Choose winning number

    // 5. Verify metrics updated
    expect(screen.getByText(/50%/)).toBeInTheDocument(); // Red (assuming 5 is red)
  });

  it('preserves data after page reload', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    // Create session and spin
    await user.click(screen.getByText(/New Session/i));
    // ... perform actions ...

    // Unmount (simulates page close)
    unmount();

    // Remount (simulates page reload)
    render(<App />);

    // Verify data is still there
    expect(screen.getByText(/Test Session/i)).toBeInTheDocument();
  });

  it('switches tables and maintains independent state', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Create session and two tables
    // ... create tables ...
    // Spin at Table 1
    // Switch to Table 2
    // Spin at Table 2
    // Switch back to Table 1

    // Verify Table 1 has original spin count
    // Verify Table 2 has its own spin count
  });
});
```

---

## Running Tests

### Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test metricsCalculator

# Run tests matching pattern
npm test -- --grep "metrics"

# Run in watch mode (re-run on save)
npm test -- --watch

# Run with coverage report
npm test -- --coverage

# Run with UI dashboard
npm test -- --ui

# Update snapshots
npm test -- -u

# Debug mode (slower but detailed)
npm test -- --reporter=verbose
```

### Coverage Report

```bash
npm test -- --coverage
```

Output:
```
| File                | Statements | Branches | Functions | Lines |
|-------------------|-----------|----------|-----------|-------|
| metricsCalculator | 95%       | 90%      | 100%      | 95%   |
| wheelProperties   | 100%      | 100%     | 100%      | 100%  |
| sessionStore      | 87%       | 82%      | 90%       | 87%   |
```

---

## Test Data Fixtures

Create reusable test data:

**File**: `src/__tests__/fixtures.ts`

```typescript
import type { Session, Table, Metrics } from '@/types';

export const createMockSession = (overrides?: Partial<Session>): Session => ({
  sessionId: '123',
  sessionName: 'Test Session',
  startTimestamp: new Date().toISOString(),
  isPersistent: true,
  isCompleted: false,
  tables: {},
  ...overrides,
});

export const createMockTable = (overrides?: Partial<Table>): Table => ({
  name: 'Table 1',
  activeBets: [],
  spinHistory: [],
  personalActivity: [],
  isCompleted: false,
  ...overrides,
});

export const createMockMetrics = (overrides?: Partial<Metrics>): Metrics => ({
  colors: { red: 0, black: 0, green: 0 },
  ranges: { low: 0, high: 0 },
  dozens: { first: 0, second: 0, third: 0 },
  racetrack: { tier: 0, orphelins: 0, zeroSpiel: 0, voisins: 0 },
  ...overrides,
});
```

Use in tests:

```typescript
const session = createMockSession({ sessionName: 'Custom' });
const table = createMockTable({ spinHistory: [1, 2, 3] });
const metrics = createMockMetrics({ colors: { red: 50, black: 50, green: 0 } });
```

---

## Common Test Patterns

### Testing Asynchronous Code

```typescript
it('loads sessions from storage', async () => {
  const promise = loadSessions();
  await expect(promise).resolves.toEqual([...]);
});

it('handles storage errors', async () => {
  vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
    throw new Error('Storage error');
  });
  
  const promise = loadSessions();
  await expect(promise).rejects.toThrow('Storage error');
});
```

### Mocking Functions

```typescript
import { vi } from 'vitest';

const mockCalculateMetrics = vi.fn();
mockCalculateMetrics.mockReturnValue({ /* metrics */ });

expect(mockCalculateMetrics).toHaveBeenCalledWith([1, 2, 3]);
```

### Snapshot Testing (Use Sparingly)

```typescript
it('renders metrics correctly', () => {
  const { container } = render(<MetricsPanel metrics={mockMetrics} />);
  expect(container).toMatchSnapshot();
});
```

Note: Update snapshots when intentional UI changes happen: `npm test -- -u`

---

## Debugging Failing Tests

### Print Debug Info

```typescript
it('should calculate correctly', () => {
  const result = calculateMetrics([1, 2, 3]);
  console.log('Result:', JSON.stringify(result, null, 2));
  expect(result.colors.red).toBe(50);
});
```

Run: `npm test -- --reporter=verbose`

### Run Single Test

```typescript
// Use .only to run single test
it.only('should calculate correctly', () => {
  // Only this test runs
});
```

### Use Debugger

```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs run
# Then open chrome://inspect in Chrome
```

---

## Test Coverage Goals

| Module | Target | Why |
|--------|--------|-----|
| `metricsCalculator` | 95%+ | Critical calculation logic |
| `wheelProperties` | 100% | Must verify all 37 numbers |
| `sessionStore` | 85%+ | State mutations are important |
| `FeltLayout` | 80%+ | UI but important interactions |
| `MetricsPanel` | 75%+ | Display component, less critical |
| Integration | 70%+ | Full workflows |

---

## CI/CD Testing

When tests run on every commit (GitHub Actions):

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test -- --run --coverage
      - uses: codecov/codecov-action@v3
```

---

## Best Practices

1. **Test behavior, not implementation** – Test "when user spins, metrics update", not internal details
2. **Use descriptive test names** – `it('calculates red percentage correctly')`, not `it('works')`
3. **Arrange-Act-Assert** – Organize each test: setup → action → verify
4. **One assertion per test** (mostly) – Easier to debug failures
5. **Mock external dependencies** – Don't rely on network/time in tests
6. **Clean up after tests** – Clear localStorage, reset mocks
7. **Keep tests fast** – Unit tests should complete in < 1ms each
8. **Test edge cases** – Empty inputs, boundary values, error states

---

**Next Step**: When implementation starts, create test files alongside features and maintain 80%+ coverage.
