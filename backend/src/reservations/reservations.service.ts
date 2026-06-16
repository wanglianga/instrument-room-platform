import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan, Between } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatus } from './enums/reservation.enum';
import { InstrumentsService } from '../instruments/instruments.service';
import { InstrumentStatus } from '../instruments/enums/instrument.enum';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    private instrumentsService: InstrumentsService,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: number): Promise<Reservation> {
    const instrument = await this.instrumentsService.findOne(createReservationDto.instrumentId);
    
    if (instrument.status !== InstrumentStatus.AVAILABLE) {
      throw new BadRequestException('该乐器当前不可借用');
    }

    const startTime = new Date(createReservationDto.startTime);
    const endTime = new Date(createReservationDto.endTime);

    if (startTime >= endTime) {
      throw new BadRequestException('结束时间必须晚于开始时间');
    }

    const conflict = await this.reservationsRepository.findOne({
      where: {
        instrumentId: createReservationDto.instrumentId,
        status: ReservationStatus.APPROVED,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });

    if (conflict) {
      throw new BadRequestException('该时间段乐器已被预约');
    }

    const deposit = createReservationDto.depositAmount ?? instrument.depositAmount;

    const reservation = this.reservationsRepository.create({
      ...createReservationDto,
      userId,
      depositAmount: deposit,
      status: ReservationStatus.PENDING,
    });

    return this.reservationsRepository.save(reservation);
  }

  async findAll(
    page = 1,
    limit = 10,
    status?: ReservationStatus,
    userId?: number,
  ): Promise<{ data: Reservation[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [data, total] = await this.reservationsRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user', 'instrument', 'room', 'approver'],
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findMyReservations(
    userId: number,
    page = 1,
    limit = 10,
    status?: ReservationStatus,
  ): Promise<{ data: Reservation[]; total: number; page: number; limit: number }> {
    return this.findAll(page, limit, status, userId);
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: ['user', 'instrument', 'room', 'approver'],
    });
    if (!reservation) {
      throw new NotFoundException(`预约 #${id} 不存在`);
    }
    return reservation;
  }

  async approve(id: number, approverId: number): Promise<Reservation> {
    const reservation = await this.findOne(id);
    
    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('只有待审核的预约可以审批');
    }

    reservation.status = ReservationStatus.APPROVED;
    reservation.approverId = approverId;
    reservation.approvedAt = new Date();

    return this.reservationsRepository.save(reservation);
  }

  async reject(id: number, approverId: number, reason: string): Promise<Reservation> {
    const reservation = await this.findOne(id);
    
    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('只有待审核的预约可以拒绝');
    }

    reservation.status = ReservationStatus.REJECTED;
    reservation.approverId = approverId;
    reservation.approvedAt = new Date();
    reservation.rejectReason = reason;

    return this.reservationsRepository.save(reservation);
  }

  async cancel(id: number, userId: number): Promise<Reservation> {
    const reservation = await this.findOne(id);
    
    if (reservation.userId !== userId) {
      throw new BadRequestException('只能取消自己的预约');
    }

    if (reservation.status !== ReservationStatus.PENDING && reservation.status !== ReservationStatus.APPROVED) {
      throw new BadRequestException('当前状态无法取消预约');
    }

    reservation.status = ReservationStatus.CANCELLED;

    return this.reservationsRepository.save(reservation);
  }

  async confirmBorrow(id: number): Promise<Reservation> {
    const reservation = await this.findOne(id);
    
    if (reservation.status !== ReservationStatus.APPROVED) {
      throw new BadRequestException('只有已批准的预约可以借出');
    }

    reservation.status = ReservationStatus.BORROWED;
    reservation.borrowTime = new Date();

    await this.instrumentsService.updateStatus(reservation.instrumentId, InstrumentStatus.BORROWED);

    return this.reservationsRepository.save(reservation);
  }

  async confirmReturn(id: number): Promise<Reservation> {
    const reservation = await this.findOne(id);
    
    if (reservation.status !== ReservationStatus.BORROWED) {
      throw new BadRequestException('只有借出中的预约可以归还');
    }

    reservation.status = ReservationStatus.RETURNED;
    reservation.returnTime = new Date();

    await this.instrumentsService.updateStatus(reservation.instrumentId, InstrumentStatus.AVAILABLE);

    return this.reservationsRepository.save(reservation);
  }

  async update(id: number, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);
    Object.assign(reservation, updateReservationDto);
    return this.reservationsRepository.save(reservation);
  }

  async remove(id: number): Promise<void> {
    const result = await this.reservationsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`预约 #${id} 不存在`);
    }
  }
}
