import { User, Mail, Phone } from 'lucide-react';
import './PassengerForm.css';

export default function PassengerForm({ travellers, onChange, contact, onContactChange, errors }) {
  function updateTraveller(index, field, value) {
    onChange((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  }

  return (
    <div className="passenger-form">
      <h3 className="passenger-form__title">Traveller details</h3>

      {travellers.map((t, i) => (
        <div className="passenger-form__card" key={i}>
          <div className="passenger-form__card-header">
            <User size={15} strokeWidth={2} />
            <span>Traveller {i + 1}{t.type ? ` · ${t.type}` : ''}</span>
          </div>
          <div className="passenger-form__grid">
            <Field
              label="First name"
              value={t.firstName}
              onChange={(v) => updateTraveller(i, 'firstName', v)}
              error={errors?.[i]?.firstName}
            />
            <Field
              label="Last name"
              value={t.lastName}
              onChange={(v) => updateTraveller(i, 'lastName', v)}
              error={errors?.[i]?.lastName}
            />
            <div className="passenger-form__field">
              <label>Gender</label>
              <select value={t.gender} onChange={(e) => updateTraveller(i, 'gender', e.target.value)}>
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Field
              label="Date of birth"
              type="date"
              value={t.dob}
              onChange={(v) => updateTraveller(i, 'dob', v)}
              error={errors?.[i]?.dob}
            />
          </div>
        </div>
      ))}

      <div className="passenger-form__card">
        <div className="passenger-form__card-header">
          <Mail size={15} strokeWidth={2} />
          <span>Contact details</span>
        </div>
        <div className="passenger-form__grid">
          <div className="passenger-form__field">
            <label>Email address</label>
            <div className="passenger-form__input-icon">
              <Mail size={14} strokeWidth={2} />
              <input
                type="email"
                value={contact.email}
                onChange={(e) => onContactChange((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </div>
            {errors?.contact?.email && <span className="passenger-form__error">{errors.contact.email}</span>}
          </div>
          <div className="passenger-form__field">
            <label>Mobile number</label>
            <div className="passenger-form__input-icon">
              <Phone size={14} strokeWidth={2} />
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => onContactChange((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="98765 43210"
              />
            </div>
            {errors?.contact?.phone && <span className="passenger-form__error">{errors.contact.phone}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', error }) {
  return (
    <div className="passenger-form__field">
      <label>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {error && <span className="passenger-form__error">{error}</span>}
    </div>
  );
}
