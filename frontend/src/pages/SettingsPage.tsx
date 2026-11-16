import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../api/client';
import { CURRENCY_OPTIONS } from '../constants/currencies';
import type { CompanySettings } from '../types';

export function SettingsPage() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getSettings().then(setSettings).catch((e: Error) => setError(e.message));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const updated = await api.updateSettings(settings);
    setSettings(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!settings) {
    return error ? <div className="error-banner">{error}</div> : <p>Loading…</p>;
  }

  const field = (
    key: keyof CompanySettings,
    label: string,
    multiline = false,
  ) => (
    <label key={key}>
      {label}
      {multiline ? (
        <textarea
          value={(settings[key] as string) ?? ''}
          onChange={(e) =>
            setSettings({ ...settings, [key]: e.target.value })
          }
        />
      ) : (
        <input
          value={(settings[key] as string) ?? ''}
          onChange={(e) =>
            setSettings({ ...settings, [key]: e.target.value })
          }
        />
      )}
    </label>
  );

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Company settings</h1>
          <p>Details shown on every Techwizio invoice</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}
      {saved && <div className="success-banner">Settings saved successfully.</div>}

      <form className="card form-grid" onSubmit={onSubmit}>
        {field('companyName', 'Company name')}
        {field('tagline', 'Tagline')}
        {field('email', 'Email')}
        {field('phone', 'Phone')}
        {field('website', 'Website')}
        {field('address', 'Address')}
        {field('city', 'City')}
        {field('country', 'Country')}
        {field('taxId', 'Tax ID')}
        {field('bankName', 'Bank name')}
        {field('bankAccount', 'Bank account / IBAN')}
        <label>
          Currency
          <select
            value={settings.currency}
            onChange={(e) =>
              setSettings({ ...settings, currency: e.target.value })
            }
          >
            {CURRENCY_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        {field('defaultTerms', 'Default terms', true)}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save settings
          </button>
        </div>
      </form>
    </>
  );
}
