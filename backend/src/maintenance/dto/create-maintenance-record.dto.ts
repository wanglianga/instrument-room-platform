import { IsEnum, IsString, IsNumber, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';
import { MaintenanceType } from '../enums/maintenance.enum';

export class CreateMaintenanceRecordDto {
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  result?: string;

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsNumber()
  @IsOptional()
  technicianId?: number;

  @IsNumber()
  instrumentId: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
