import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceStatus } from '../common/enums/invoice-status.enum.js';
import { Client } from '../entities/client.entity.js';
import { InvoiceItem } from '../entities/invoice-item.entity.js';
import { Invoice } from '../entities/invoice.entity.js';
import { SettingsService } from '../settings/settings.service.js';
import { calculateInvoiceTotals } from '../invoices/invoice-calculator.js';

const ADAA_CLIENT = {
  name: 'Adaa Employment LLC',
  email: 'billing@adaaemployment.com',
  phone: '+971 4 000 0000',
  address: 'Business Bay',
  city: 'Dubai',
  country: 'United Arab Emirates',
};

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepo: Repository<Client>,
    @InjectRepository(Invoice)
    private readonly invoicesRepo: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private readonly itemsRepo: Repository<InvoiceItem>,
    private readonly settingsService: SettingsService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.settingsService.ensureDefaults();
    await this.ensureAdaaClient();

    const invoiceCount = await this.invoicesRepo.count();
    if (invoiceCount > 0) {
      return;
    }

    const client = await this.ensureAdaaClient();

    const items = [
      {
        description: 'Software Development — Monthly Retainer',
        quantity: 1,
        unitPrice: 2500,
        taxRate: 0,
      },
      {
        description: 'Cloud Infrastructure & DevOps Support',
        quantity: 1,
        unitPrice: 850,
        taxRate: 0,
      },
    ];

    const totals = calculateInvoiceTotals(items, 0);

    await this.invoicesRepo.save(
      this.invoicesRepo.create({
        invoiceNumber: `TW-${new Date().getFullYear()}-0001`,
        status: InvoiceStatus.SENT,
        issueDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        clientId: client.id,
        terms: 'Net 14. Thank you for your business.',
        ...totals,
        items: items.map((item) => this.itemsRepo.create(item)),
      }),
    );
  }

  private async ensureAdaaClient(): Promise<Client> {
    const existing = await this.clientsRepo.findOne({
      where: { name: ADAA_CLIENT.name },
    });
    if (existing) {
      return existing;
    }
    return this.clientsRepo.save(this.clientsRepo.create(ADAA_CLIENT));
  }
}
