export const CURRENCY_OPTIONS = [
  { code: 'AED', label: 'UAE Dirham (AED)' },
  { code: 'USD', label: 'US Dollars (USD)' },
  { code: 'PKR', label: 'Pakistani Rupee (PKR)' },
] as const;

export const DEFAULT_CURRENCY = 'AED' as const;

export type SupportedCurrency = (typeof CURRENCY_OPTIONS)[number]['code'];
