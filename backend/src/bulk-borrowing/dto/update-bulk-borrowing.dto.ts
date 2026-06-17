import { PartialType } from '@nestjs/mapped-types';
import { CreateBulkBorrowingDto } from './create-bulk-borrowing.dto';

export class UpdateBulkBorrowingDto extends PartialType(CreateBulkBorrowingDto) {}
