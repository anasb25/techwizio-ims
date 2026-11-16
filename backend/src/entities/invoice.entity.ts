import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceStatus } from '../common/enums/invoice-status.enum.js';
import type { Client } from './client.entity.js';
import type { InvoiceItem } from './invoice-item.entity.js';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  invoiceNumber!: string;

  @Column({ type: 'text', default: InvoiceStatus.DRAFT })
  status!: InvoiceStatus;

  @Column({ type: 'date' })
  issueDate!: string;

  @Column({ type: 'date' })
  dueDate!: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  terms?: string;

  @Column({ type: 'real', default: 0 })
  discount!: number;

  @Column({ type: 'real', default: 0 })
  subtotal!: number;

  @Column({ type: 'real', default: 0 })
  taxTotal!: number;

  @Column({ type: 'real', default: 0 })
  total!: number;

  @ManyToOne('Client', 'invoices', { eager: true })
  client!: Client;

  @Column()
  clientId!: string;

  @OneToMany('InvoiceItem', 'invoice', {
    cascade: true,
    eager: true,
  })
  items!: InvoiceItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
