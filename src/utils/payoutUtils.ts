export function calculatePayout(bets: Record<string, number>, winningNumber: number): number {
  if (Object.keys(bets).length === 0) return 0;

  let totalWinnings = 0;
  let totalBetsPlaced = 0;

  Object.entries(bets).forEach(([betId, stake]) => {
    totalBetsPlaced += stake;
    let isWin = false;
    let multiplier = 0;

    // 1. Straight-Up Bet (35:1) -> e.g., "num-1"
    if (betId === `num-${winningNumber}`) {
      isWin = true;
      multiplier = 35;
    }

    // 2. Street Bet (11:1) -> e.g., "street-1-3"
    else if (betId.startsWith('street-')) {
      const [, minStr, maxStr] = betId.split('-');
      const min = Number(minStr);
      const max = Number(maxStr);
      if (winningNumber >= min && winningNumber <= max) {
        isWin = true;
        multiplier = 11;
      }
    }

    // 3. Horizontal & Vertical Split Bets (17:1) -> e.g., "split-h-1-2", "split-v-1-4"
    else if (betId.startsWith('split-')) {
      const numbers = betId.replace(/^split-[hv]-/, '').split('-').map(Number);
      if (numbers.includes(winningNumber)) {
        isWin = true;
        multiplier = 17;
      }
    }

    // 4. Corner Bet (8:1) -> e.g., "corner-1-2-4-5"
    else if (betId.startsWith('corner-')) {
      const numbers = betId.replace('corner-', '').split('-').map(Number);
      if (numbers.includes(winningNumber)) {
        isWin = true;
        multiplier = 8;
      }
    }

    // 5. Dozen Bets (2:1) -> "dozen-1", "dozen-2", "dozen-3"
    else if (betId === 'dozen-1' && winningNumber >= 1 && winningNumber <= 12) {
      isWin = true;
      multiplier = 2;
    } else if (betId === 'dozen-2' && winningNumber >= 13 && winningNumber <= 24) {
      isWin = true;
      multiplier = 2;
    } else if (betId === 'dozen-3' && winningNumber >= 25 && winningNumber <= 36) {
      isWin = true;
      multiplier = 2;
    }

    // 6. Column Bets (2:1) -> "col-1", "col-2", "col-3"
    else if (betId === 'col-1' && winningNumber % 3 === 1) {
      isWin = true;
      multiplier = 2;
    } else if (betId === 'col-2' && winningNumber % 3 === 2) {
      isWin = true;
      multiplier = 2;
    } else if (betId === 'col-3' && winningNumber % 3 === 0 && winningNumber !== 0) {
      isWin = true;
      multiplier = 2;
    }

    // 7. Outside Even-Money Bets (1:1)
    else if (betId === 'outside-1-18' && winningNumber >= 1 && winningNumber <= 18) {
      isWin = true;
      multiplier = 1;
    } else if (betId === 'outside-19-36' && winningNumber >= 19 && winningNumber <= 36) {
      isWin = true;
      multiplier = 1;
    } else if (betId === 'outside-even' && winningNumber % 2 === 0 && winningNumber !== 0) {
      isWin = true;
      multiplier = 1;
    } else if (betId === 'outside-odd' && winningNumber % 2 !== 0) {
      isWin = true;
      multiplier = 1;
    } else if (betId === 'outside-red' && [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(winningNumber)) {
      isWin = true;
      multiplier = 1;
    } else if (betId === 'outside-black' && winningNumber !== 0 && ![1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(winningNumber)) {
      isWin = true;
      multiplier = 1;
    }

    if (isWin) {
      totalWinnings += stake * (multiplier + 1);
    }
  });

  return totalWinnings - totalBetsPlaced;
}
