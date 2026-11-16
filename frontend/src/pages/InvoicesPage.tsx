import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { Invoice } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { useSettings } from '../hooks/useSettings';
import { formatDate, formatMoney } from '../utils/format';

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState('');
  const settings = useSettings();
  const currency = settings?.currency ?? 'AED';

  const load = () => {
    api
      .getInvoices()
      .then(setInvoices)
      .catch((e: Error) => setError(e.message));
  };

  useEffect(load, []);

  const onDelete = async (id: string) => {
    if (!confirm('Delete this invoice?')) return;
    await api.deleteInvoice(id);
    load();
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Invoices</h1>
          <p>Create, track, and print professional invoices</p>
        </div>
        <Link to="/invoices/new" className="btn btn-primary">
          New invoice
        </Link>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <section className="card table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Client</th>
              <th>Issue date</th>
              <th>Due date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.invoiceNumber}</td>
                <td>{inv.client.name}</td>
                <td>{formatDate(inv.issueDate)}</td>
                <td>{formatDate(inv.dueDate)}</td>
                <td>
                  <StatusBadge status={inv.status} />
                </td>
                <td>{formatMoney(inv.total, currency)}</td>
                <td>
                  <div className="table-actions">
                    <Link
                      className="btn btn-ghost btn-sm"
                      to={`/invoices/${inv.id}`}
                    >
                      View
                    </Link>
                    <Link
                      className="btn btn-ghost btn-sm"
                      to={`/invoices/${inv.id}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(inv.id)}
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
