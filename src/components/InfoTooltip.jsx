import { useState } from 'react';
import { Info } from 'lucide-react';

export default function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="info-tooltip"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: '6px' }}
    >
      <Info size={14} color="var(--slate-500)" style={{ cursor: 'help' }} />
      {show && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
          background: 'var(--navy-900)',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '12px',
          fontWeight: 400,
          whiteSpace: 'nowrap',
          zIndex: 100,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          pointerEvents: 'none'
        }}>
          {text}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid var(--navy-900)'
          }} />
        </div>
      )}
    </div>
  );
}
