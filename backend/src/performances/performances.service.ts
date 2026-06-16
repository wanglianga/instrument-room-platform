import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Performance } from './entities/performance.entity';
import { Instrument } from '../instruments/entities/instrument.entity';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { PerformanceStatus } from './enums/performance.enum';
import { InstrumentStatus } from '../instruments/enums/instrument.enum';

@Injectable()
export class PerformancesService {
  constructor(
    @InjectRepository(Performance)
    private performancesRepository: Repository<Performance>,
    @InjectRepository(Instrument)
    private instrumentsRepository: Repository<Instrument>,
  ) {}

  async create(createPerformanceDto: CreatePerformanceDto): Promise<Performance> {
    const { instrumentIds, ...performanceData } = createPerformanceDto;
    
    const performance = this.performancesRepository.create(performanceData);

    if (instrumentIds && instrumentIds.length > 0) {
      const instruments = await this.instrumentsRepository.findBy({ id: In(instrumentIds) });
      performance.instruments = instruments;
    }

    return this.performancesRepository.save(performance);
  }

  async findAll(
    page = 1,
    limit = 10,
    status?: PerformanceStatus,
    managerId?: number,
  ): Promise<{ data: Performance[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (status) where.status = status;
    if (managerId) where.managerId = managerId;

    const [data, total] = await this.performancesRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['manager', 'instruments'],
      order: { startTime: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findMyPerformances(
    managerId: number,
    page = 1,
    limit = 10,
    status?: PerformanceStatus,
  ): Promise<{ data: Performance[]; total: number; page: number; limit: number }> {
    return this.findAll(page, limit, status, managerId);
  }

  async findOne(id: number): Promise<Performance> {
    const performance = await this.performancesRepository.findOne({
      where: { id },
      relations: ['manager', 'instruments'],
    });
    if (!performance) {
      throw new NotFoundException(`演出 #${id} 不存在`);
    }
    return performance;
  }

  async addInstruments(id: number, instrumentIds: number[]): Promise<Performance> {
    const performance = await this.findOne(id);
    const instruments = await this.instrumentsRepository.findBy({ id: In(instrumentIds) });
    
    const existingIds = performance.instruments.map(i => i.id);
    const newInstruments = instruments.filter(i => !existingIds.includes(i.id));
    
    performance.instruments = [...performance.instruments, ...newInstruments];
    
    return this.performancesRepository.save(performance);
  }

  async removeInstrument(id: number, instrumentId: number): Promise<Performance> {
    const performance = await this.findOne(id);
    performance.instruments = performance.instruments.filter(i => i.id !== instrumentId);
    return this.performancesRepository.save(performance);
  }

  async startPreparation(id: number): Promise<Performance> {
    const performance = await this.findOne(id);
    
    if (performance.status !== PerformanceStatus.PLANNED) {
      throw new BadRequestException('只有计划中的演出可以开始筹备');
    }

    performance.status = PerformanceStatus.PREPARING;

    return this.performancesRepository.save(performance);
  }

  async startPerformance(id: number): Promise<Performance> {
    const performance = await this.findOne(id);
    
    if (performance.status !== PerformanceStatus.PREPARING) {
      throw new BadRequestException('只有筹备中的演出可以开始');
    }

    performance.status = PerformanceStatus.IN_PROGRESS;

    if (performance.instruments) {
      for (const instrument of performance.instruments) {
        instrument.status = InstrumentStatus.IN_PERFORMANCE;
        await this.instrumentsRepository.save(instrument);
      }
    }

    return this.performancesRepository.save(performance);
  }

  async completePerformance(id: number): Promise<Performance> {
    const performance = await this.findOne(id);
    
    if (performance.status !== PerformanceStatus.IN_PROGRESS) {
      throw new BadRequestException('只有进行中的演出可以完成');
    }

    performance.status = PerformanceStatus.COMPLETED;

    if (performance.instruments) {
      for (const instrument of performance.instruments) {
        instrument.status = InstrumentStatus.AVAILABLE;
        await this.instrumentsRepository.save(instrument);
      }
    }

    return this.performancesRepository.save(performance);
  }

  async cancelPerformance(id: number): Promise<Performance> {
    const performance = await this.findOne(id);
    
    if (performance.status === PerformanceStatus.COMPLETED || performance.status === PerformanceStatus.CANCELLED) {
      throw new BadRequestException('当前状态无法取消');
    }

    if (performance.status === PerformanceStatus.IN_PROGRESS && performance.instruments) {
      for (const instrument of performance.instruments) {
        instrument.status = InstrumentStatus.AVAILABLE;
        await this.instrumentsRepository.save(instrument);
      }
    }

    performance.status = PerformanceStatus.CANCELLED;

    return this.performancesRepository.save(performance);
  }

  async update(id: number, updatePerformanceDto: UpdatePerformanceDto): Promise<Performance> {
    const performance = await this.findOne(id);
    const { instrumentIds, ...updateData } = updatePerformanceDto;

    Object.assign(performance, updateData);

    if (instrumentIds) {
      const instruments = await this.instrumentsRepository.findBy({ id: In(instrumentIds) });
      performance.instruments = instruments;
    }

    return this.performancesRepository.save(performance);
  }

  async remove(id: number): Promise<void> {
    const result = await this.performancesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`演出 #${id} 不存在`);
    }
  }
}
