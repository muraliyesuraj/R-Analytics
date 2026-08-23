import { WHEEL_PROPERTIES, getWheelNumber } from '../data/wheelProperties';

describe('wheelProperties', () => {
  it('should map all 37 numbers (0-36)', () => {
    for (let i = 0; i <= 36; i++) {
      expect(WHEEL_PROPERTIES[i]).toBeDefined();
      expect(WHEEL_PROPERTIES[i].number).toBe(i);
    }
  });

  it('should have correct color for green (0)', () => {
    expect(WHEEL_PROPERTIES[0].color).toBe('green');
  });

  it('should have correct colors for red numbers', () => {
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    redNumbers.forEach((num) => {
      expect(WHEEL_PROPERTIES[num].color).toBe('red');
    });
  });

  it('should have correct colors for black numbers', () => {
    const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
    blackNumbers.forEach((num) => {
      expect(WHEEL_PROPERTIES[num].color).toBe('black');
    });
  });

  it('should have correct range for low (1-18)', () => {
    for (let i = 1; i <= 18; i++) {
      expect(WHEEL_PROPERTIES[i].range).toBe('low');
    }
  });

  it('should have correct range for high (19-36)', () => {
    for (let i = 19; i <= 36; i++) {
      expect(WHEEL_PROPERTIES[i].range).toBe('high');
    }
  });

  it('should have correct range for zero', () => {
    expect(WHEEL_PROPERTIES[0].range).toBe('zero');
  });

  it('should have correct dozen for 1st (1-12)', () => {
    for (let i = 1; i <= 12; i++) {
      expect(WHEEL_PROPERTIES[i].dozen).toBe('1st');
    }
  });

  it('should have correct dozen for 2nd (13-24)', () => {
    for (let i = 13; i <= 24; i++) {
      expect(WHEEL_PROPERTIES[i].dozen).toBe('2nd');
    }
  });

  it('should have correct dozen for 3rd (25-36)', () => {
    for (let i = 25; i <= 36; i++) {
      expect(WHEEL_PROPERTIES[i].dozen).toBe('3rd');
    }
  });

  it('should have correct racetrack for tier', () => {
    const tierNumbers = [6, 11, 13, 14, 16, 18, 20, 22, 24, 27, 30, 33, 36];
    tierNumbers.forEach((num) => {
      expect(WHEEL_PROPERTIES[num].racetrack).toBe('tier');
    });
  });

  it('should have correct racetrack for orphelins', () => {
    const orphelinsNumbers = [1, 9, 14, 17, 20, 31, 34];
    orphelinsNumbers.forEach((num) => {
      expect(WHEEL_PROPERTIES[num].racetrack).toBe('orphelins');
    });
  });

  it('should have correct racetrack for zeroSpiel', () => {
    const zeroSpielNumbers = [0, 3, 12, 15, 26, 32, 35];
    zeroSpielNumbers.forEach((num) => {
      expect(WHEEL_PROPERTIES[num].racetrack).toBe('zeroSpiel');
    });
  });

  it('should have correct racetrack for voisins', () => {
    const voisinsNumbers = [2, 4, 5, 7, 8, 10, 19, 21, 23, 25, 28, 29, 31];
    voisinsNumbers.forEach((num) => {
      expect(WHEEL_PROPERTIES[num].racetrack).toBe('voisins');
    });
  });

  it('getWheelNumber should return correct number', () => {
    const wheelNum = getWheelNumber(7);
    expect(wheelNum).toBeDefined();
    expect(wheelNum?.number).toBe(7);
    expect(wheelNum?.color).toBe('red');
  });

  it('getWheelNumber should return null for invalid number', () => {
    expect(getWheelNumber(37)).toBeNull();
    expect(getWheelNumber(-1)).toBeNull();
  });
});
