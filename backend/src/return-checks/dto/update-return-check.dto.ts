import { PartialType } from '@nestjs/mapped-types';
import { CreateReturnCheckDto } from './create-return-check.dto';

export class UpdateReturnCheckDto extends PartialType(CreateReturnCheckDto) {}
