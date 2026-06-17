import { IsEnum, IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { DisputeType } from '../enums/dispute.enum';

export class CreateDisputeDto {
  @IsEnum(DisputeType)
  disputeType: DisputeType;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  photos?: string;

  @IsNumber()
  instrumentId: number;

  @IsNumber()
  reservationId: number;

  @IsNumber()
  @IsOptional()
  returnCheckId?: number;

  @IsString()
  @IsOptional()
  checkoutPhotos?: string;
}
