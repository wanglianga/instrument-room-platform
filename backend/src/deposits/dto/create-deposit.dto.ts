import { IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { DepositStatus } from '../enums/deposit.enum';

export class CreateDepositDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  reservationId: number;

  @IsEnum(DepositStatus)
  @IsOptional()
  status?: DepositStatus;

  @IsString()
  @IsOptional()
  remark?: string;
}
