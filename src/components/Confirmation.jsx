import { useEffect, useState } from 'react';
import { CheckCircle2, Download, PlaneTakeoff, QrCode } from 'lucide-react';
import SplitFlap from './SplitFlap';
import { findAirport } from '../data/airports';
import './Confirmation.css';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function Confirmation({ booking, onNewSearch, onViewHistory }) {
  const [showBadge, setShowBadge] = useState(false);
  const origin = findAirport(booking.flight.origin);
  const destination = findAirport(booking.flight.destination);
  const passenger = booking.travellers[0];

  useEffect(() => {
    const t = setTimeout(() => setShowBadge(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="confirmation">
      <div className={`confirmation__badge ${showBadge ? 'is-visible' : ''}`}>
        <CheckCircle2 size={22} strokeWidth={2.4} />
        Booking confirmed
      </div>

      <div className="boarding-pass">
        <div className="boarding-pass__main">
          <div className="boarding-pass__header">
            <span className="boarding-pass__airline" style={{ color: booking.flight.airline.color }}>
              {booking.flight.airline.name}
            </span>
            <span className="boarding-pass__pnr">
              PNR <SplitFlap text={booking.pnr} delay={200} duration={650} />
            </span>
          </div>

          <div className="boarding-pass__route">
            <div className="boarding-pass__city-block">
              <span className="boarding-pass__code"><SplitFlap text={booking.flight.origin} delay={400} duration={500} /></span>
              <span className="boarding-pass__city">{origin?.city}</span>
              <span className="boarding-pass__time">{booking.flight.departTime}</span>
            </div>
            <PlaneTakeoff size={22} strokeWidth={2} className="boarding-pass__plane" />
            <div className="boarding-pass__city-block boarding-pass__city-block--end">
              <span className="boarding-pass__code"><SplitFlap text={booking.flight.destination} delay={550} duration={500} /></span>
              <span className="boarding-pass__city">{destination?.city}</span>
              <span className="boarding-pass__time">{booking.flight.arriveTime}</span>
            </div>
          </div>

          <div className="boarding-pass__grid">
            <PassField label="Passenger" value={`${passenger?.firstName || ''} ${passenger?.lastName || ''}`.trim().toUpperCase() || '—'} />
            <PassField label="Flight" value={booking.flight.flightNumber} />
            <PassField label="Date" value={booking.flight.date} />
            <PassField label="Seat(s)" value={booking.seats.length ? booking.seats.join(', ') : 'Not assigned'} />
            <PassField label="Fare" value={booking.fare?.name || 'Standard'} />
            <PassField label="Gate" value="TBD" />
          </div>
        </div>

        <div className="boarding-pass__stub">
          <QrCode size={64} strokeWidth={1.2} />
          <span className="boarding-pass__stub-pnr"><SplitFlap text={booking.pnr} delay={700} duration={500} /></span>
          <span className="boarding-pass__stub-total">{formatINR(booking.total)}</span>
        </div>
      </div>

      <p className="confirmation__note">
        A confirmation with your e-ticket has been sent to <strong>{booking.contact.email || 'your email'}</strong>.
        Keep your PNR handy for check-in.
      </p>

      <div className="confirmation__actions">
        <button type="button" className="confirmation__btn confirmation__btn--primary" onClick={onNewSearch}>
          Book another flight
        </button>
        <button type="button" className="confirmation__btn" onClick={onViewHistory}>
          <Download size={15} strokeWidth={2} /> View booking history
        </button>
      </div>
    </div>
  );
}

function PassField({ label, value }) {
  return (
    <div className="boarding-pass__field">
      <span className="boarding-pass__field-label">{label}</span>
      <span className="boarding-pass__field-value">{value}</span>
    </div>
  );
}
