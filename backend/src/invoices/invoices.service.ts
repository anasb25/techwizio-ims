import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceStatus } from '../common/enums/invoice-status.enum.js';
import { ClientsService } from '../clients/clients.service.js';
import { InvoiceItem } from '../entities/invoice-item.entity.js';
import { Invoice } from '../entities/invoice.entity.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { UpdateInvoiceDto } from './dto/update-invoice.dto.js';
import { calculateInvoiceTotals } from './invoice-calculator.js';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoicesRepo: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private readonly itemsRepo: Repository<InvoiceItem>,
    private readonly clientsService: ClientsService,
  ) {}

  findAll(): Promise<Invoice[]> {
    return this.invoicesRepo.find({
      order: { createdAt: 'DESC' },
      relations: { client: true, items: true },
    });
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoicesRepo.findOne({
      where: { id },
      relations: { client: true, items: true },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice ${id} not found`);
    }
    return invoice;
  }

  async create(dto: CreateInvoiceDto): Promise<Invoice> {
    await this.clientsService.findOne(dto.clientId);

    const totals = calculateInvoiceTotals(dto.items, dto.discount ?? 0);
    const invoiceNumber = await this.generateInvoiceNumber();

    const invoice = this.invoicesRepo.create({
      clientId: dto.clientId,
      invoiceNumber,
      status: dto.status ?? InvoiceStatus.DRAFT,
      issueDate: dto.issueDate,
      dueDate: dto.dueDate,
      notes: dto.notes,
      terms: dto.terms,
      discount: dto.discount ?? 0,
      ...totals,
      items: dto.items.map((item) =>
        this.itemsRepo.create({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate ?? 0,
        }),
      ),
    });

    return this.invoicesRepo.save(invoice);
  }

  async update(id: string, dto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);

    if (dto.clientId) {
      await this.clientsService.findOne(dto.clientId);
      invoice.clientId = dto.clientId;
    }

    if (dto.issueDate) invoice.issueDate = dto.issueDate;
    if (dto.dueDate) invoice.dueDate = dto.dueDate;
    if (dto.notes !== undefined) invoice.notes = dto.notes;
    if (dto.terms !== undefined) invoice.terms = dto.terms;
    if (dto.status) invoice.status = dto.status;
    if (dto.discount !== undefined) invoice.discount = dto.discount;

    if (dto.items) {
      await this.itemsRepo.delete({ invoiceId: id });
      invoice.items = dto.items.map((item) =>
        this.itemsRepo.create({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate ?? 0,
          invoiceId: id,
        }),
      );
      const totals = calculateInvoiceTotals(dto.items, invoice.discount);
      invoice.subtotal = totals.subtotal;
      invoice.taxTotal = totals.taxTotal;
      invoice.total = totals.total;
    } else if (dto.discount !== undefined) {
      const totals = calculateInvoiceTotals(invoice.items, invoice.discount);
      invoice.subtotal = totals.subtotal;
      invoice.taxTotal = totals.taxTotal;
      invoice.total = totals.total;
    }

    return this.invoicesRepo.save(invoice);
  }

  async remove(id: string): Promise<void> {
    const invoice = await this.findOne(id);
    await this.invoicesRepo.remove(invoice);
  }

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `TW-${year}-`;
    const latest = await this.invoicesRepo
      .createQueryBuilder('invoice')
      .where('invoice.invoiceNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('invoice.invoiceNumber', 'DESC')
      .getOne();

    const next = latest
      ? Number.parseInt(latest.invoiceNumber.replace(prefix, ''), 10) + 1
      : 1;

    return `${prefix}${String(next).padStart(4, '0')}`;
  }
}
