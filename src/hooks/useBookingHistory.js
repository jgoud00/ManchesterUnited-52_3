import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'skyward.bookingHistory';

function readHistory() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useBookingHistory() {
  const [history, setHistory] = useState(() => readHistory());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // storage unavailable (private mode, quota) - fail silently, in-memory state still works
    }
  }, [history]);

  const addBooking = useCallback((booking) => {
    setHistory((prev) => [booking, ...prev].slice(0, 25));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addBooking, clearHistory };
}
