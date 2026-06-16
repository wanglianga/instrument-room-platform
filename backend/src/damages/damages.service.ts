import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DamageRecord } from './entities/damage-record.entity';
import { CreateDamageRecordDto } from './dto/create-damage-record.dto';
import { UpdateDamageRecordDto } from './dto/update-damage-record.dto';
import { DamageStatus } from './enums/damage.enum';

@Injectable()
export class DamagesService {
  constructor(
    @InjectRepository(DamageRecord)
    private damageRecordsRepository: Repository<DamageRecord>,
  ) {}

  async create(createDamageRecordDto: CreateDamageRecordDto, reporterId: number): Promise<DamageRecord> {
    const record = this.damageRecordsRepository.create({
      ...createDamageRecordDto,
      reportedById: reporterId,
    });
    return this.damageRecordsRepository.save(record);
  }

  async findAll(
    page = 1,
    limit = 10,
    status?: DamageStatus,
    instrumentId?: number,
    responsibleUserId?: number,
  ): Promise<{ data: DamageRecord[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (status) where.status = status;
    if (instrumentId) where.instrumentId = instrumentId;
    if (responsibleUserId) where.responsibleUserId = responsibleUserId;

    const [data, total] = await this.damageRecordsRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['instrument', 'reportedBy', 'responsibleUser', 'reservation', 'handledBy'],
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findMyDamages(
    userId: number,
    page = 1,
    limit = 10,
    status?: DamageStatus,
  ): Promise<{ data: DamageRecord[]; total: number; page: number; limit: number }> {
    return this.findAll(page, limit, status, undefined, userId);
  }

  async findOne(id: number): Promise<DamageRecord> {
    const record = await this.damageRecordsRepository.findOne({
      where: { id },
      relations: ['instrument', 'reportedBy', 'responsibleUser', 'reservation', 'returnCheck', 'handledBy'],
    });
    if (!record) {
      throw new NotFoundException(`损坏记录 #${id} 不存在`);
    }
    return record;
  }

  async assess(id: number, handlerId: number, compensationAmount: number, assessNotes?: string): Promise<DamageRecord> {
    const record = await this.findOne(id);
    
    if (record.status !== DamageStatus.REPORTED && record.status !== DamageStatus.ASSESSING) {
      throw new BadRequestException('当前状态无法进行定损');
    }

    record.status = DamageStatus.PENDING_PAYMENT;
    record.compensationAmount = compensationAmount;
    record.handledById = handlerId;
    if (assessNotes) {
      record.assessNotes = assessNotes;
    }

    return this.damageRecordsRepository.save(record);
  }

  async confirmPayment(id: number, handlerId: number): Promise<DamageRecord> {
    const record = await this.findOne(id);
    
    if (record.status !== DamageStatus.PENDING_PAYMENT) {
      throw new BadRequestException('当前状态无法确认付款');
    }

    record.status = DamageStatus.PAID;
    record.paidAt = new Date();
    record.handledById = handlerId;

    return this.damageRecordsRepository.save(record);
  }

  async resolve(id: number, handlerId: number, resolutionNotes?: string): Promise<DamageRecord> {
    const record = await this.findOne(id);
    
    if (record.status === DamageStatus.CLOSED) {
      throw new BadRequestException('已结案的记录无法操作');
    }

    record.status = DamageStatus.RESOLVED;
    record.handledById = handlerId;
    if (resolutionNotes) {
      record.resolutionNotes = resolutionNotes;
    }

    return this.damageRecordsRepository.save(record);
  }

  async close(id: number, handlerId: number): Promise<DamageRecord> {
    const record = await this.findOne(id);
    
    if (record.status !== DamageStatus.RESOLVED && record.status !== DamageStatus.PAID) {
      throw new BadRequestException('只有已解决或已赔偿的记录才能结案');
    }

    record.status = DamageStatus.CLOSED;
    record.handledById = handlerId;

    return this.damageRecordsRepository.save(record);
  }

  async update(id: number, updateDamageRecordDto: UpdateDamageRecordDto): Promise<DamageRecord> {
    const record = await this.findOne(id);
    Object.assign(record, updateDamageRecordDto);
    return this.damageRecordsRepository.save(record);
  }

  async remove(id: number): Promise<void> {
    const result = await this.damageRecordsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`损坏记录 #${id} 不存在`);
    }
  }
}
