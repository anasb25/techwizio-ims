import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Invoice } from './invoice.entity.js';

@Entity('invoice_items')
export class InvoiceItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  description!: string;

  @Column({ type: 'real', default: 1 })
  quantity!: number;

  @Column({ type: 'real' })
  unitPrice!: number;

  @Column({ type: 'real', default: 0 })
  taxRate!: number;

  @ManyToOne('Invoice', 'items', { onDelete: 'CASCADE' })
  invoice!: Invoice;

  @Column()
  invoiceId!: string;
}
