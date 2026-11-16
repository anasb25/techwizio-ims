const CURRENCY_LOCALE: Record<string, string> = {
  USD: 'en-US',
  AED: 'en-AE',
  PKR: 'en-PK',
};

export function formatMoney(amount: number, currency = 'AED'): string {
  const code = currency in CURRENCY_LOCALE ? currency : 'AED';
  const locale = CURRENCY_LOCALE[code] ?? 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function lineTotal(item: {
  quantity: number;
  unitPrice: number;
  taxRate: number;
}): number {
  const sub = item.quantity * item.unitPrice;
  return sub + sub * (item.taxRate / 100);
}
