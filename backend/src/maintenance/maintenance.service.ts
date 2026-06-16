import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRecord } from './entities/maintenance-record.entity';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from './dto/update-maintenance-record.dto';
import { MaintenanceStatus, MaintenanceType } from './enums/maintenance.enum';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(MaintenanceRecord)
    private maintenanceRecordsRepository: Repository<MaintenanceRecord>,
  ) {}

  async create(createMaintenanceRecordDto: CreateMaintenanceRecordDto): Promise<MaintenanceRecord> {
    const record = this.maintenanceRecordsRepository.create(createMaintenanceRecordDto);
    return this.maintenanceRecordsRepository.save(record);
  }

  async findAll(
    page = 1,
    limit = 10,
    type?: MaintenanceType,
    status?: MaintenanceStatus,
    instrumentId?: number,
    technicianId?: number,
  ): Promise<{ data: MaintenanceRecord[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (instrumentId) where.instrumentId = instrumentId;
    if (technicianId) where.technicianId = technicianId;

    const [data, total] = await this.maintenanceRecordsRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['instrument', 'technician'],
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findMyMaintenance(
    technicianId: number,
    page = 1,
    limit = 10,
    status?: MaintenanceStatus,
  ): Promise<{ data: MaintenanceRecord[]; total: number; page: number; limit: number }> {
    return this.findAll(page, limit, undefined, status, undefined, technicianId);
  }

  async findOne(id: number): Promise<MaintenanceRecord> {
    const record = await this.maintenanceRecordsRepository.findOne({
      where: { id },
      relations: ['instrument', 'technician'],
    });
    if (!record) {
      throw new NotFoundException(`保养记录 #${id} 不存在`);
    }
    return record;
  }

  async startMaintenance(id: number, technicianId: number): Promise<MaintenanceRecord> {
    const record = await this.findOne(id);
    
    if (record.status !== MaintenanceStatus.PENDING) {
      throw new BadRequestException('只有待处理的保养记录可以开始');
    }

    record.status = MaintenanceStatus.IN_PROGRESS;
    record.technicianId = technicianId;
    record.startedAt = new Date();

    return this.maintenanceRecordsRepository.save(record);
  }

  async completeMaintenance(id: number, result: string, cost?: number): Promise<MaintenanceRecord> {
    const record = await this.findOne(id);
    
    if (record.status !== MaintenanceStatus.IN_PROGRESS) {
      throw new BadRequestException('只有进行中的保养记录可以完成');
    }

    record.status = MaintenanceStatus.COMPLETED;
    record.result = result;
    record.completedAt = new Date();
    if (cost !== undefined) {
      record.cost = cost;
    }

    return this.maintenanceRecordsRepository.save(record);
  }

  async cancelMaintenance(id: number): Promise<MaintenanceRecord> {
    const record = await this.findOne(id);
    
    if (record.status !== MaintenanceStatus.PENDING && record.status !== MaintenanceStatus.IN_PROGRESS) {
      throw new BadRequestException('当前状态无法取消');
    }

    record.status = MaintenanceStatus.CANCELLED;

    return this.maintenanceRecordsRepository.save(record);
  }

  async update(id: number, updateMaintenanceRecordDto: UpdateMaintenanceRecordDto): Promise<MaintenanceRecord> {
    const record = await this.findOne(id);
    Object.assign(record, updateMaintenanceRecordDto);
    return this.maintenanceRecordsRepository.save(record);
  }

  async remove(id: number): Promise<void> {
    const result = await this.maintenanceRecordsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`保养记录 #${id} 不存在`);
    }
  }
}
