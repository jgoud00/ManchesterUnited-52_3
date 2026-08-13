import { PlaneTakeoff, History } from 'lucide-react';
import './Header.css';

export default function Header({ onLogoClick, onHistoryClick, historyCount }) {
  return (
    <header className="site-header">
      <button type="button" className="site-header__logo" onClick={onLogoClick}>
        <span className="site-header__mark">
          <PlaneTakeoff size={18} strokeWidth={2.4} />
        </span>
        <span className="site-header__wordmark">
          Sky<span>ward</span>
        </span>
      </button>

      <button type="button" className="site-header__history" onClick={onHistoryClick}>
        <History size={16} strokeWidth={2} />
        My bookings
        {historyCount > 0 && <span className="site-header__badge">{historyCount}</span>}
      </button>
    </header>
  );
}
