import { IsString, IsDateString, IsNumber, IsOptional, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkBorrowingItemDto {
  @IsNumber()
  @IsOptional()
  instrumentId?: number;

  @IsNumber()
  @IsOptional()
  roomId?: number;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateBulkBorrowingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  programList?: string;

  @IsString()
  @IsOptional()
  rehearsalSchedule?: string;

  @IsString()
  @IsOptional()
  borrowingList?: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNumber()
  @IsOptional()
  performanceId?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkBorrowingItemDto)
  @IsOptional()
  items?: BulkBorrowingItemDto[];
}
