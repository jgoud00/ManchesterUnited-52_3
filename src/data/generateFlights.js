import { AIRLINES } from './airlines';

// Simple deterministic PRNG so the same route/date always yields the same flights
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

function pad(n) {
  return n.toString().padStart(2, '0');
}

function minutesToTime(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${pad(h)}:${pad(m)}`;
}

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${pad(m)}m`;
}

const AIRCRAFT = ['Airbus A320neo', 'Boeing 737 MAX', 'Airbus A321', 'Boeing 787-8', 'ATR 72-600'];

// Rough regional distance banding so duration feels plausible without real geo data
function baseDurationFor(origin, destination) {
  const combined = hashString(origin + destination);
  return 55 + (combined % 5) * 25; // 55 to 155 min band, deterministic per route
}

export function generateFlights({ origin, destination, date, passengers = 1 }) {
  if (!origin || !destination || !date) return [];
  const seedStr = `${origin}-${destination}-${date}`;
  const rand = seededRandom(hashString(seedStr));
  const count = 6 + Math.floor(rand() * 5); // 6-10 flights
  const baseDuration = baseDurationFor(origin, destination);

  const flights = [];
  for (let i = 0; i < count; i++) {
    const airline = AIRLINES[Math.floor(rand() * AIRLINES.length)];
    const depMinutes = Math.floor(rand() * 24 * 60);
    const durationJitter = Math.floor(rand() * 40) - 15;
    const duration = Math.max(45, baseDuration + durationJitter);
    const stops = rand() < 0.72 ? 0 : rand() < 0.85 ? 1 : 2;
    const stopPenalty = stops * (45 + Math.floor(rand() * 40));
    const totalDuration = duration + stopPenalty;
    const arrMinutes = depMinutes + totalDuration;

    const basePrice = 2800 + Math.round((baseDuration + stopPenalty) * 12);
    const priceJitter = Math.floor(rand() * 2200) - 400;
    const airlinePremium = airline.code === 'VT' ? 900 : airline.code === 'AI' ? 300 : 0;
    const price = Math.max(1799, basePrice + priceJitter + airlinePremium) * passengers;

    const aircraft = AIRCRAFT[Math.floor(rand() * AIRCRAFT.length)];
    const flightNumber = `${airline.code}${100 + Math.floor(rand() * 899)}`;
    const legroom = rand() < 0.3 ? 'Extra legroom available' : null;
    const meal = rand() < 0.6;
    const refundable = rand() < 0.4;
    const seatsLeft = 1 + Math.floor(rand() * 9);
    const rating = (3.4 + rand() * 1.5).toFixed(1);

    flights.push({
      id: `${seedStr}-${i}`,
      airline,
      flightNumber,
      origin,
      destination,
      date,
      departTime: minutesToTime(depMinutes < 0 ? depMinutes + 1440 : depMinutes % 1440),
      arriveTime: minutesToTime(((arrMinutes % 1440) + 1440) % 1440),
      nextDayArrival: arrMinutes >= 1440,
      duration: totalDuration,
      durationLabel: formatDuration(totalDuration),
      stops,
      price,
      aircraft,
      legroom,
      meal,
      refundable,
      seatsLeft,
      rating: Number(rating),
      baggage: '15kg check-in + 7kg cabin',
    });
  }

  return flights.sort((a, b) => a.departTime.localeCompare(b.departTime));
}
