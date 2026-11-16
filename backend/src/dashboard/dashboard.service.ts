import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceStatus } from '../common/enums/invoice-status.enum.js';
import { Client } from '../entities/client.entity.js';
import { Invoice } from '../entities/invoice.entity.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoicesRepo: Repository<Invoice>,
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
  ) {}

  async getSummary() {
    const [invoices, clientCount] = await Promise.all([
      this.invoicesRepo.find(),
      this.clientsRepo.count(),
    ]);

    const paid = invoices.filter((i) => i.status === InvoiceStatus.PAID);
    const outstanding = invoices.filter(
      (i) =>
        i.status === InvoiceStatus.SENT || i.status === InvoiceStatus.OVERDUE,
    );

    const totalRevenue = paid.reduce((sum, i) => sum + i.total, 0);
    const outstandingAmount = outstanding.reduce((sum, i) => sum + i.total, 0);

    return {
      invoiceCount: invoices.length,
      clientCount,
      totalRevenue,
      outstandingAmount,
      paidCount: paid.length,
      draftCount: invoices.filter((i) => i.status === InvoiceStatus.DRAFT)
        .length,
      recentInvoices: invoices
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    };
  }
}
