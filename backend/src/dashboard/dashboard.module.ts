import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity.js';
import { Invoice } from '../entities/invoice.entity.js';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Client])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
