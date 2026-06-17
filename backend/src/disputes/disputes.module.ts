import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisputesService } from './disputes.service';
import { DisputesController } from './disputes.controller';
import { ReturnDispute } from './entities/return-dispute.entity';
import { DepositsModule } from '../deposits/deposits.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReturnDispute]), DepositsModule],
  controllers: [DisputesController],
  providers: [DisputesService],
  exports: [DisputesService],
})
export class DisputesModule {}
