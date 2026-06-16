import { IsString, IsNumber, IsOptional, IsBoolean, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  roomNo: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNumber()
  @IsPositive()
  capacity: number;

  @IsString()
  @IsOptional()
  equipment?: string;

  @IsString()
  @IsOptional()
  openHours?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
