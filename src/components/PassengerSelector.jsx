import { useState, useRef, useEffect } from 'react';
import { Users, Minus, Plus } from 'lucide-react';
import './PassengerSelector.css';

const CABINS = ['Economy', 'Premium Economy', 'Business'];

export default function PassengerSelector({ passengers, onChange, cabin, onCabinChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const total = passengers.adults + passengers.children + passengers.infants;

  function update(field, delta) {
    onChange((prev) => {
      const next = { ...prev, [field]: Math.max(field === 'adults' ? 1 : 0, prev[field] + delta) };
      if (field === 'adults') next.adults = Math.min(9, next.adults);
      if (next.infants > next.adults) next.infants = next.adults;
      return next;
    });
  }

  return (
    <div className="pax-selector" ref={wrapRef}>
      <label className="airport-input__label">Passengers &amp; class</label>
      <button
        type="button"
        className="pax-selector__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <Users size={17} strokeWidth={2} />
        <span>{total} {total === 1 ? 'passenger' : 'passengers'}</span>
        <span className="pax-selector__cabin-tag">{cabin}</span>
      </button>

      {open && (
        <div className="pax-selector__panel">
          <PaxRow
            label="Adults"
            sub="12+ years"
            value={passengers.adults}
            onDec={() => update('adults', -1)}
            onInc={() => update('adults', 1)}
            disableDec={passengers.adults <= 1}
          />
          <PaxRow
            label="Children"
            sub="2–11 years"
            value={passengers.children}
            onDec={() => update('children', -1)}
            onInc={() => update('children', 1)}
            disableDec={passengers.children <= 0}
          />
          <PaxRow
            label="Infants"
            sub="Under 2 years"
            value={passengers.infants}
            onDec={() => update('infants', -1)}
            onInc={() => update('infants', 1)}
            disableDec={passengers.infants <= 0}
            disableInc={passengers.infants >= passengers.adults}
          />

          <div className="pax-selector__divider" />

          <div className="pax-selector__cabins">
            {CABINS.map((c) => (
              <button
                type="button"
                key={c}
                className={`pax-selector__cabin ${cabin === c ? 'is-active' : ''}`}
                onClick={() => onCabinChange(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <button type="button" className="pax-selector__done" onClick={() => setOpen(false)}>
            Done
          </button>
        </div>
      )}
    </div>
  );
}

function PaxRow({ label, sub, value, onDec, onInc, disableDec, disableInc }) {
  return (
    <div className="pax-row">
      <div>
        <div className="pax-row__label">{label}</div>
        <div className="pax-row__sub">{sub}</div>
      </div>
      <div className="pax-row__controls">
        <button type="button" onClick={onDec} disabled={disableDec} aria-label={`Decrease ${label}`}>
          <Minus size={14} strokeWidth={2.5} />
        </button>
        <span>{value}</span>
        <button type="button" onClick={onInc} disabled={disableInc} aria-label={`Increase ${label}`}>
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
