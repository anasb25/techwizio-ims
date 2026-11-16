import type { CompanySettings, Invoice } from '../types';
import { formatDate, formatMoney, lineTotal } from '../utils/format';
import './InvoiceTemplate.css';

type Props = {
  invoice: Invoice;
  settings: CompanySettings;
  printMode?: boolean;
};

export function InvoiceTemplate({ invoice, settings, printMode }: Props) {
  const currency = settings.currency || 'AED';
  const compactPrint = invoice.items.length <= 12;

  return (
    <article
      className={[
        'invoice-doc',
        printMode ? 'invoice-doc--print' : '',
        compactPrint ? 'invoice-doc--one-page' : 'invoice-doc--multipage',
      ]
        .filter(Boolean)
        .join(' ')}
      id="invoice-print-root"
    >
      <header className="invoice-doc__header">
        <div className="invoice-doc__brand">
          <img
            src="/techwizio-logo.png"
            alt={settings.companyName}
            className="invoice-doc__logo"
          />
        </div>
        <div className="invoice-doc__title-block">
          <p className="invoice-doc__label">Invoice</p>
          <p className="invoice-doc__number">{invoice.invoiceNumber}</p>
          <span
            className={`status-pill status-pill--${invoice.status} invoice-doc__status`}
          >
            {invoice.status}
          </span>
        </div>
      </header>

      <section className="invoice-doc__meta">
        <div>
          <h3>From</h3>
          <p className="invoice-doc__strong">{settings.companyName}</p>
          {settings.website &&
            !/localhost|127\.0\.0\.1/i.test(settings.website) && (
              <p>{settings.website}</p>
            )}
          {settings.taxId && <p>Tax ID: {settings.taxId}</p>}
        </div>
        <div>
          <h3>Bill To</h3>
          <p className="invoice-doc__strong">{invoice.client.name}</p>
          {invoice.client.taxId && <p>Tax ID: {invoice.client.taxId}</p>}
        </div>
        <div>
          <h3>Details</h3>
          <dl className="invoice-doc__dl">
            <div>
              <dt>Issue date</dt>
              <dd>{formatDate(invoice.issueDate)}</dd>
            </div>
            <div>
              <dt>Due date</dt>
              <dd>{formatDate(invoice.dueDate)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <table className="invoice-doc__table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit price</th>
            <th>Tax %</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={item.id ?? index}>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{formatMoney(item.unitPrice, currency)}</td>
              <td>{item.taxRate}%</td>
              <td>{formatMoney(lineTotal(item), currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-doc__closing">
        <section className="invoice-doc__totals">
          <dl>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatMoney(invoice.subtotal, currency)}</dd>
            </div>
            <div>
              <dt>Tax</dt>
              <dd>{formatMoney(invoice.taxTotal, currency)}</dd>
            </div>
            {invoice.discount > 0 && (
              <div>
                <dt>Discount</dt>
                <dd>-{formatMoney(invoice.discount, currency)}</dd>
              </div>
            )}
            <div className="invoice-doc__grand">
              <dt>Total due</dt>
              <dd>{formatMoney(invoice.total, currency)}</dd>
            </div>
          </dl>
        </section>

        {(invoice.notes ||
          invoice.terms ||
          settings.defaultTerms ||
          settings.bankName ||
          settings.bankAccount) && (
          <footer className="invoice-doc__footer">
            {invoice.notes && (
              <div>
                <h4>Notes</h4>
                <p>{invoice.notes}</p>
              </div>
            )}
            {(invoice.terms || settings.defaultTerms) && (
              <div className="invoice-doc__terms">
                <h4>Terms & conditions</h4>
                <p>{invoice.terms || settings.defaultTerms}</p>
              </div>
            )}
            {(settings.bankName || settings.bankAccount) && (
              <div>
                <h4>Payment details</h4>
                {settings.bankName && <p>Bank: {settings.bankName}</p>}
                {settings.bankAccount && (
                  <p>Account: {settings.bankAccount}</p>
                )}
              </div>
            )}
          </footer>
        )}
      </div>

      <p className="invoice-doc__thanks">Thank you for your business.</p>
    </article>
  );
}
