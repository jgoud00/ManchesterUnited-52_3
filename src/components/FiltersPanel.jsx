import { AIRLINES } from '../data/airlines';
import './FiltersPanel.css';

const STOP_OPTIONS = [
  { id: 0, label: 'Nonstop' },
  { id: 1, label: '1 stop' },
  { id: 2, label: '2+ stops' },
];

export default function FiltersPanel({ filters, onChange, priceBounds, resultsCount }) {
  function toggleAirline(code) {
    onChange((prev) => {
      const set = new Set(prev.airlines);
      if (set.has(code)) {
        set.delete(code);
      } else {
        set.add(code);
      }
      return { ...prev, airlines: [...set] };
    });
  }

  function toggleStop(id) {
    onChange((prev) => {
      const set = new Set(prev.stops);
      set.has(id) ? set.delete(id) : set.add(id);
      return { ...prev, stops: [...set] };
    });
  }

  function reset() {
    onChange({ airlines: [], stops: [], maxPrice: priceBounds.max, refundableOnly: false, nonstopOnly: false });
  }

  const hasActiveFilters =
    filters.airlines.length > 0 ||
    filters.stops.length > 0 ||
    filters.refundableOnly ||
    filters.maxPrice < priceBounds.max;

  return (
    <aside className="filters-panel">
      <div className="filters-panel__header">
        <h2>Filters</h2>
        {hasActiveFilters && (
          <button type="button" className="filters-panel__reset" onClick={reset}>
            Reset
          </button>
        )}
      </div>
      <p className="filters-panel__count">{resultsCount} flight{resultsCount === 1 ? '' : 's'} found</p>

      <div className="filters-panel__section">
        <h3>Max price</h3>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={100}
          value={filters.maxPrice}
          onChange={(e) => onChange((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="filters-panel__range"
        />
        <div className="filters-panel__range-labels">
          <span>₹{priceBounds.min.toLocaleString('en-IN')}</span>
          <span className="filters-panel__range-current">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="filters-panel__section">
        <h3>Stops</h3>
        <div className="filters-panel__chips">
          {STOP_OPTIONS.map((s) => (
            <button
              type="button"
              key={s.id}
              className={`filters-panel__chip ${filters.stops.includes(s.id) ? 'is-active' : ''}`}
              onClick={() => toggleStop(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filters-panel__section">
        <h3>Airlines</h3>
        <div className="filters-panel__checklist">
          {AIRLINES.map((a) => (
            <label key={a.code} className="filters-panel__check">
              <input
                type="checkbox"
                checked={filters.airlines.includes(a.code)}
                onChange={() => toggleAirline(a.code)}
              />
              <span className="filters-panel__swatch" style={{ background: a.color }} />
              {a.name}
            </label>
          ))}
        </div>
      </div>

      <div className="filters-panel__section">
        <label className="filters-panel__check filters-panel__check--toggle">
          <input
            type="checkbox"
            checked={filters.refundableOnly}
            onChange={(e) => onChange((prev) => ({ ...prev, refundableOnly: e.target.checked }))}
          />
          Refundable fares only
        </label>
      </div>
    </aside>
  );
}

export function SortBar({ sort, onSortChange }) {
  const options = [
    { id: 'price', label: 'Cheapest' },
    { id: 'duration', label: 'Fastest' },
    { id: 'departure', label: 'Earliest departure' },
    { id: 'rating', label: 'Top rated' },
  ];
  return (
    <div className="sort-bar">
      <span className="sort-bar__label">Sort by</span>
      <div className="sort-bar__options">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className={`sort-bar__option ${sort === o.id ? 'is-active' : ''}`}
            onClick={() => onSortChange(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
