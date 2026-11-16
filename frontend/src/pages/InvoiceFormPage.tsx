import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Client, InvoiceItem, InvoiceStatus } from '../types';

const statuses: InvoiceStatus[] = [
  'draft',
  'sent',
  'paid',
  'overdue',
  'cancelled',
];

const emptyItem = (): InvoiceItem => ({
  description: '',
  quantity: 1,
  unitPrice: 0,
  taxRate: 0,
});

export function InvoiceFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState<InvoiceStatus>('draft');
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<InvoiceItem[]>([emptyItem()]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getClients().then(setClients);
    api.getSettings().then((s) => setTerms(s.defaultTerms ?? ''));
  }, []);

  useEffect(() => {
    if (!id) return;
    api
      .getInvoice(id)
      .then((inv) => {
        setClientId(inv.clientId);
        setStatus(inv.status);
        setIssueDate(inv.issueDate);
        setDueDate(inv.dueDate);
        setNotes(inv.notes ?? '');
        setTerms(inv.terms ?? '');
        setDiscount(inv.discount);
        setItems(inv.items);
      })
      .catch((e: Error) => setError(e.message));
  }, [id]);

  const updateItem = (index: number, patch: Partial<InvoiceItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError('Please select a client.');
      return;
    }
    const payload = {
      clientId,
      status,
      issueDate,
      dueDate,
      notes,
      terms,
      discount,
      items: items
        .filter((i) => i.description.trim())
        .map(({ description, quantity, unitPrice, taxRate }) => ({
          description,
          quantity,
          unitPrice,
          taxRate,
        })),
    };
    try {
      if (isEdit && id) {
        await api.updateInvoice(id, payload);
        navigate(`/invoices/${id}`);
      } else {
        const created = await api.createInvoice(payload);
        navigate(`/invoices/${created.id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1>{isEdit ? 'Edit invoice' : 'New invoice'}</h1>
          <p>Line items and totals are calculated automatically</p>
        </div>
        <Link to="/invoices" className="btn btn-secondary">
          Back
        </Link>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <form className="card form-grid" onSubmit={onSubmit}>
        <label>
          Client *
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            <option value="">Select client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Issue date
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />
        </label>
        <label>
          Due date
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </label>
        <label>
          Discount
          <input
            type="number"
            min={0}
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </label>

        <div>
          <h3 className="form-section-title">Line items</h3>
          {items.map((item, index) => (
            <div key={index} className="form-grid line-item-block">
              <label>
                Description
                <input
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, { description: e.target.value })
                  }
                />
              </label>
              <label>
                Qty
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, { quantity: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Unit price
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateItem(index, { unitPrice: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Tax %
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={item.taxRate}
                  onChange={(e) =>
                    updateItem(index, { taxRate: Number(e.target.value) })
                  }
                />
              </label>
              {items.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    setItems((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Remove line
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setItems((prev) => [...prev, emptyItem()])}
          >
            Add line item
          </button>
        </div>

        <label>
          Notes
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <label>
          Terms
          <textarea value={terms} onChange={(e) => setTerms(e.target.value)} />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update invoice' : 'Create invoice'}
          </button>
        </div>
      </form>
    </>
  );
}
