import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health/health.controller.js';
import { ClientsModule } from './clients/clients.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { DatabaseModule } from './database/database.module.js';
import { Client } from './entities/client.entity.js';
import { CompanySettings } from './entities/company-settings.entity.js';
import { InvoiceItem } from './entities/invoice-item.entity.js';
import { Invoice } from './entities/invoice.entity.js';
import { InvoicesModule } from './invoices/invoices.module.js';
import { SettingsModule } from './settings/settings.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DATABASE_PATH ?? 'techwizio-ims.sqlite',
      entities: [Client, Invoice, InvoiceItem, CompanySettings],
      synchronize: true,
    }),
    ClientsModule,
    InvoicesModule,
    SettingsModule,
    DashboardModule,
    DatabaseModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
