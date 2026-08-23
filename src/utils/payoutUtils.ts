export const calculatePayout = (bets: Record<string, number>, winningNumber: number): number => {
  let totalBetAmount = 0;
  let totalPayout = 0;

  const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(winningNumber);
  const isBlack = winningNumber !== 0 && !isRed;
  const isEven = winningNumber !== 0 && winningNumber % 2 === 0;
  const isOdd = winningNumber !== 0 && winningNumber % 2 !== 0;
  const isLow = winningNumber >= 1 && winningNumber <= 18;
  const isHigh = winningNumber >= 19 && winningNumber <= 36;

  Object.entries(bets).forEach(([betId, amount]) => {
    totalBetAmount += amount;

    // Straight Up (35:1)
    if (betId.startsWith('num-')) {
      const num = parseInt(betId.replace('num-', ''), 10);
      if (num === winningNumber) totalPayout += amount * 35 + amount;
    }
    // Street Bet (11:1)
    else if (betId.startsWith('street-')) {
      const [, start, end] = betId.split('-').map(Number);
      if (winningNumber >= start && winningNumber <= end) totalPayout += amount * 11 + amount;
    }
    // Splits (17:1)
    else if (betId.startsWith('split-')) {
      const parts = betId.split('-').slice(2).map(Number);
      if (parts.includes(winningNumber)) totalPayout += amount * 17 + amount;
    }
    // Corner Bet (8:1)
    else if (betId.startsWith('corner-')) {
      const parts = betId.split('-').slice(1).map(Number);
      if (parts.includes(winningNumber)) totalPayout += amount * 8 + amount;
    }
    // Dozens (2:1)
    else if (betId === 'dozen-1' && winningNumber >= 1 && winningNumber <= 12) totalPayout += amount * 2 + amount;
    else if (betId === 'dozen-2' && winningNumber >= 13 && winningNumber <= 24) totalPayout += amount * 2 + amount;
    else if (betId === 'dozen-3' && winningNumber >= 25 && winningNumber <= 36) totalPayout += amount * 2 + amount;
    // Columns (2:1)
    else if (betId === 'col-1' && winningNumber > 0 && winningNumber % 3 === 1) totalPayout += amount * 2 + amount;
    else if (betId === 'col-2' && winningNumber > 0 && winningNumber % 3 === 2) totalPayout += amount * 2 + amount;
    else if (betId === 'col-3' && winningNumber > 0 && winningNumber % 3 === 0) totalPayout += amount * 2 + amount;
    // Outside Even Money (1:1)
    else if (betId === 'outside-red' && isRed) totalPayout += amount * 1 + amount;
    else if (betId === 'outside-black' && isBlack) totalPayout += amount * 1 + amount;
    else if (betId === 'outside-even' && isEven) totalPayout += amount * 1 + amount;
    else if (betId === 'outside-odd' && isOdd) totalPayout += amount * 1 + amount;
    else if (betId === 'outside-1-18' && isLow) totalPayout += amount * 1 + amount;
    else if (betId === 'outside-19-36' && isHigh) totalPayout += amount * 1 + amount;
  });

  return totalPayout - totalBetAmount;
};