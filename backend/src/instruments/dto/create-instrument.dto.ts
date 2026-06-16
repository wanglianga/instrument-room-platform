import { IsString, IsEnum, IsDateString, IsNumber, IsOptional, IsBoolean, IsPositive, IsNotEmpty } from 'class-validator';
import { InstrumentCategory, InstrumentStatus } from '../enums/instrument.enum';

export class CreateInstrumentDto {
  @IsNotEmpty()
  @IsString()
  instrumentNo: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(InstrumentCategory)
  category: InstrumentCategory;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsDateString()
  purchaseDate: string;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsEnum(InstrumentStatus)
  @IsOptional()
  status?: InstrumentStatus;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsOptional()
  roomId?: number;

  @IsNumber()
  @IsOptional()
  depositAmount?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
