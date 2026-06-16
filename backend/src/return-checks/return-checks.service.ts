import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReturnCheck } from './entities/return-check.entity';
import { CreateReturnCheckDto } from './dto/create-return-check.dto';
import { UpdateReturnCheckDto } from './dto/update-return-check.dto';

@Injectable()
export class ReturnChecksService {
  constructor(
    @InjectRepository(ReturnCheck)
    private returnChecksRepository: Repository<ReturnCheck>,
  ) {}

  async create(createReturnCheckDto: CreateReturnCheckDto, checkerId: number): Promise<ReturnCheck> {
    const returnCheck = this.returnChecksRepository.create({
      ...createReturnCheckDto,
      checkerId,
    });
    return this.returnChecksRepository.save(returnCheck);
  }

  async findAll(
    page = 1,
    limit = 10,
    instrumentId?: number,
    reservationId?: number,
  ): Promise<{ data: ReturnCheck[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (instrumentId) where.instrumentId = instrumentId;
    if (reservationId) where.reservationId = reservationId;

    const [data, total] = await this.returnChecksRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['checker', 'instrument', 'reservation'],
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<ReturnCheck> {
    const returnCheck = await this.returnChecksRepository.findOne({
      where: { id },
      relations: ['checker', 'instrument', 'reservation'],
    });
    if (!returnCheck) {
      throw new NotFoundException(`归还检查记录 #${id} 不存在`);
    }
    return returnCheck;
  }

  async findByReservationId(reservationId: number): Promise<ReturnCheck> {
    return this.returnChecksRepository.findOne({
      where: { reservationId },
      relations: ['checker', 'instrument', 'reservation'],
    });
  }

  async update(id: number, updateReturnCheckDto: UpdateReturnCheckDto): Promise<ReturnCheck> {
    const returnCheck = await this.findOne(id);
    Object.assign(returnCheck, updateReturnCheckDto);
    return this.returnChecksRepository.save(returnCheck);
  }

  async remove(id: number): Promise<void> {
    const result = await this.returnChecksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`归还检查记录 #${id} 不存在`);
    }
  }
}
