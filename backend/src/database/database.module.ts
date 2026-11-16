import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity.js';
import { CompanySettings } from '../entities/company-settings.entity.js';
import { InvoiceItem } from '../entities/invoice-item.entity.js';
import { Invoice } from '../entities/invoice.entity.js';
import { SettingsModule } from '../settings/settings.module.js';
import { SeedService } from './seed.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Invoice, InvoiceItem, CompanySettings]),
    SettingsModule,
  ],
  providers: [SeedService],
})
export class DatabaseModule {}
