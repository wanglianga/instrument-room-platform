import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformancesService } from './performances.service';
import { PerformancesController } from './performances.controller';
import { Performance } from './entities/performance.entity';
import { Instrument } from '../instruments/entities/instrument.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Performance, Instrument])],
  controllers: [PerformancesController],
  providers: [PerformancesService],
  exports: [PerformancesService],
})
export class PerformancesModule {}
