import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deposit } from './entities/deposit.entity';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { DepositStatus } from './enums/deposit.enum';

@Injectable()
export class DepositsService {
  constructor(
    @InjectRepository(Deposit)
    private depositsRepository: Repository<Deposit>,
  ) {}

  async create(createDepositDto: CreateDepositDto, userId: number): Promise<Deposit> {
    const deposit = this.depositsRepository.create({
      ...createDepositDto,
      userId,
    });
    return this.depositsRepository.save(deposit);
  }

  async findAll(
    page = 1,
    limit = 10,
    status?: DepositStatus,
    userId?: number,
  ): Promise<{ data: Deposit[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [data, total] = await this.depositsRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user', 'reservation', 'operator'],
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findMyDeposits(
    userId: number,
    page = 1,
    limit = 10,
    status?: DepositStatus,
  ): Promise<{ data: Deposit[]; total: number; page: number; limit: number }> {
    return this.findAll(page, limit, status, userId);
  }

  async findOne(id: number): Promise<Deposit> {
    const deposit = await this.depositsRepository.findOne({
      where: { id },
      relations: ['user', 'reservation', 'operator'],
    });
    if (!deposit) {
      throw new NotFoundException(`押金记录 #${id} 不存在`);
    }
    return deposit;
  }

  async confirmPayment(id: number, operatorId: number): Promise<Deposit> {
    const deposit = await this.findOne(id);
    
    if (deposit.status !== DepositStatus.UNPAID) {
      throw new BadRequestException('当前状态无法确认收款');
    }

    deposit.status = DepositStatus.PAID;
    deposit.paidAt = new Date();
    deposit.operatorId = operatorId;

    return this.depositsRepository.save(deposit);
  }

  async requestRefund(id: number, userId: number): Promise<Deposit> {
    const deposit = await this.findOne(id);
    
    if (deposit.userId !== userId) {
      throw new BadRequestException('只能申请退还自己的押金');
    }

    if (deposit.status !== DepositStatus.PAID) {
      throw new BadRequestException('当前状态无法申请退款');
    }

    deposit.status = DepositStatus.REFUNDING;

    return this.depositsRepository.save(deposit);
  }

  async confirmRefund(id: number, operatorId: number): Promise<Deposit> {
    const deposit = await this.findOne(id);
    
    if (deposit.status !== DepositStatus.REFUNDING) {
      throw new BadRequestException('当前状态无法确认退款');
    }

    deposit.status = DepositStatus.REFUNDED;
    deposit.refundedAt = new Date();
    deposit.operatorId = operatorId;

    return this.depositsRepository.save(deposit);
  }

  async deductDeposit(id: number, operatorId: number, remark?: string): Promise<Deposit> {
    const deposit = await this.findOne(id);
    
    if (deposit.status !== DepositStatus.PAID) {
      throw new BadRequestException('当前状态无法扣除押金');
    }

    deposit.status = DepositStatus.DEDUCTED;
    deposit.operatorId = operatorId;
    if (remark) {
      deposit.remark = remark;
    }

    return this.depositsRepository.save(deposit);
  }

  async update(id: number, updateDepositDto: UpdateDepositDto): Promise<Deposit> {
    const deposit = await this.findOne(id);
    Object.assign(deposit, updateDepositDto);
    return this.depositsRepository.save(deposit);
  }

  async remove(id: number): Promise<void> {
    const result = await this.depositsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`押金记录 #${id} 不存在`);
    }
  }
}
