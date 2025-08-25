import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { DataSource } from 'typeorm';
import { Asset } from './asset.entity';

@Injectable()
export class AssetCronService {
  private readonly logger = new Logger(AssetCronService.name);
  private readonly apiUrl = 'https://669ce22d15704bb0e304842d.mockapi.io/assets';

  constructor(
    private dataSource: DataSource,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.log('Cron fetching daily asset started!');
    try {
      const response = await axios.get(this.apiUrl);
      const assets: Asset[] = response.data.map(item => ({
          ...item,
          created_at: item.created_at ? new Date(item.created_at * 1000) : new Date(),
          updated_at: item.updated_at ? new Date(item.updated_at * 1000) : new Date(),
        }));

      if (response.status === HttpStatus.OK) {
        await this.dataSource.transaction(async (manager) => {
        for (const item of assets) {
          const existing = await manager.findOne(Asset, { where: { id: item.id } });
          if (existing) {
            await manager.update(Asset, { id: item.id }, item);
          } else {
            const entity = manager.create(Asset, item);
            await manager.save(entity);
          }
        }
      });

      this.logger.log('Cron fetching daily asset finished!');
      } else {
        this.logger.warn(`API returned status ${response.status}, skipping update.`);
      }
    } catch (error) {
      this.logger.error('Error fetching assets', error);
    }
  }
}
