import { useState, useRef, useEffect, useId } from 'react';
import { AIRPORTS } from '../data/airports';
import { MapPin } from 'lucide-react';
import './AirportInput.css';

export default function AirportInput({ label, value, onChange, excludeCode, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef(null);
  const listId = useId();

  const selected = AIRPORTS.find((a) => a.code === value);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = AIRPORTS.filter((a) => {
    if (a.code === excludeCode) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      a.city.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
    );
  }).slice(0, 7);

  return (
    <div className="airport-input" data-open={open} ref={wrapRef}>
      <label className="airport-input__label" htmlFor={listId}>{label}</label>
      <button
        type="button"
        id={listId}
        className="airport-input__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected ? (
          <span className="airport-input__value">
            <span className="airport-input__code">{selected.code}</span>
            <span className="airport-input__city">{selected.city}</span>
          </span>
        ) : (
          <span className="airport-input__placeholder">{placeholder || 'Select city'}</span>
        )}
      </button>

      {open && (
        <div className="airport-input__panel" role="listbox">
          <div className="airport-input__search">
            <MapPin size={15} strokeWidth={2} />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city or airport code"
            />
          </div>
          <ul className="airport-input__list">
            {filtered.length === 0 && (
              <li className="airport-input__empty">No airports match "{query}"</li>
            )}
            {filtered.map((a) => (
              <li key={a.code}>
                <button
                  type="button"
                  className="airport-input__option"
                  onClick={() => {
                    onChange(a.code);
                    setOpen(false);
                    setQuery('');
                  }}
                >
                  <span className="airport-input__option-code">{a.code}</span>
                  <span className="airport-input__option-meta">
                    <span className="airport-input__option-city">{a.city}, {a.country}</span>
                    <span className="airport-input__option-name">{a.name}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
