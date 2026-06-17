import { IsString, IsDateString, IsNumber, IsOptional, IsArray, IsNotEmpty } from 'class-validator';

export class CreatePerformanceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNumber()
  @IsOptional()
  managerId?: number;

  @IsArray()
  @IsOptional()
  instrumentIds?: number[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  programList?: string;

  @IsString()
  @IsOptional()
  rehearsalSchedule?: string;

  @IsDateString()
  @IsOptional()
  setupStartTime?: string;

  @IsDateString()
  @IsOptional()
  tearDownEndTime?: string;
}
