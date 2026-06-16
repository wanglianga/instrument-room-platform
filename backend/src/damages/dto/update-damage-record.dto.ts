import { PartialType } from '@nestjs/mapped-types';
import { CreateDamageRecordDto } from './create-damage-record.dto';

export class UpdateDamageRecordDto extends PartialType(CreateDamageRecordDto) {}
