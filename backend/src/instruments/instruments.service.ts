import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Instrument } from './entities/instrument.entity';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';
import { InstrumentStatus } from './enums/instrument.enum';

@Injectable()
export class InstrumentsService {
  constructor(
    @InjectRepository(Instrument)
    private instrumentsRepository: Repository<Instrument>,
  ) {}

  async create(createInstrumentDto: CreateInstrumentDto): Promise<Instrument> {
    const instrument = this.instrumentsRepository.create(createInstrumentDto);
    return this.instrumentsRepository.save(instrument);
  }

  async findAll(
    page = 1,
    limit = 10,
    category?: string,
    status?: InstrumentStatus,
    keyword?: string,
  ): Promise<{ data: Instrument[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (keyword) where.name = Like(`%${keyword}%`);

    const [data, total] = await this.instrumentsRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['room'],
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Instrument> {
    const instrument = await this.instrumentsRepository.findOne({
      where: { id },
      relations: ['room'],
    });
    if (!instrument) {
      throw new NotFoundException(`乐器 #${id} 不存在`);
    }
    return instrument;
  }

  async update(id: number, updateInstrumentDto: UpdateInstrumentDto): Promise<Instrument> {
    const instrument = await this.findOne(id);
    Object.assign(instrument, updateInstrumentDto);
    return this.instrumentsRepository.save(instrument);
  }

  async updateStatus(id: number, status: InstrumentStatus): Promise<Instrument> {
    const instrument = await this.findOne(id);
    instrument.status = status;
    return this.instrumentsRepository.save(instrument);
  }

  async remove(id: number): Promise<void> {
    const result = await this.instrumentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`乐器 #${id} 不存在`);
    }
  }
}
