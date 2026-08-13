import { useEffect, useRef, useState } from 'react';
import './SplitFlap.css';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export default function SplitFlap({ text, delay = 0, duration = 700 }) {
  const target = text.toUpperCase().padEnd(text.length, ' ');
  const [display, setDisplay] = useState(target.split('').map(() => ' '));
  const settledRef = useRef(target.split('').map(() => false));

  useEffect(() => {
    let cancelled = false;
    const timeouts = [];
    settledRef.current = target.split('').map(() => false);

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (cancelled) return;
        setDisplay((prev) => prev.map((ch, i) => (settledRef.current[i] ? target[i] : randomChar())));
      }, 45);

      target.split('').forEach((char, i) => {
        const t = setTimeout(() => {
          if (cancelled) return;
          settledRef.current[i] = true;
          setDisplay((prev) => {
            const next = [...prev];
            next[i] = char;
            return next;
          });
        }, (duration / target.length) * i + duration * 0.3);
        timeouts.push(t);
      });

      const stopTimeout = setTimeout(() => {
        clearInterval(interval);
      }, duration + 200);
      timeouts.push(stopTimeout);
    }, delay);

    timeouts.push(startTimeout);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span className="split-flap">
      {display.map((ch, i) => (
        <span className="split-flap__char" key={i}>{ch === ' ' ? '\u00A0' : ch}</span>
      ))}
    </span>
  );
}
