import { Check } from 'lucide-react';
import './StepBar.css';

const STEPS = [
  { id: 'results', label: 'Flights' },
  { id: 'fare', label: 'Fare' },
  { id: 'seats', label: 'Seats' },
  { id: 'passengers', label: 'Travellers' },
  { id: 'review', label: 'Review' },
];

export default function StepBar({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);
  return (
    <nav className="step-bar" aria-label="Booking progress">
      {STEPS.map((s, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'upcoming';
        return (
          <div className={`step-bar__item step-bar__item--${state}`} key={s.id}>
            <span className="step-bar__dot">{state === 'done' ? <Check size={12} strokeWidth={3} /> : i + 1}</span>
            <span className="step-bar__label">{s.label}</span>
            {i < STEPS.length - 1 && <span className="step-bar__connector" />}
          </div>
        );
      })}
    </nav>
  );
}
