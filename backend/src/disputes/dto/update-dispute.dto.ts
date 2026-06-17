import { IsEnum, IsString, IsNumber, IsOptional } from 'class-validator';
import { DisputeStatus, PerformanceImpact } from '../enums/dispute.enum';

export class UpdateDisputeDto {
  @IsEnum(DisputeStatus)
  @IsOptional()
  status?: DisputeStatus;

  @IsNumber()
  @IsOptional()
  teacherId?: number;

  @IsEnum(PerformanceImpact)
  @IsOptional()
  performanceImpact?: PerformanceImpact;

  @IsString()
  @IsOptional()
  teacherComment?: string;

  @IsNumber()
  @IsOptional()
  technicianId?: number;

  @IsNumber()
  @IsOptional()
  repairQuote?: number;

  @IsString()
  @IsOptional()
  technicianComment?: string;

  @IsNumber()
  @IsOptional()
  deductedAmount?: number;

  @IsString()
  @IsOptional()
  resolutionNote?: string;
}
