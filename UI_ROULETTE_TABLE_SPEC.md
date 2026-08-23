# Roulette Table UI Specification

## Overview

The interactive betting grid is a visual representation of a European roulette table layout. Users click numbers to select their bets, and the system tracks which numbers are selected and their outcomes.

---

## Table Layout Structure

### Main Grid: 3×12 (Numbers 1-36)

**Standard European Roulette Felt Layout:**

```
        Column 1  Column 2  Column 3  ... Column 12
Row 1:    3        6         9              36
Row 2:    2        5         8              35
Row 3:    1        4         7              34
```

**Exact number arrangement:**

| Row 1 | 3 | 6 | 9 | 12 | 15 | 18 | 21 | 24 | 27 | 30 | 33 | 36 |
|-------|---|---|---|----|----|----|----|----|----|----|----|----| 
| Row 2 | 2 | 5 | 8 | 11 | 14 | 17 | 20 | 23 | 26 | 29 | 32 | 35 |
| Row 3 | 1 | 4 | 7 | 10 | 13 | 16 | 19 | 22 | 25 | 28 | 31 | 34 |

---

## Color & Styling

### Number Colors (European Roulette)

**Red numbers:** 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
- Background: `#ef4444` (bright red)
- Text: `#ffffff` (white)

**Black numbers:** 2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35
- Background: `#1e293b` (dark gray/black)
- Text: `#ffffff` (white)

**Zero (0):** Green
- Background: `#10b981` (bright green)
- Text: `#ffffff` (white)
- Spans full width above the grid

### Cell Styling

**Default (not selected):**
- Height: 40-50px
- Font size: 14-16px (bold)
- Border: 1px solid rgba(255, 255, 255, 0.1)
- Cursor: pointer
- Border radius: 4px (subtle)

**Selected (active bet):**
- Overlay: semi-transparent golden/yellow highlight or border
- Indicator icon: coin icon (💰) or check mark in corner
- Visual feedback should be clear but not block the number

**Hover state:**
- Opacity: 0.8
- Slight scale up (1.05x transform)
- Cursor: pointer

---

## Complete Table Section Layout

### Top: Zero Button
```
┌─────────────────────────────────────────┐
│              0 (GREEN)                  │
└─────────────────────────────────────────┘
```
- Full-width button
- Green background (#10b981)
- Font: bold, 16px
- Padding: 12-16px

### Middle: 3×12 Grid
```
┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐
│3 │6 │9 │12│15│18│21│24│27│30│33│36│
├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤
│2 │5 │8 │11│14│17│20│23│26│29│32│35│
├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤
│1 │4 │7 │10│13│16│19│22│25│28│31│34│
└──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘
```

- Grid gap: 2-4px
- Each cell: 40-50px square (responsive)
- Font: bold, 14-16px
- Center-aligned text

### Bottom: Betting Options Row 1

```
┌──────────┬──────┬───────┬───────────┐
│  1-18    │ EVEN │ RED   │  ODD  │ 19-36│
└──────────┴──────┴───────┴───────────┘
```

**Layout:**
- Divided into 5 equal sections
- Each spans 2.4 columns of the grid

**Sections:**

1. **"1-18"** (Low)
   - Style: Dark background with white text
   - Color indicator: Small colored box or background tint
   - Same styling as main grid cells

2. **"EVEN"** (Even numbers)
   - Style: Dark background
   - White text
   - Same grid styling

3. **"RED"** (Color bet)
   - Background: Red (#ef4444)
   - White text
   - Indicator: Filled red circle

4. **"ODD"** (Odd numbers)
   - Style: Dark background
   - White text
   - Same grid styling

5. **"19-36"** (High)
   - Style: Dark background
   - White text
   - Same grid styling

### Bottom: Betting Options Row 2

```
┌────────────┬────────────┬────────────┐
│  1st 12    │  2nd 12    │  3rd 12    │
└────────────┴────────────┴────────────┘
```

**Layout:**
- Divided into 3 equal sections
- Each spans 4 columns of the grid
- Below the "1-18 EVEN RED ODD 19-36" row

**Sections:**

1. **"1st 12"** (Numbers 1-12)
   - Dark background, white text
   - Same interactive styling

2. **"2nd 12"** (Numbers 13-24)
   - Dark background, white text
   - Same interactive styling

3. **"3rd 12"** (Numbers 25-36)
   - Dark background, white text
   - Same interactive styling

---

## Interactive Behavior

### Clicking a Number/Section

1. **Visual Feedback:**
   - Add golden/yellow highlight or coin icon
   - Add to `activeBets` array
   - Remove if clicked again (toggle)

2. **Visual Indicator on Selection:**
   - Option A: Coin icon (💰) in corner of cell
   - Option B: Border highlight in gold/yellow
   - Option C: Semi-transparent overlay + text indicator

3. **Multi-Select:**
   - User can select multiple numbers
   - Each selection appears independently on felt
   - Numbers can be toggled on/off

4. **Confirm Action:**
   - Button: "Confirm Winning Number"
   - If 1 selection: Auto-confirm that number won
   - If multiple: Show dialog "Which number actually won?"
   - Clear selection after confirmation

### Betting Options Behavior

- **1-18, EVEN, ODD, 19-36:** Same toggle behavior as numbers
- **RED, BLACK:** Color bets (select all red/black numbers)
- **1st/2nd/3rd 12:** Dozen bets (select all numbers in that dozen)
- Can multi-select with individual numbers and betting options

---

## Color Palette (from CLAUDE.md)

| Element | Hex Color | Usage |
|---------|-----------|-------|
| Background | #121824 | Main app background |
| Panel | #1e293b | Card/panel background |
| Accent Green | #10b981 | Zero button, highlights, buttons |
| Roulette Red | #ef4444 | Red numbers, red bets |
| Roulette Black | #1e293b | Black numbers |
| Text Main | #f8fafc | Primary text |
| Text Muted | #94a3b8 | Secondary text |

---

## Responsive Design

### Desktop (PC/Tablet)
- Table width: 300-400px
- Cell size: 40-50px
- Padding: 16px around grid
- Left panel with betting grid

### Mobile (Portrait)
- Table width: 100% of left panel (max 280px)
- Cell size: 35-45px
- Padding: 8px
- Stack vertically: Grid → Betting options rows

### Mobile (Landscape)
- Table width: 50-60% of screen width
- Adjust cell sizes accordingly
- Keep readable and tappable (min 40px touch target)

---

## Accessibility

- **Keyboard Support:** Tab navigation through all cells and buttons
- **Color Blind:** Use patterns/icons in addition to colors (e.g., "R" label for red)
- **Screen Reader:** Each cell has aria-label (e.g., "Red 3", "Black 2", "Green Zero")
- **Touch Targets:** Minimum 44px for mobile
- **Focus Indicators:** Clear focus ring (2px border) around selected cells

---

## Implementation Notes

### CSS Grid Approach
```css
.betting-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.grid-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  user-select: none;
  transition: all 0.2s ease;
}

.grid-cell.selected::after {
  content: '💰';
  position: absolute;
  font-size: 12px;
}

.grid-cell:hover {
  opacity: 0.8;
  transform: scale(1.05);
}
```

### Data Structure for Cell Colors
```javascript
const ROULETTE_COLORS = {
  0: 'green',
  1: 'red', 2: 'black', 3: 'red', 4: 'black', 5: 'red',
  6: 'black', 7: 'red', 8: 'black', 9: 'red', 10: 'black',
  11: 'black', 12: 'red', 13: 'black', 14: 'red', 15: 'black',
  16: 'red', 17: 'black', 18: 'red', 19: 'red', 20: 'black',
  21: 'red', 22: 'black', 23: 'red', 24: 'black', 25: 'red',
  26: 'black', 27: 'red', 28: 'black', 29: 'black', 30: 'red',
  31: 'black', 32: 'red', 33: 'black', 34: 'red', 35: 'black',
  36: 'red'
};
```

---

## Recent History Display

**Below the betting grid:**
- Last 10 spins shown as colored circles
- Each circle: diameter 30-40px, color matching the winning number
- Arranged in horizontal scrollable row
- Clickable: Show that spin's bets and outcome
- Tooltip on hover: Show number and timestamp

---

## "Clear Layout" Button

- Located below betting grid, before history circles
- Clears all current selections (activeBets = [])
- Deselects all visual indicators
- Red/warning styling (optional)

