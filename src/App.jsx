import { useState, useMemo } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import FiltersPanel, { SortBar } from './components/FiltersPanel';
import FlightCard from './components/FlightCard';
import FareComparison, { buildFares } from './components/FareComparison';
import SeatMap from './components/SeatMap';
import PassengerForm from './components/PassengerForm';
import BookingSummary from './components/BookingSummary';
import Confirmation from './components/Confirmation';
import BookingHistory from './components/BookingHistory';
import StepBar from './components/StepBar';
import InfoTooltip from './components/InfoTooltip';
import { generateFlights } from './data/generateFlights';
import { useBookingHistory } from './hooks/useBookingHistory';
import { ArrowLeft, SlidersHorizontal, PlaneTakeoff, Frown } from 'lucide-react';
import './App.css';

const EMPTY_FILTERS = { airlines: [], stops: [], maxPrice: Infinity, refundableOnly: false };

function generatePNR() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function makeTravellers(passengers) {
  const list = [];
  for (let i = 0; i < passengers.adults; i++) list.push({ type: 'Adult', firstName: '', lastName: '', gender: '', dob: '' });
  for (let i = 0; i < passengers.children; i++) list.push({ type: 'Child', firstName: '', lastName: '', gender: '', dob: '' });
  for (let i = 0; i < passengers.infants; i++) list.push({ type: 'Infant', firstName: '', lastName: '', gender: '', dob: '' });
  return list;
}

export default function App() {
  const [view, setView] = useState('home'); // home | results | fare | seats | passengers | review | confirmation | history
  const [searchParams, setSearchParams] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedLegIndex, setSelectedLegIndex] = useState(0); // for multi-city
  const [multiCitySelections, setMultiCitySelections] = useState([]);
  const [selectedFare, setSelectedFare] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatFees, setSeatFees] = useState([]);
  const [travellers, setTravellers] = useState([]);
  const [contact, setContact] = useState({ email: '', phone: '' });
  const [formErrors, setFormErrors] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState('price');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);

  const { history, addBooking, clearHistory } = useBookingHistory();

  const isMultiCity = searchParams?.tripType === 'multicity';
  const legs = isMultiCity
    ? searchParams.legs
    : searchParams
    ? [{ origin: searchParams.origin, destination: searchParams.destination, date: searchParams.departDate }]
    : [];

  const currentLeg = legs[selectedLegIndex] || legs[0];

  const flights = useMemo(() => {
    if (!currentLeg) return [];
    return generateFlights({
      origin: currentLeg.origin,
      destination: currentLeg.destination,
      date: currentLeg.date,
      passengers: (searchParams?.passengers?.adults || 1) + (searchParams?.passengers?.children || 0),
    });
  }, [currentLeg, searchParams]);

  const priceBounds = useMemo(() => {
    if (flights.length === 0) return { min: 0, max: 10000 };
    const prices = flights.map((f) => f.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [flights]);

  const effectiveFilters = filters.maxPrice === Infinity ? { ...filters, maxPrice: priceBounds.max } : filters;

  const filteredFlights = useMemo(() => {
    let list = flights.filter((f) => {
      if (effectiveFilters.airlines.length > 0 && !effectiveFilters.airlines.includes(f.airline.code)) return false;
      if (effectiveFilters.stops.length > 0) {
        const bucket = f.stops >= 2 ? 2 : f.stops;
        if (!effectiveFilters.stops.includes(bucket)) return false;
      }
      if (f.price > effectiveFilters.maxPrice) return false;
      if (effectiveFilters.refundableOnly && !f.refundable) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'duration':
          return a.duration - b.duration;
        case 'departure':
          return a.departTime.localeCompare(b.departTime);
        case 'rating':
          return b.rating - a.rating;
        case 'price':
        default:
          return a.price - b.price;
      }
    });

    return list;
  }, [flights, effectiveFilters, sort]);

  const passengerCount = searchParams
    ? searchParams.passengers.adults + searchParams.passengers.children
    : 1;

  function handleSearch(params) {
    setSearchParams(params);
    setSelectedLegIndex(0);
    setMultiCitySelections([]);
    setFilters(EMPTY_FILTERS);
    setSort('price');
    setView('results');
  }

  function handleSelectFlight(flight) {
    if (isMultiCity) {
      const next = [...multiCitySelections];
      next[selectedLegIndex] = flight;
      setMultiCitySelections(next);
      if (selectedLegIndex < legs.length - 1) {
        setSelectedLegIndex(selectedLegIndex + 1);
        setFilters(EMPTY_FILTERS);
        return;
      }
      setSelectedFlight(flight);
    } else {
      setSelectedFlight(flight);
    }
    setSelectedFare(null);
    setSelectedSeats([]);
    setSeatFees([]);
    setView('fare');
  }

  function handleFareSelect(fare) {
    setSelectedFare(fare);
  }

  function goToSeats() {
    if (!selectedFare) {
      const fares = buildFares(selectedFlight.price);
      setSelectedFare(fares[1]);
    }
    setView('seats');
  }

  function handleToggleSeat(seatId, price) {
    setSelectedSeats((prev) => {
      const idx = prev.indexOf(seatId);
      if (idx >= 0) {
        setSeatFees((fees) => fees.filter((_, i) => i !== idx));
        return prev.filter((s) => s !== seatId);
      }
      if (prev.length >= passengerCount) return prev;
      setSeatFees((fees) => [...fees, price]);
      return [...prev, seatId];
    });
  }

  function goToPassengers() {
    setTravellers(makeTravellers(searchParams.passengers));
    setFormErrors(null);
    setView('passengers');
  }

  function validatePassengers() {
    const errors = travellers.map((t) => {
      const e = {};
      if (!t.firstName.trim()) e.firstName = 'Required';
      if (!t.lastName.trim()) e.lastName = 'Required';
      if (!t.dob) e.dob = 'Required';
      return e;
    });
    const contactErrors = {};
    if (!contact.email.trim() || !/^\S+@\S+\.\S+$/.test(contact.email)) contactErrors.email = 'Enter a valid email';
    if (!contact.phone.trim() || contact.phone.replace(/\D/g, '').length < 10) contactErrors.phone = 'Enter a valid phone number';

    const hasErrors = errors.some((e) => Object.keys(e).length > 0) || Object.keys(contactErrors).length > 0;
    if (hasErrors) {
      setFormErrors({ ...errors, contact: contactErrors });
      return false;
    }
    setFormErrors(null);
    return true;
  }

  function goToReview() {
    if (!validatePassengers()) return;
    setView('review');
  }

  const total = useMemo(() => {
    if (!selectedFlight) return 0;
    const fareTotal = selectedFare ? selectedFare.price : selectedFlight.price;
    const taxes = Math.round(fareTotal * 0.12);
    const seatTotal = seatFees.reduce((s, f) => s + f, 0);
    return fareTotal + taxes + seatTotal;
  }, [selectedFlight, selectedFare, seatFees]);

  function confirmBooking() {
    const booking = {
      pnr: generatePNR(),
      flight: selectedFlight,
      fare: selectedFare,
      seats: selectedSeats,
      travellers,
      contact,
      total,
      bookedAt: new Date().toISOString(),
      tripType: searchParams.tripType,
    };
    setLastBooking(booking);
    addBooking(booking);
    setView('confirmation');
  }

  function resetToHome() {
    setView('home');
    setSearchParams(null);
    setSelectedFlight(null);
    setSelectedFare(null);
    setSelectedSeats([]);
    setSeatFees([]);
    setTravellers([]);
    setContact({ email: '', phone: '' });
    setFormErrors(null);
    setMultiCitySelections([]);
    setSelectedLegIndex(0);
  }

  const stepBarView = ['results', 'fare', 'seats', 'passengers', 'review'].includes(view) ? view : null;

  return (
    <div className="app">
      <Header
        onLogoClick={resetToHome}
        onHistoryClick={() => setView('history')}
        historyCount={history.length}
      />

      {view === 'home' && <HomeHero onSearch={handleSearch} />}

      {view === 'history' && (
        <BookingHistory history={history} onClear={clearHistory} onBack={() => setView(searchParams ? 'results' : 'home')} />
      )}

      {view === 'confirmation' && lastBooking && (
        <Confirmation booking={lastBooking} onNewSearch={resetToHome} onViewHistory={() => setView('history')} />
      )}

      {stepBarView && (
        <main className="app__main">
          <div className="app__container">
            <StepBar current={stepBarView} />

            {isMultiCity && view === 'results' && (
              <div className="multicity-progress">
                {legs.map((leg, i) => (
                  <span
                    key={i}
                    className={`multicity-progress__pill ${i === selectedLegIndex ? 'is-active' : multiCitySelections[i] ? 'is-done' : ''}`}
                  >
                    Leg {i + 1}: {leg.origin} → {leg.destination}
                  </span>
                ))}
              </div>
            )}

            {view === 'results' && (
              <>
                <div className="app__search-recap">
                  <SearchForm onSearch={handleSearch} initial={searchParams} />
                </div>

                <div className="results-layout">
                  <button
                    type="button"
                    className="results-layout__mobile-filter-toggle"
                    onClick={() => setShowFiltersMobile((s) => !s)}
                  >
                    <SlidersHorizontal size={15} strokeWidth={2} /> Filters &amp; sort
                  </button>

                  <div className={`results-layout__filters ${showFiltersMobile ? 'is-open' : ''}`}>
                    <FiltersPanel
                      filters={effectiveFilters}
                      onChange={setFilters}
                      priceBounds={priceBounds}
                      resultsCount={filteredFlights.length}
                    />
                  </div>

                  <div className="results-layout__list">
                    <SortBar sort={sort} onSortChange={setSort} />
                    {filteredFlights.length === 0 ? (
                      <EmptyResults onReset={() => setFilters(EMPTY_FILTERS)} />
                    ) : (
                      filteredFlights.map((f) => (
                        <FlightCard key={f.id} flight={f} onSelect={handleSelectFlight} />
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {view === 'fare' && selectedFlight && (
              <TwoColumn
                left={
                  <>
                    <BackLink onClick={() => setView('results')} label="Back to results" />
                    <FareComparison
                      basePrice={selectedFlight.price}
                      selectedFareId={selectedFare?.id}
                      onSelect={handleFareSelect}
                    />
                    <StepFooter onNext={goToSeats} nextLabel="Continue to seat selection" />
                  </>
                }
                right={
                  <BookingSummary
                    flight={selectedFlight}
                    fare={selectedFare}
                    seats={selectedSeats}
                    seatFees={seatFees}
                    passengerCount={passengerCount}
                    step="Pick a fare that matches how flexible your plans are."
                  />
                }
              />
            )}

            {view === 'seats' && selectedFlight && (
              <TwoColumn
                left={
                  <>
                    <BackLink onClick={() => setView('fare')} label="Back to fare selection" />
                    <SeatMap
                      flightId={selectedFlight.id}
                      basePrice={selectedFlight.price}
                      passengerCount={passengerCount}
                      selectedSeats={selectedSeats}
                      onToggleSeat={handleToggleSeat}
                    />
                    <StepFooter
                      onNext={goToPassengers}
                      nextLabel="Continue to traveller details"
                      onSkip={goToPassengers}
                      skipLabel="Skip seat selection"
                    />
                  </>
                }
                right={
                  <BookingSummary
                    flight={selectedFlight}
                    fare={selectedFare}
                    seats={selectedSeats}
                    seatFees={seatFees}
                    passengerCount={passengerCount}
                    step="Window, aisle, or extra legroom — your call."
                  />
                }
              />
            )}

            {view === 'passengers' && selectedFlight && (
              <TwoColumn
                left={
                  <>
                    <BackLink onClick={() => setView('seats')} label="Back to seat selection" />
                    <PassengerForm
                      travellers={travellers}
                      onChange={setTravellers}
                      contact={contact}
                      onContactChange={setContact}
                      errors={formErrors}
                    />
                    <StepFooter onNext={goToReview} nextLabel="Review booking" />
                  </>
                }
                right={
                  <BookingSummary
                    flight={selectedFlight}
                    fare={selectedFare}
                    seats={selectedSeats}
                    seatFees={seatFees}
                    passengerCount={passengerCount}
                    step="Enter names exactly as they appear on your ID."
                  />
                }
              />
            )}

            {view === 'review' && selectedFlight && (
              <TwoColumn
                left={
                  <>
                    <BackLink onClick={() => setView('passengers')} label="Back to traveller details" />
                    <ReviewPanel
                      flight={selectedFlight}
                      fare={selectedFare}
                      travellers={travellers}
                      contact={contact}
                      seats={selectedSeats}
                    />
                    <StepFooter onNext={confirmBooking} nextLabel="Confirm and book" primary />
                  </>
                }
                right={
                  <BookingSummary
                    flight={selectedFlight}
                    fare={selectedFare}
                    seats={selectedSeats}
                    seatFees={seatFees}
                    passengerCount={passengerCount}
                    step="Double-check details — this locks in your fare."
                  />
                }
              />
            )}
          </div>
        </main>
      )}
    </div>
  );
}

function HomeHero({ onSearch }) {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="hero__flightpath">
          <path d="M0,220 C200,180 300,260 480,200 C650,145 720,90 900,110 C1020,124 1100,60 1200,40" />
        </svg>
      </div>
      <div className="hero__card">
        <span className="hero__eyebrow">Real-time-style fares · Seat maps · Instant PNR</span>
        <h1 className="hero__title">
          Find your next flight,<br /><span>without the runaround.</span>
          <InfoTooltip text="Search flights across all major routes" />
        </h1>
        <p className="hero__subtitle">
          Search, compare, and lock in seats across every major route in India — one clean board, no clutter.
        </p>
      </div>
      <div className="hero__search">
        <SearchForm onSearch={onSearch} />
      </div>
    </section>
  );
}

function TwoColumn({ left, right }) {
  return (
    <div className="two-column">
      <div className="two-column__left">{left}</div>
      <div className="two-column__right">{right}</div>
    </div>
  );
}

function BackLink({ onClick, label }) {
  return (
    <button type="button" className="back-link" onClick={onClick}>
      <ArrowLeft size={15} strokeWidth={2.2} /> {label}
    </button>
  );
}

function StepFooter({ onNext, nextLabel, onSkip, skipLabel, primary, disabled }) {
  return (
    <div className="step-footer">
      {onSkip && (
        <button type="button" className="step-footer__skip" onClick={onSkip}>
          {skipLabel}
        </button>
      )}
      <button type="button" className={`step-footer__next ${primary ? 'is-primary' : ''}`} onClick={onNext} disabled={disabled}>
        {nextLabel}
      </button>
    </div>
  );
}

function EmptyResults({ onReset }) {
  return (
    <div className="empty-results">
      <Frown size={30} strokeWidth={1.4} />
      <h3>No flights match your filters</h3>
      <p>Try widening your price range or clearing a filter.</p>
      <button type="button" onClick={onReset}>Clear filters</button>
    </div>
  );
}

function ReviewPanel({ flight, fare, travellers, contact, seats }) {
  return (
    <div className="review-panel">
      <h3 className="review-panel__title">
        <PlaneTakeoff size={16} strokeWidth={2.2} /> Review your booking
        <InfoTooltip text="Double check your details before confirming" />
      </h3>

      <div className="review-panel__card">
        <h4>Flight</h4>
        <p>{flight.airline.name} {flight.flightNumber} · {flight.origin} → {flight.destination}</p>
        <p className="review-panel__muted">{flight.date} · {flight.departTime}–{flight.arriveTime} · {flight.durationLabel}</p>
      </div>

      <div className="review-panel__card">
        <h4>
          Fare &amp; seats
          <InfoTooltip text="Your selected fare class and seat assignments" />
        </h4>
        <p>{fare?.name || 'Standard'} fare{seats.length > 0 ? ` · Seats ${seats.join(', ')}` : ' · No seats selected'}</p>
      </div>

      <div className="review-panel__card">
        <h4>Travellers</h4>
        {travellers.map((t, i) => (
          <p key={i}>{t.firstName} {t.lastName} <span className="review-panel__muted">({t.type})</span></p>
        ))}
      </div>

      <div className="review-panel__card">
        <h4>Contact</h4>
        <p>{contact.email}</p>
        <p className="review-panel__muted">{contact.phone}</p>
      </div>
    </div>
  );
}
