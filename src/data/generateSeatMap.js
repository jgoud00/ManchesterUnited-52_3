function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function next() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];
const AISLE_AFTER = 'C'; // aisle sits between C and D

export function generateSeatMap(flightId, basePrice) {
  const rand = seededRandom(hashString(flightId));
  const rows = 24;
  const seats = [];

  for (let row = 1; row <= rows; row++) {
    const isExitRow = row === 12 || row === 13;
    const isFront = row <= 4;
    const tier = isFront ? 'premium' : isExitRow ? 'extra-legroom' : 'standard';
    const priceMap = {
      premium: Math.round(basePrice * 0.12 / 50) * 50 + 900,
      'extra-legroom': Math.round(basePrice * 0.06 / 50) * 50 + 400,
      standard: 0,
    };

    for (const col of COLS) {
      const occupiedRoll = rand();
      const seatId = `${row}${col}`;
      seats.push({
        id: seatId,
        row,
        col,
        tier,
        price: priceMap[tier],
        occupied: occupiedRoll < 0.32,
        isWindow: col === 'A' || col === 'F',
        isAisle: col === 'C' || col === 'D',
        isMiddle: col === 'B' || col === 'E',
        aisleGapAfter: col === AISLE_AFTER,
      });
    }
  }

  return { rows, cols: COLS, seats };
}
