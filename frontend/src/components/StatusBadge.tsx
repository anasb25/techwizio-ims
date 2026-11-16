import type { InvoiceStatus } from '../types';

export function StatusBadge({ status }: { status: InvoiceStatus | string }) {
  return <span className={`badge badge--${status}`}>{status}</span>;
}
