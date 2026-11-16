import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { InvoiceTemplate } from '../components/InvoiceTemplate';
import type { CompanySettings, Invoice } from '../types';
import { printInvoiceElement } from '../utils/printInvoice';
import { invoicePrintFilename } from '../utils/printFilename';

export function InvoiceViewPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([api.getInvoice(id), api.getSettings()])
      .then(([inv, set]) => {
        setInvoice(inv);
        setSettings(set);
      })
      .catch((e: Error) => setError(e.message));
  }, [id]);

  const onPrint = () => {
    if (!invoice) return;
    const filename = invoicePrintFilename(
      invoice.client.name,
      invoice.issueDate,
    );
    printInvoiceElement('invoice-print-root', filename);
  };

  if (error) return <div className="error-banner">{error}</div>;
  if (!invoice || !settings) return <p>Loading invoice…</p>;

  return (
    <>
      <header className="page-header no-print">
        <div>
          <h1>{invoice.invoiceNumber}</h1>
          <p>Preview and print your Techwizio invoice</p>
        </div>
        <div className="form-actions" style={{ marginTop: 0, paddingTop: 0, border: 'none' }}>
          <Link to="/invoices" className="btn btn-secondary">
            All invoices
          </Link>
          <Link to={`/invoices/${invoice.id}/edit`} className="btn btn-secondary">
            Edit
          </Link>
          <button type="button" className="btn btn-primary" onClick={onPrint}>
            Print / PDF
          </button>
        </div>
      </header>

      <div className="invoice-print-area">
        <InvoiceTemplate invoice={invoice} settings={settings} printMode />
      </div>
    </>
  );
}
