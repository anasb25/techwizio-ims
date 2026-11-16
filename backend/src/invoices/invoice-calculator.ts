export type LineInput = {
  quantity: number;
  unitPrice: number;
  taxRate?: number;
};

export function calculateInvoiceTotals(
  items: LineInput[],
  discount = 0,
): { subtotal: number; taxTotal: number; total: number } {
  let subtotal = 0;
  let taxTotal = 0;

  for (const item of items) {
    const lineSubtotal = item.quantity * item.unitPrice;
    const taxRate = item.taxRate ?? 0;
    subtotal += lineSubtotal;
    taxTotal += lineSubtotal * (taxRate / 100);
  }

  const total = Math.max(0, subtotal + taxTotal - discount);
  return {
    subtotal: roundMoney(subtotal),
    taxTotal: roundMoney(taxTotal),
    total: roundMoney(total),
  };
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
