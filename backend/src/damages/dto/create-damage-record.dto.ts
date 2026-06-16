import { IsEnum, IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { DamageSeverity } from '../enums/damage.enum';

export class CreateDamageRecordDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(DamageSeverity)
  severity: DamageSeverity;

  @IsNumber()
  @IsOptional()
  compensationAmount?: number;

  @IsNumber()
  @IsOptional()
  repairCost?: number;

  @IsString()
  @IsOptional()
  assessNotes?: string;

  @IsString()
  @IsOptional()
  photos?: string;

  @IsNumber()
  instrumentId: number;

  @IsNumber()
  @IsOptional()
  reservationId?: number;

  @IsNumber()
  @IsOptional()
  returnCheckId?: number;

  @IsNumber()
  @IsOptional()
  responsibleUserId?: number;
}
