import { WheelNumber, Color, Range, Dozen, RacetrackSection } from '../types/index';

const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

const TIER_NUMBERS = new Set([6, 11, 13, 14, 16, 18, 20, 22, 24, 27, 30, 33, 36]);
const ORPHELINS_NUMBERS = new Set([1, 9, 14, 17, 20, 31, 34]);
const ZERO_SPIEL_NUMBERS = new Set([0, 3, 12, 15, 26, 32, 35]);
const VOISINS_NUMBERS = new Set([2, 4, 5, 7, 8, 10, 19, 21, 23, 25, 28, 29, 31]);

export const WHEEL_PROPERTIES: Record<number, WheelNumber> = {};

for (let num = 0; num <= 36; num++) {
  let color: Color;
  let range: Range;
  let dozen: Dozen;
  let racetrack: RacetrackSection;

  if (num === 0) {
    color = 'green';
    range = 'zero';
    dozen = 'zero';
  } else {
    color = RED_NUMBERS.has(num) ? 'red' : 'black';
    range = num >= 1 && num <= 18 ? 'low' : 'high';
    dozen = num >= 1 && num <= 12 ? '1st' : num >= 13 && num <= 24 ? '2nd' : '3rd';
  }

  if (TIER_NUMBERS.has(num)) {
    racetrack = 'tier';
  } else if (ORPHELINS_NUMBERS.has(num)) {
    racetrack = 'orphelins';
  } else if (ZERO_SPIEL_NUMBERS.has(num)) {
    racetrack = 'zeroSpiel';
  } else if (VOISINS_NUMBERS.has(num)) {
    racetrack = 'voisins';
  } else {
    racetrack = null;
  }

  WHEEL_PROPERTIES[num] = {
    number: num,
    color,
    range,
    dozen,
    racetrack,
  };
}

export const getWheelNumber = (num: number): WheelNumber | null => {
  return WHEEL_PROPERTIES[num] ?? null;
};
