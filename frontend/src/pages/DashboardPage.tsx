import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { DashboardSummary } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { useSettings } from '../hooks/useSettings';
import { formatMoney } from '../utils/format';

export function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState('');
  const settings = useSettings();
  const currency = settings?.currency ?? 'AED';

  useEffect(() => {
    api
      .getDashboard()
      .then(setData)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of Techwizio billing and collections</p>
        </div>
        <Link to="/invoices/new" className="btn btn-primary">
          New invoice
        </Link>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {data && (
        <>
          <div className="card-grid">
            <div className="card stat-card">
              <h3>Total revenue (paid)</h3>
              <p>{formatMoney(data.totalRevenue, currency)}</p>
            </div>
            <div className="card stat-card">
              <h3>Outstanding</h3>
              <p>{formatMoney(data.outstandingAmount, currency)}</p>
            </div>
            <div className="card stat-card">
              <h3>Invoices</h3>
              <p>{data.invoiceCount}</p>
            </div>
            <div className="card stat-card">
              <h3>Clients</h3>
              <p>{data.clientCount}</p>
            </div>
          </div>

          <section className="card">
            <h2>Recent invoices</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data.recentInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td>{inv.invoiceNumber}</td>
                      <td>{inv.client?.name}</td>
                      <td>
                        <StatusBadge status={inv.status} />
                      </td>
                      <td>{formatMoney(inv.total, currency)}</td>
                      <td>
                        <Link
                          className="btn btn-ghost btn-sm"
                          to={`/invoices/${inv.id}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}
