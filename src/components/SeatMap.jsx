import { useMemo } from 'react';
import { generateSeatMap } from '../data/generateSeatMap';
import './SeatMap.css';

const formatINR = (n) =>
  n === 0 ? 'Free' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function SeatMap({ flightId, basePrice, passengerCount, selectedSeats, onToggleSeat }) {
  const { rows, cols, seats } = useMemo(() => generateSeatMap(flightId, basePrice), [flightId, basePrice]);

  const seatByPos = useMemo(() => {
    const map = new Map();
    seats.forEach((s) => map.set(s.id, s));
    return map;
  }, [seats]);

  function seatState(seat) {
    if (seat.occupied) return 'occupied';
    if (selectedSeats.includes(seat.id)) return 'selected';
    return 'available';
  }

  function handleClick(seat) {
    if (seat.occupied) return;
    const isSelected = selectedSeats.includes(seat.id);
    if (!isSelected && selectedSeats.length >= passengerCount) return;
    onToggleSeat(seat.id, seat.price);
  }

  return (
    <div className="seat-map">
      <div className="seat-map__legend">
        <LegendItem tone="available" label="Available" />
        <LegendItem tone="selected" label="Selected" />
        <LegendItem tone="occupied" label="Occupied" />
        <LegendItem tone="premium" label="Premium (front row)" />
        <LegendItem tone="extra-legroom" label="Extra legroom" />
      </div>

      <div className="seat-map__cabin">
        <div className="seat-map__nose">Front</div>
        <div className="seat-map__col-headers">
          <span className="seat-map__row-num-spacer" />
          {cols.map((c) => (
            <span key={c} className={`seat-map__col-header ${c === 'C' ? 'has-aisle' : ''}`}>{c}</span>
          ))}
        </div>
        <div className="seat-map__rows">
          {Array.from({ length: rows }, (_, i) => i + 1).map((row) => (
            <div className="seat-map__row" key={row}>
              <span className="seat-map__row-num">{row}</span>
              {cols.map((col) => {
                const seat = seatByPos.get(`${row}${col}`);
                const state = seatState(seat);
                return (
                  <button
                    type="button"
                    key={col}
                    className={`seat-map__seat seat-map__seat--${state} seat-map__seat--${seat.tier} ${seat.aisleGapAfter ? 'has-aisle' : ''}`}
                    disabled={state === 'occupied'}
                    onClick={() => handleClick(seat)}
                    title={`${seat.id} · ${seat.tier.replace('-', ' ')} · ${formatINR(seat.price)}`}
                    aria-label={`Seat ${seat.id}, ${state}, ${formatINR(seat.price)}`}
                    aria-pressed={state === 'selected'}
                  >
                    {seat.id}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="seat-map__hint">
        {selectedSeats.length}/{passengerCount} seat{passengerCount > 1 ? 's' : ''} selected
        {selectedSeats.length >= passengerCount ? ' — you\'re all set.' : ` — choose ${passengerCount - selectedSeats.length} more.`}
      </p>
    </div>
  );
}

function LegendItem({ tone, label }) {
  return (
    <div className="seat-map__legend-item">
      <span className={`seat-map__legend-swatch seat-map__legend-swatch--${tone}`} />
      {label}
    </div>
  );
}
