export interface WheelNumber {
  color: 'red' | 'black' | 'green';
  range: 'low' | 'high' | 'zero';
  isOdd: boolean;
  isEven: boolean;
}

const WHEEL_LAYOUT: Record<number, WheelNumber> = {
  0: { color: 'green', range: 'zero', isOdd: false, isEven: true },
  1: { color: 'red', range: 'low', isOdd: true, isEven: false },
  2: { color: 'black', range: 'low', isOdd: false, isEven: true },
  3: { color: 'red', range: 'low', isOdd: true, isEven: false },
  4: { color: 'black', range: 'low', isOdd: false, isEven: true },
  5: { color: 'red', range: 'low', isOdd: true, isEven: false },
  6: { color: 'black', range: 'low', isOdd: false, isEven: true },
  7: { color: 'red', range: 'low', isOdd: true, isEven: false },
  8: { color: 'black', range: 'low', isOdd: false, isEven: true },
  9: { color: 'red', range: 'low', isOdd: true, isEven: false },
  10: { color: 'black', range: 'low', isOdd: false, isEven: true },
  11: { color: 'red', range: 'low', isOdd: true, isEven: false },
  12: { color: 'black', range: 'low', isOdd: false, isEven: true },
  13: { color: 'black', range: 'low', isOdd: true, isEven: false },
  14: { color: 'red', range: 'low', isOdd: false, isEven: true },
  15: { color: 'black', range: 'low', isOdd: true, isEven: false },
  16: { color: 'red', range: 'low', isOdd: false, isEven: true },
  17: { color: 'black', range: 'low', isOdd: true, isEven: false },
  18: { color: 'red', range: 'low', isOdd: false, isEven: true },
  19: { color: 'red', range: 'high', isOdd: true, isEven: false },
  20: { color: 'black', range: 'high', isOdd: false, isEven: true },
  21: { color: 'red', range: 'high', isOdd: true, isEven: false },
  22: { color: 'black', range: 'high', isOdd: false, isEven: true },
  23: { color: 'red', range: 'high', isOdd: true, isEven: false },
  24: { color: 'black', range: 'high', isOdd: false, isEven: true },
  25: { color: 'red', range: 'high', isOdd: true, isEven: false },
  26: { color: 'black', range: 'high', isOdd: false, isEven: true },
  27: { color: 'red', range: 'high', isOdd: true, isEven: false },
  28: { color: 'black', range: 'high', isOdd: false, isEven: true },
  29: { color: 'red', range: 'high', isOdd: true, isEven: false },
  30: { color: 'black', range: 'high', isOdd: false, isEven: true },
  31: { color: 'black', range: 'high', isOdd: true, isEven: false },
  32: { color: 'red', range: 'high', isOdd: false, isEven: true },
  33: { color: 'black', range: 'high', isOdd: true, isEven: false },
  34: { color: 'red', range: 'high', isOdd: false, isEven: true },
  35: { color: 'black', range: 'high', isOdd: true, isEven: false },
  36: { color: 'red', range: 'high', isOdd: true, isEven: false },
};

export function getWheelNumber(number: number): WheelNumber {
  return WHEEL_LAYOUT[number] || WHEEL_LAYOUT[0];
}

export function getNumberColor(number: number): string {
  const props = getWheelNumber(number);
  if (props.color === 'red') return '#dc2626';
  if (props.color === 'black') return '#1e293b';
  return '#059669';
}

export function getNumberForDisplay(number: number): string {
  if (number === 0) return '0';
  return number.toString();
}

export function calculateMetrics(spins: Spin[]) {
  const metrics = {
    redCount: 0,
    blackCount: 0,
    greenCount: 0,
    oddCount: 0,
    evenCount: 0,
    lowCount: 0,
    highCount: 0,
  };

  for (const spin of spins) {
    const props = getWheelNumber(spin.number);
    if (props.color === 'red') metrics.redCount++;
    if (props.color === 'black') metrics.blackCount++;
    if (props.color === 'green') metrics.greenCount++;
    if (props.isOdd) metrics.oddCount++;
    if (props.isEven) metrics.evenCount++;
    if (props.range === 'low') metrics.lowCount++;
    if (props.range === 'high') metrics.highCount++;
  }

  return metrics;
}

export function getPercentage(value: number, total: number): string {
  if (total === 0) return '0.0%';
  return ((value / total) * 100).toFixed(1) + '%';
}

