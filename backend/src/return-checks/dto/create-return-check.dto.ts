import { IsEnum, IsString, IsNumber, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { ReturnCheckResult } from '../enums/return-check.enum';

export class CreateReturnCheckDto {
  @IsEnum(ReturnCheckResult)
  result: ReturnCheckResult;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  damageDetails?: string;

  @IsNumber()
  @IsOptional()
  estimatedRepairCost?: number;

  @IsNumber()
  instrumentId: number;

  @IsNumber()
  reservationId: number;

  @IsBoolean()
  @IsOptional()
  hasDamage?: boolean;

  @IsString()
  @IsOptional()
  photos?: string;
}
