import { Check, X } from 'lucide-react';
import './FareComparison.css';

const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

function buildFares(basePrice) {
  return [
    {
      id: 'saver',
      name: 'Saver',
      price: basePrice,
      cabin: false,
      checkin: '15 kg',
      seat: false,
      change: false,
      cancel: false,
      meal: false,
      priority: false,
    },
    {
      id: 'regular',
      name: 'Regular',
      price: Math.round((basePrice + 850) / 10) * 10,
      cabin: true,
      checkin: '20 kg',
      seat: true,
      change: 'Fee applies',
      cancel: 'Fee applies',
      meal: true,
      priority: false,
    },
    {
      id: 'flexi',
      name: 'Flexi',
      price: Math.round((basePrice + 2200) / 10) * 10,
      cabin: true,
      checkin: '25 kg',
      seat: true,
      change: 'Free',
      cancel: 'Free',
      meal: true,
      priority: true,
    },
  ];
}

const ROWS = [
  { key: 'cabin', label: 'Cabin baggage (7kg)' },
  { key: 'checkin', label: 'Check-in baggage' },
  { key: 'seat', label: 'Seat selection included' },
  { key: 'meal', label: 'Meal included' },
  { key: 'change', label: 'Date change' },
  { key: 'cancel', label: 'Cancellation' },
  { key: 'priority', label: 'Priority boarding' },
];

function Cell({ value }) {
  if (value === true) return <Check size={16} strokeWidth={2.5} className="fare-cell fare-cell--yes" />;
  if (value === false) return <X size={16} strokeWidth={2.5} className="fare-cell fare-cell--no" />;
  return <span className="fare-cell fare-cell--text">{value}</span>;
}

export default function FareComparison({ basePrice, selectedFareId, onSelect }) {
  const fares = buildFares(basePrice);

  return (
    <div className="fare-comparison">
      <h3 className="fare-comparison__title">Compare fares</h3>
      <div className="fare-comparison__grid">
        <div className="fare-comparison__row-labels">
          <div className="fare-comparison__row-label fare-comparison__row-label--header" />
          {ROWS.map((r) => (
            <div className="fare-comparison__row-label" key={r.key}>{r.label}</div>
          ))}
        </div>
        {fares.map((fare) => (
          <div
            key={fare.id}
            className={`fare-comparison__col ${selectedFareId === fare.id ? 'is-selected' : ''}`}
          >
            <button type="button" className="fare-comparison__col-header" onClick={() => onSelect(fare)}>
              <span className="fare-comparison__fare-name">{fare.name}</span>
              <span className="fare-comparison__fare-price">{formatINR(fare.price)}</span>
              {selectedFareId === fare.id && <span className="fare-comparison__badge">Selected</span>}
            </button>
            {ROWS.map((r) => (
              <div className="fare-comparison__cell" key={r.key}>
                <Cell value={fare[r.key]} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export { buildFares };
