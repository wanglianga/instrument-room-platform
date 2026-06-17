import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReturnDispute } from './entities/return-dispute.entity';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { DisputeStatus, PerformanceImpact } from './enums/dispute.enum';
import { DepositsService } from '../deposits/deposits.service';
import { DepositStatus } from '../deposits/enums/deposit.enum';

@Injectable()
export class DisputesService {
  constructor(
    @InjectRepository(ReturnDispute)
    private disputesRepository: Repository<ReturnDispute>,
    private depositsService: DepositsService,
  ) {}

  async create(createDisputeDto: CreateDisputeDto, registeredById: number): Promise<ReturnDispute> {
    const dispute = this.disputesRepository.create({
      ...createDisputeDto,
      registeredById,
      status: DisputeStatus.PENDING,
    });
    const saved = await this.disputesRepository.save(dispute);

    await this.freezeDepositByReservation(createDisputeDto.reservationId);

    return saved;
  }

  private async freezeDepositByReservation(reservationId: number): Promise<void> {
    try {
      const depositResult = await this.depositsService.findAll(1, 1, undefined, undefined);
      const deposit = depositResult.data.find(d => d.reservationId === reservationId && d.status === DepositStatus.PAID);
      if (deposit) {
        await this.depositsService.update(deposit.id, { status: DepositStatus.FROZEN } as any);
      }
    } catch {}
  }

  async findAll(
    page = 1,
    limit = 10,
    status?: DisputeStatus,
    instrumentId?: number,
  ): Promise<{ data: ReturnDispute[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (status) where.status = status;
    if (instrumentId) where.instrumentId = instrumentId;

    const [data, total] = await this.disputesRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['instrument', 'reservation', 'registeredBy', 'teacher', 'technician', 'returnCheck'],
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findByReservationId(reservationId: number): Promise<ReturnDispute[]> {
    return this.disputesRepository.find({
      where: { reservationId },
      relations: ['instrument', 'registeredBy', 'teacher', 'technician'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ReturnDispute> {
    const dispute = await this.disputesRepository.findOne({
      where: { id },
      relations: ['instrument', 'reservation', 'registeredBy', 'teacher', 'technician', 'returnCheck'],
    });
    if (!dispute) {
      throw new NotFoundException(`归还争议 #${id} 不存在`);
    }
    return dispute;
  }

  async teacherReview(id: number, teacherId: number, performanceImpact: PerformanceImpact, comment: string): Promise<ReturnDispute> {
    const dispute = await this.findOne(id);

    if (dispute.status !== DisputeStatus.PENDING && dispute.status !== DisputeStatus.TEACHER_REVIEWING) {
      throw new BadRequestException('当前状态无法进行指导老师审核');
    }

    dispute.status = DisputeStatus.TEACHER_REVIEWING;
    dispute.teacherId = teacherId;
    dispute.performanceImpact = performanceImpact;
    dispute.teacherComment = comment;
    dispute.teacherReviewedAt = new Date();

    if (performanceImpact !== PerformanceImpact.NEEDS_ASSESSMENT) {
      dispute.status = DisputeStatus.TECHNICIAN_QUOTING;
    }

    return this.disputesRepository.save(dispute);
  }

  async technicianQuote(id: number, technicianId: number, repairQuote: number, comment: string): Promise<ReturnDispute> {
    const dispute = await this.findOne(id);

    if (dispute.status !== DisputeStatus.TECHNICIAN_QUOTING) {
      throw new BadRequestException('当前状态无法进行维修技师报价');
    }

    dispute.technicianId = technicianId;
    dispute.repairQuote = repairQuote;
    dispute.technicianComment = comment;
    dispute.technicianQuotedAt = new Date();

    return this.disputesRepository.save(dispute);
  }

  async resolve(id: number, deductedAmount: number, resolutionNote: string): Promise<ReturnDispute> {
    const dispute = await this.findOne(id);

    if (dispute.status !== DisputeStatus.TECHNICIAN_QUOTING) {
      throw new BadRequestException('当前状态无法解决争议');
    }

    dispute.status = DisputeStatus.RESOLVED;
    dispute.deductedAmount = deductedAmount;
    dispute.resolutionNote = resolutionNote;
    dispute.resolvedAt = new Date();

    return this.disputesRepository.save(dispute);
  }

  async close(id: number): Promise<ReturnDispute> {
    const dispute = await this.findOne(id);

    if (dispute.status !== DisputeStatus.RESOLVED) {
      throw new BadRequestException('只有已解决的争议可以关闭');
    }

    dispute.status = DisputeStatus.CLOSED;

    return this.disputesRepository.save(dispute);
  }

  async update(id: number, updateDisputeDto: UpdateDisputeDto): Promise<ReturnDispute> {
    const dispute = await this.findOne(id);
    Object.assign(dispute, updateDisputeDto);
    return this.disputesRepository.save(dispute);
  }

  async remove(id: number): Promise<void> {
    const result = await this.disputesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`归还争议 #${id} 不存在`);
    }
  }
}
