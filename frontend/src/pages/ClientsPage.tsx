import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../api/client';
import type { Client } from '../types';

const empty: Partial<Client> = { name: '', email: '', phone: '', address: '' };

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<Partial<Client>>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = () => {
    api.getClients().then(setClients).catch((e: Error) => setError(e.message));
  };

  useEffect(load, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) return;
    if (editingId) {
      await api.updateClient(editingId, form);
    } else {
      await api.createClient(form);
    }
    setForm(empty);
    setEditingId(null);
    load();
  };

  const startEdit = (client: Client) => {
    setEditingId(client.id);
    setForm(client);
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this client?')) return;
    await api.deleteClient(id);
    load();
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Clients</h1>
          <p>Manage billing contacts for your invoices</p>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2>{editingId ? 'Edit client' : 'Add client'}</h2>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Name *
            <input
              value={form.name ?? ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email ?? ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Phone
            <input
              value={form.phone ?? ''}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label>
            Address
            <input
              value={form.address ?? ''}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>
          <label>
            City
            <input
              value={form.city ?? ''}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </label>
          <label>
            Country
            <input
              value={form.country ?? ''}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Save changes' : 'Add client'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(empty);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>
                  {[c.city, c.country].filter(Boolean).join(', ') || '—'}
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => startEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
