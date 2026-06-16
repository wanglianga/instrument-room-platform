import { IsEnum, IsDateString, IsNumber, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ReservationPurpose } from '../enums/reservation.enum';

export class CreateReservationDto {
  @IsEnum(ReservationPurpose)
  purpose: ReservationPurpose;

  @IsNotEmpty()
  @IsString()
  purposeDescription: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNumber()
  @IsOptional()
  depositAmount?: number;

  @IsNumber()
  instrumentId: number;

  @IsNumber()
  @IsOptional()
  roomId?: number;
}
