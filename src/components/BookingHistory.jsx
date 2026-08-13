import { PlaneTakeoff, Trash2, ArrowLeft } from 'lucide-react';
import { findAirport } from '../data/airports';
import './BookingHistory.css';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function BookingHistory({ history, onClear, onBack }) {
  return (
    <div className="booking-history">
      <div className="booking-history__header">
        <button type="button" className="booking-history__back" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={2.2} /> Back
        </button>
        <h2>Your bookings</h2>
        {history.length > 0 && (
          <button type="button" className="booking-history__clear" onClick={onClear}>
            <Trash2 size={14} strokeWidth={2} /> Clear history
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="booking-history__empty">
          <PlaneTakeoff size={32} strokeWidth={1.4} />
          <p>No bookings yet. Once you complete a booking, it'll be saved here on this device.</p>
        </div>
      ) : (
        <div className="booking-history__list">
          {history.map((b) => {
            const origin = findAirport(b.flight.origin);
            const destination = findAirport(b.flight.destination);
            return (
              <div className="booking-history__item" key={b.pnr + b.bookedAt}>
                <div className="booking-history__item-top">
                  <span className="booking-history__pnr">{b.pnr}</span>
                  <span className="booking-history__date">{new Date(b.bookedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="booking-history__route">
                  <span className="booking-history__logo" style={{ background: b.flight.airline.color }}>
                    {b.flight.airline.short}
                  </span>
                  <span className="booking-history__cities">
                    {origin?.city} ({b.flight.origin}) → {destination?.city} ({b.flight.destination})
                  </span>
                </div>
                <div className="booking-history__item-bottom">
                  <span>{b.flight.date} · {b.flight.departTime}</span>
                  <span className="booking-history__total">{formatINR(b.total)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
