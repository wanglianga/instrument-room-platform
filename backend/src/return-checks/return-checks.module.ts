import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReturnChecksService } from './return-checks.service';
import { ReturnChecksController } from './return-checks.controller';
import { ReturnCheck } from './entities/return-check.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReturnCheck])],
  controllers: [ReturnChecksController],
  providers: [ReturnChecksService],
  exports: [ReturnChecksService],
})
export class ReturnChecksModule {}
