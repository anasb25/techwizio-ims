const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    let message = text || res.statusText;
    try {
      const body = JSON.parse(text) as { message?: string | string[] };
      if (Array.isArray(body.message)) {
        message = body.message.join(', ');
      } else if (typeof body.message === 'string') {
        message = body.message;
      }
    } catch {
      /* use raw text */
    }
    throw new Error(message);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export const api = {
  getDashboard: () => request<import('../types').DashboardSummary>('/dashboard/summary'),
  getClients: () => request<import('../types').Client[]>('/clients'),
  createClient: (body: Partial<import('../types').Client>) =>
    request<import('../types').Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateClient: (id: string, body: Partial<import('../types').Client>) =>
    request<import('../types').Client>(`/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  deleteClient: (id: string) =>
    request<void>(`/clients/${id}`, { method: 'DELETE' }),

  getInvoices: () => request<import('../types').Invoice[]>('/invoices'),
  getInvoice: (id: string) =>
    request<import('../types').Invoice>(`/invoices/${id}`),
  createInvoice: (body: Record<string, unknown>) =>
    request<import('../types').Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateInvoice: (id: string, body: Record<string, unknown>) =>
    request<import('../types').Invoice>(`/invoices/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  deleteInvoice: (id: string) =>
    request<void>(`/invoices/${id}`, { method: 'DELETE' }),

  getSettings: () =>
    request<import('../types').CompanySettings>('/settings'),
  updateSettings: (body: Partial<import('../types').CompanySettings>) =>
    request<import('../types').CompanySettings>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
};
