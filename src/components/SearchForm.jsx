import { useState } from 'react';
import { ArrowLeftRight, Plus, X, Search, CalendarDays } from 'lucide-react';
import AirportInput from './AirportInput';
import PassengerSelector from './PassengerSelector';
import './SearchForm.css';

const TRIP_TYPES = [
  { id: 'oneway', label: 'One way' },
  { id: 'roundtrip', label: 'Round trip' },
  { id: 'multicity', label: 'Multi-city' },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function SearchForm({ onSearch, initial }) {
  const [tripType, setTripType] = useState(initial?.tripType || 'oneway');
  const [origin, setOrigin] = useState(initial?.origin || 'DEL');
  const [destination, setDestination] = useState(initial?.destination || 'BOM');
  const [departDate, setDepartDate] = useState(initial?.departDate || todayISO());
  const [returnDate, setReturnDate] = useState(initial?.returnDate || addDaysISO(todayISO(), 4));
  const [legs, setLegs] = useState(
    initial?.legs || [
      { origin: 'DEL', destination: 'BOM', date: todayISO() },
      { origin: 'BOM', destination: 'BLR', date: addDaysISO(todayISO(), 2) },
    ]
  );
  const [passengers, setPassengers] = useState(initial?.passengers || { adults: 1, children: 0, infants: 0 });
  const [cabin, setCabin] = useState(initial?.cabin || 'Economy');
  const [error, setError] = useState('');

  function swap() {
    setOrigin(destination);
    setDestination(origin);
  }

  function updateLeg(index, field, value) {
    setLegs((prev) => prev.map((leg, i) => (i === index ? { ...leg, [field]: value } : leg)));
  }

  function addLeg() {
    if (legs.length >= 5) return;
    const last = legs[legs.length - 1];
    setLegs((prev) => [
      ...prev,
      { origin: last.destination, destination: '', date: addDaysISO(last.date, 1) },
    ]);
  }

  function removeLeg(index) {
    if (legs.length <= 2) return;
    setLegs((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (tripType === 'multicity') {
      for (const leg of legs) {
        if (!leg.origin || !leg.destination || !leg.date) {
          setError('Please complete every city and date for each leg.');
          return;
        }
        if (leg.origin === leg.destination) {
          setError('Origin and destination cannot be the same on a leg.');
          return;
        }
      }
      onSearch({ tripType, legs, passengers, cabin });
      return;
    }

    if (!origin || !destination) {
      setError('Choose both an origin and a destination.');
      return;
    }
    if (origin === destination) {
      setError('Origin and destination cannot be the same city.');
      return;
    }
    if (tripType === 'roundtrip' && returnDate < departDate) {
      setError('Return date cannot be before the departure date.');
      return;
    }

    onSearch({
      tripType,
      origin,
      destination,
      departDate,
      returnDate: tripType === 'roundtrip' ? returnDate : null,
      passengers,
      cabin,
    });
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-form__trip-types" role="radiogroup" aria-label="Trip type">
        {TRIP_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={tripType === t.id}
            className={`trip-type-pill ${tripType === t.id ? 'is-active' : ''}`}
            onClick={() => setTripType(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tripType !== 'multicity' ? (
        <div className="search-form__row">
          <div className="search-form__od">
            <AirportInput label="From" value={origin} onChange={setOrigin} excludeCode={destination} />
            <button type="button" className="search-form__swap" onClick={swap} aria-label="Swap origin and destination">
              <ArrowLeftRight size={16} strokeWidth={2.2} />
            </button>
            <AirportInput label="To" value={destination} onChange={setDestination} excludeCode={origin} />
          </div>

          <div className="search-form__dates">
            <div className="date-field">
              <label className="airport-input__label" htmlFor="depart-date">Departure</label>
              <div className="date-field__input">
                <CalendarDays size={16} strokeWidth={2} />
                <input
                  id="depart-date"
                  type="date"
                  min={todayISO()}
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  required
                />
              </div>
            </div>
            {tripType === 'roundtrip' && (
              <div className="date-field">
                <label className="airport-input__label" htmlFor="return-date">Return</label>
                <div className="date-field__input">
                  <CalendarDays size={16} strokeWidth={2} />
                  <input
                    id="return-date"
                    type="date"
                    min={departDate}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <PassengerSelector passengers={passengers} onChange={setPassengers} cabin={cabin} onCabinChange={setCabin} />

          <button type="submit" className="search-form__submit">
            <Search size={17} strokeWidth={2.4} />
            Search flights
          </button>
        </div>
      ) : (
        <div className="search-form__multicity">
          {legs.map((leg, i) => (
            <div className="multicity-leg" key={i}>
              <span className="multicity-leg__index">{i + 1}</span>
              <AirportInput
                label="From"
                value={leg.origin}
                onChange={(v) => updateLeg(i, 'origin', v)}
                excludeCode={leg.destination}
              />
              <AirportInput
                label="To"
                value={leg.destination}
                onChange={(v) => updateLeg(i, 'destination', v)}
                excludeCode={leg.origin}
              />
              <div className="date-field">
                <label className="airport-input__label" htmlFor={`leg-date-${i}`}>Date</label>
                <div className="date-field__input">
                  <CalendarDays size={16} strokeWidth={2} />
                  <input
                    id={`leg-date-${i}`}
                    type="date"
                    min={todayISO()}
                    value={leg.date}
                    onChange={(e) => updateLeg(i, 'date', e.target.value)}
                    required
                  />
                </div>
              </div>
              {legs.length > 2 && (
                <button
                  type="button"
                  className="multicity-leg__remove"
                  onClick={() => removeLeg(i)}
                  aria-label={`Remove leg ${i + 1}`}
                >
                  <X size={16} strokeWidth={2.2} />
                </button>
              )}
            </div>
          ))}

          <div className="search-form__multicity-footer">
            <button type="button" className="multicity-add" onClick={addLeg} disabled={legs.length >= 5}>
              <Plus size={15} strokeWidth={2.4} /> Add another flight
            </button>
            <PassengerSelector passengers={passengers} onChange={setPassengers} cabin={cabin} onCabinChange={setCabin} />
            <button type="submit" className="search-form__submit">
              <Search size={17} strokeWidth={2.4} />
              Search flights
            </button>
          </div>
        </div>
      )}

      {error && <p className="search-form__error" role="alert">{error}</p>}
    </form>
  );
}
