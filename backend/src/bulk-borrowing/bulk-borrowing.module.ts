import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BulkBorrowingService } from './bulk-borrowing.service';
import { BulkBorrowingController } from './bulk-borrowing.controller';
import { BulkBorrowing } from './entities/bulk-borrowing.entity';
import { BulkBorrowingItem } from './entities/bulk-borrowing-item.entity';
import { BulkBorrowingConflict } from './entities/bulk-borrowing-conflict.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BulkBorrowing, BulkBorrowingItem, BulkBorrowingConflict])],
  controllers: [BulkBorrowingController],
  providers: [BulkBorrowingService],
  exports: [BulkBorrowingService],
})
export class BulkBorrowingModule {}
