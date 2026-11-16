export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
}

export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  notes?: string;
  terms?: string;
  discount: number;
  subtotal: number;
  taxTotal: number;
  total: number;
  clientId: string;
  client: Client;
  items: InvoiceItem[];
  createdAt?: string;
}

export interface CompanySettings {
  id: string;
  companyName: string;
  tagline?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  bankName?: string;
  bankAccount?: string;
  defaultTerms?: string;
  currency: string;
}

export interface DashboardSummary {
  invoiceCount: number;
  clientCount: number;
  totalRevenue: number;
  outstandingAmount: number;
  paidCount: number;
  draftCount: number;
  recentInvoices: Invoice[];
}
