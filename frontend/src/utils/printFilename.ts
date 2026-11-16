/** Default PDF name when saving from the browser print dialog (uses document.title). */
export function invoicePrintFilename(
  clientName: string,
  issueDate: string,
): string {
  const safeName = clientName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const safeDate = issueDate.trim().replace(/[^0-9-]/g, '');

  return `${safeName || 'Client'}-${safeDate || 'invoice'}`;
}
