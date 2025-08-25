import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetModule } from './asset/asset.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from './asset/asset.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'nestdb',
      entities: [Asset],
      synchronize: true,
    }),
    AssetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
