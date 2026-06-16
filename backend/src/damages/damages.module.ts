import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DamagesService } from './damages.service';
import { DamagesController } from './damages.controller';
import { DamageRecord } from './entities/damage-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DamageRecord])],
  controllers: [DamagesController],
  providers: [DamagesService],
  exports: [DamagesService],
})
export class DamagesModule {}
