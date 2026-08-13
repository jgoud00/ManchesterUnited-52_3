import { findAirport } from '../data/airports';
import { PlaneTakeoff, Armchair, Tag } from 'lucide-react';
import './BookingSummary.css';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function BookingSummary({ flight, fare, seats, seatFees, passengerCount, step }) {
  if (!flight) return null;
  const origin = findAirport(flight.origin);
  const destination = findAirport(flight.destination);

  const fareTotal = fare ? fare.price : flight.price;
  const taxes = Math.round(fareTotal * 0.12);
  const seatTotal = seatFees.reduce((sum, f) => sum + f, 0);
  const grandTotal = fareTotal + taxes + seatTotal;

  return (
    <div className="booking-summary">
      <h3 className="booking-summary__title">
        <PlaneTakeoff size={16} strokeWidth={2.2} /> Booking summary
      </h3>

      <div className="booking-summary__flight">
        <div className="booking-summary__airline">
          <span className="booking-summary__logo" style={{ background: flight.airline.color }}>
            {flight.airline.short}
          </span>
          <div>
            <div className="booking-summary__airline-name">{flight.airline.name}</div>
            <div className="booking-summary__flight-no">{flight.flightNumber}</div>
          </div>
        </div>

        <div className="booking-summary__route">
          <div>
            <div className="booking-summary__time">{flight.departTime}</div>
            <div className="booking-summary__code">{flight.origin} · {origin?.city}</div>
          </div>
          <div className="booking-summary__arrow">→</div>
          <div className="booking-summary__route-end">
            <div className="booking-summary__time">{flight.arriveTime}</div>
            <div className="booking-summary__code">{flight.destination} · {destination?.city}</div>
          </div>
        </div>
        <div className="booking-summary__meta">{flight.date} · {flight.durationLabel} · {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop`}</div>
      </div>

      {fare && (
        <div className="booking-summary__row">
          <span><Tag size={13} strokeWidth={2} /> Fare type</span>
          <span className="booking-summary__row-value">{fare.name}</span>
        </div>
      )}

      {seats.length > 0 && (
        <div className="booking-summary__row">
          <span><Armchair size={13} strokeWidth={2} /> Seats</span>
          <span className="booking-summary__row-value">{seats.join(', ')}</span>
        </div>
      )}

      <div className="booking-summary__divider" />

      <div className="booking-summary__line">
        <span>Fare ({passengerCount} traveller{passengerCount > 1 ? 's' : ''})</span>
        <span>{formatINR(fareTotal)}</span>
      </div>
      <div className="booking-summary__line">
        <span>Taxes &amp; fees</span>
        <span>{formatINR(taxes)}</span>
      </div>
      {seatTotal > 0 && (
        <div className="booking-summary__line">
          <span>Seat selection</span>
          <span>{formatINR(seatTotal)}</span>
        </div>
      )}

      <div className="booking-summary__divider" />

      <div className="booking-summary__total">
        <span>Total</span>
        <span>{formatINR(grandTotal)}</span>
      </div>

      {step && <p className="booking-summary__step-hint">{step}</p>}
    </div>
  );
}

export function calculateTotal(flight, fare, seatFees) {
  const fareTotal = fare ? fare.price : flight?.price || 0;
  const taxes = Math.round(fareTotal * 0.12);
  const seatTotal = seatFees.reduce((sum, f) => sum + f, 0);
  return fareTotal + taxes + seatTotal;
}
