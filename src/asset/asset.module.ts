import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './asset.entity';
import { AssetCronService } from './asset.cron';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [AssetCronService],
  controllers: [],
})

export class AssetModule {}
