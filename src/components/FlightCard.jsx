import { PlaneTakeoff, Star, Luggage, Armchair, ShieldCheck } from 'lucide-react';
import { findAirport } from '../data/airports';
import './FlightCard.css';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function FlightCard({ flight, onSelect, selected }) {
  const origin = findAirport(flight.origin);
  const destination = findAirport(flight.destination);
  const stopsLabel = flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`;

  return (
    <article className={`flight-card ${selected ? 'is-selected' : ''}`}>
      <div className="flight-card__airline">
        <span className="flight-card__logo" style={{ background: flight.airline.color }}>
          {flight.airline.short}
        </span>
        <div>
          <div className="flight-card__airline-name">{flight.airline.name}</div>
          <div className="flight-card__flight-no">{flight.flightNumber} · {flight.aircraft}</div>
        </div>
      </div>

      <div className="flight-card__route">
        <div className="flight-card__time-block">
          <span className="flight-card__time">{flight.departTime}</span>
          <span className="flight-card__airport">{flight.origin}</span>
          <span className="flight-card__city">{origin?.city}</span>
        </div>

        <div className="flight-card__path">
          <span className="flight-card__duration">{flight.durationLabel}</span>
          <div className="flight-card__line">
            <span className="flight-card__dot" />
            <PlaneTakeoff size={14} strokeWidth={2} className="flight-card__plane" />
            <span className="flight-card__dot" />
          </div>
          <span className={`flight-card__stops ${flight.stops === 0 ? 'is-nonstop' : ''}`}>{stopsLabel}</span>
        </div>

        <div className="flight-card__time-block flight-card__time-block--end">
          <span className="flight-card__time">
            {flight.arriveTime}
            {flight.nextDayArrival && <sup className="flight-card__nextday">+1</sup>}
          </span>
          <span className="flight-card__airport">{flight.destination}</span>
          <span className="flight-card__city">{destination?.city}</span>
        </div>
      </div>

      <div className="flight-card__tags">
        <span className="flight-card__tag"><Luggage size={12} strokeWidth={2} /> {flight.baggage}</span>
        {flight.legroom && <span className="flight-card__tag"><Armchair size={12} strokeWidth={2} /> {flight.legroom}</span>}
        {flight.refundable && <span className="flight-card__tag flight-card__tag--refund"><ShieldCheck size={12} strokeWidth={2} /> Refundable</span>}
        <span className="flight-card__tag flight-card__tag--rating"><Star size={12} strokeWidth={2} fill="currentColor" /> {flight.rating}</span>
      </div>

      <div className="flight-card__price-block">
        <div className="flight-card__price">{formatINR(flight.price)}</div>
        <div className="flight-card__price-sub">
          {flight.seatsLeft <= 3 ? (
            <span className="flight-card__scarcity">Only {flight.seatsLeft} seats left</span>
          ) : (
            <span>per traveller total</span>
          )}
        </div>
        <button type="button" className="flight-card__select" onClick={() => onSelect(flight)}>
          Select
        </button>
      </div>
    </article>
  );
}
