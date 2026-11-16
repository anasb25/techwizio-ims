import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanySettings } from '../entities/company-settings.entity.js';
import { UpdateSettingsDto } from './dto/update-settings.dto.js';

const DEFAULT_SETTINGS: Partial<CompanySettings> = {
  companyName: 'Techwizio FZE',
  tagline: 'Innovative Technology Solutions',
  email: 'info@techwizio.com',
  website: 'www.techwizio.com',
  defaultTerms:
    'Payment is due within the period stated on this invoice. Late payments may incur additional charges.',
  currency: 'AED',
};

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(CompanySettings)
    private readonly settingsRepo: Repository<CompanySettings>,
  ) {}

  async ensureDefaults(): Promise<void> {
    const count = await this.settingsRepo.count();
    if (count === 0) {
      await this.settingsRepo.save(this.settingsRepo.create(DEFAULT_SETTINGS));
    }
  }

  async get(): Promise<CompanySettings> {
    await this.ensureDefaults();
    const settings = await this.settingsRepo.find({ take: 1 });
    return settings[0]!;
  }

  async update(dto: UpdateSettingsDto): Promise<CompanySettings> {
    const settings = await this.get();
    Object.assign(settings, dto);
    return this.settingsRepo.save(settings);
  }
}
