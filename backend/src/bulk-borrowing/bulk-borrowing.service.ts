import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan, LessThan } from 'typeorm';
import { BulkBorrowing } from './entities/bulk-borrowing.entity';
import { BulkBorrowingItem } from './entities/bulk-borrowing-item.entity';
import { BulkBorrowingConflict } from './entities/bulk-borrowing-conflict.entity';
import { CreateBulkBorrowingDto } from './dto/create-bulk-borrowing.dto';
import { UpdateBulkBorrowingDto } from './dto/update-bulk-borrowing.dto';
import { BulkBorrowingStatus, ConflictType, ConflictSeverity } from './enums/bulk-borrowing.enum';
import { ReservationStatus } from '../reservations/enums/reservation.enum';
import { InstrumentStatus } from '../instruments/enums/instrument.enum';

@Injectable()
export class BulkBorrowingService {
  constructor(
    @InjectRepository(BulkBorrowing)
    private bulkBorrowingRepository: Repository<BulkBorrowing>,
    @InjectRepository(BulkBorrowingItem)
    private bulkBorrowingItemRepository: Repository<BulkBorrowingItem>,
    @InjectRepository(BulkBorrowingConflict)
    private bulkBorrowingConflictRepository: Repository<BulkBorrowingConflict>,
  ) {}

  async create(createDto: CreateBulkBorrowingDto, organizerId: number): Promise<BulkBorrowing> {
    const bulkBorrowing = this.bulkBorrowingRepository.create({
      name: createDto.name,
      programList: createDto.programList,
      rehearsalSchedule: createDto.rehearsalSchedule,
      borrowingList: createDto.borrowingList,
      startTime: new Date(createDto.startTime),
      endTime: new Date(createDto.endTime),
      organizerId,
      performanceId: createDto.performanceId,
      notes: createDto.notes,
      status: BulkBorrowingStatus.DRAFT,
    });

    const saved = await this.bulkBorrowingRepository.save(bulkBorrowing);

    if (createDto.items && createDto.items.length > 0) {
      const itemEntities = createDto.items.map(item =>
        this.bulkBorrowingItemRepository.create({
          ...item,
          bulkBorrowingId: saved.id,
        })
      );
      await this.bulkBorrowingItemRepository.save(itemEntities);
    }

    return this.findOne(saved.id);
  }

  async detectConflicts(id: number): Promise<BulkBorrowingConflict[]> {
    const bulkBorrowing = await this.findOne(id);
    const startTime = bulkBorrowing.startTime;
    const endTime = bulkBorrowing.endTime;
    const conflicts: BulkBorrowingConflict[] = [];

    for (const item of bulkBorrowing.items || []) {
      if (item.instrumentId) {
        const instrument = item.instrument;

        if (instrument.status === InstrumentStatus.IN_REPAIR) {
          const conflict = this.bulkBorrowingConflictRepository.create({
            bulkBorrowingId: id,
            conflictType: ConflictType.INSTRUMENT_IN_REPAIR,
            severity: ConflictSeverity.ERROR,
            description: `乐器"${instrument.name}"正在维修中，无法借用`,
            instrumentId: item.instrumentId,
            suggestion: '更换其他同类乐器或等待维修完成',
          });
          conflicts.push(conflict);
        }

        if (instrument.status === InstrumentStatus.SEALED) {
          const conflict = this.bulkBorrowingConflictRepository.create({
            bulkBorrowingId: id,
            conflictType: ConflictType.INSTRUMENT_SEALED,
            severity: ConflictSeverity.ERROR,
            description: `乐器"${instrument.name}"已封存，无法借用`,
            instrumentId: item.instrumentId,
            suggestion: '联系管理员解除封存或更换乐器',
          });
          conflicts.push(conflict);
        }

        if (instrument.status === InstrumentStatus.BORROWED) {
          const conflict = this.bulkBorrowingConflictRepository.create({
            bulkBorrowingId: id,
            conflictType: ConflictType.INSTRUMENT_UNAVAILABLE,
            severity: ConflictSeverity.WARNING,
            description: `乐器"${instrument.name}"当前已被借出`,
            instrumentId: item.instrumentId,
            suggestion: '确认归还时间或更换乐器',
          });
          conflicts.push(conflict);
        }

        if (instrument.status === InstrumentStatus.IN_PERFORMANCE) {
          const conflict = this.bulkBorrowingConflictRepository.create({
            bulkBorrowingId: id,
            conflictType: ConflictType.INSTRUMENT_UNAVAILABLE,
            severity: ConflictSeverity.WARNING,
            description: `乐器"${instrument.name}"正在演出使用中`,
            instrumentId: item.instrumentId,
            suggestion: '确认演出结束时间或更换乐器',
          });
          conflicts.push(conflict);
        }

        const { Reservation } = require('../reservations/entities/reservation.entity');
        const reservationConflict = await this.detectInstrumentReservationConflict(
          item.instrumentId, startTime, endTime, id
        );
        if (reservationConflict) {
          conflicts.push(reservationConflict);
        }
      }

      if (item.roomId) {
        const roomConflict = await this.detectRoomConflict(
          item.roomId, startTime, endTime, id
        );
        if (roomConflict) {
          conflicts.push(roomConflict);
        }
      }
    }

    await this.bulkBorrowingConflictRepository.delete({ bulkBorrowingId: id });
    if (conflicts.length > 0) {
      await this.bulkBorrowingConflictRepository.save(conflicts);
    }

    return conflicts;
  }

  private async detectInstrumentReservationConflict(
    instrumentId: number,
    startTime: Date,
    endTime: number | Date,
    excludeBulkId: number,
  ): Promise<BulkBorrowingConflict | null> {
    const end = endTime instanceof Date ? endTime : new Date(endTime);
    const conflictingReservation = await this.bulkBorrowingRepository.manager.getRepository('Reservation')
      .createQueryBuilder('reservation')
      .where('reservation.instrumentId = :instrumentId', { instrumentId })
      .andWhere('reservation.status IN (:...statuses)', { statuses: [ReservationStatus.APPROVED, ReservationStatus.BORROWED] })
      .andWhere('reservation.startTime < :endTime', { endTime: end })
      .andWhere('reservation.endTime > :startTime', { startTime })
      .getOne();

    if (conflictingReservation) {
      return this.bulkBorrowingConflictRepository.create({
        bulkBorrowingId: excludeBulkId,
        conflictType: ConflictType.RESERVATION_CONFLICT,
        severity: ConflictSeverity.WARNING,
        description: `该乐器在所选时间段已有其他预约`,
        instrumentId,
        suggestion: '调整借用时间或更换乐器',
      });
    }
    return null;
  }

  private async detectRoomConflict(
    roomId: number,
    startTime: Date,
    endTime: number | Date,
    excludeBulkId: number,
  ): Promise<BulkBorrowingConflict | null> {
    const end = endTime instanceof Date ? endTime : new Date(endTime);
    const conflictingReservation = await this.bulkBorrowingRepository.manager.getRepository('Reservation')
      .createQueryBuilder('reservation')
      .where('reservation.roomId = :roomId', { roomId })
      .andWhere('reservation.status IN (:...statuses)', { statuses: [ReservationStatus.APPROVED, ReservationStatus.BORROWED] })
      .andWhere('reservation.startTime < :endTime', { endTime: end })
      .andWhere('reservation.endTime > :startTime', { startTime })
      .getOne();

    if (conflictingReservation) {
      return this.bulkBorrowingConflictRepository.create({
        bulkBorrowingId: excludeBulkId,
        conflictType: ConflictType.ROOM_CONFLICT,
        severity: ConflictSeverity.WARNING,
        description: `该琴房在所选时间段已有其他预约`,
        roomId,
        suggestion: '调整借用时间或更换琴房',
      });
    }
    return null;
  }

  async submitForApproval(id: number): Promise<BulkBorrowing> {
    const bulkBorrowing = await this.findOne(id);

    if (bulkBorrowing.status !== BulkBorrowingStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态可以提交审批');
    }

    await this.detectConflicts(id);

    bulkBorrowing.status = BulkBorrowingStatus.PENDING_APPROVAL;
    return this.bulkBorrowingRepository.save(bulkBorrowing);
  }

  async approve(id: number, approverId: number): Promise<BulkBorrowing> {
    const bulkBorrowing = await this.findOne(id);

    if (bulkBorrowing.status !== BulkBorrowingStatus.PENDING_APPROVAL) {
      throw new BadRequestException('当前状态无法审批');
    }

    const conflicts = await this.bulkBorrowingConflictRepository.find({
      where: { bulkBorrowingId: id, severity: ConflictSeverity.ERROR, resolved: false },
    });

    if (conflicts.length > 0) {
      throw new BadRequestException('存在未解决的严重冲突，无法批准');
    }

    bulkBorrowing.status = BulkBorrowingStatus.APPROVED;
    bulkBorrowing.approverId = approverId;
    bulkBorrowing.approvedAt = new Date();

    return this.bulkBorrowingRepository.save(bulkBorrowing);
  }

  async reject(id: number, approverId: number, reason: string): Promise<BulkBorrowing> {
    const bulkBorrowing = await this.findOne(id);

    if (bulkBorrowing.status !== BulkBorrowingStatus.PENDING_APPROVAL) {
      throw new BadRequestException('当前状态无法拒绝');
    }

    bulkBorrowing.status = BulkBorrowingStatus.REJECTED;
    bulkBorrowing.approverId = approverId;
    bulkBorrowing.approvedAt = new Date();
    bulkBorrowing.rejectReason = reason;

    return this.bulkBorrowingRepository.save(bulkBorrowing);
  }

  async lock(id: number): Promise<BulkBorrowing> {
    const bulkBorrowing = await this.findOne(id);

    if (bulkBorrowing.status !== BulkBorrowingStatus.APPROVED) {
      throw new BadRequestException('只有已批准的申请可以锁定');
    }

    for (const item of bulkBorrowing.items || []) {
      item.locked = true;
      await this.bulkBorrowingItemRepository.save(item);

      if (item.instrumentId) {
        await this.bulkBorrowingRepository.manager.getRepository('Instrument')
          .update(item.instrumentId, { status: InstrumentStatus.IN_PERFORMANCE });
      }
    }

    bulkBorrowing.status = BulkBorrowingStatus.LOCKED;
    return this.bulkBorrowingRepository.save(bulkBorrowing);
  }

  async complete(id: number): Promise<BulkBorrowing> {
    const bulkBorrowing = await this.findOne(id);

    if (bulkBorrowing.status !== BulkBorrowingStatus.LOCKED) {
      throw new BadRequestException('只有已锁定的申请可以完成');
    }

    for (const item of bulkBorrowing.items || []) {
      item.locked = false;
      await this.bulkBorrowingItemRepository.save(item);

      if (item.instrumentId) {
        await this.bulkBorrowingRepository.manager.getRepository('Instrument')
          .update(item.instrumentId, { status: InstrumentStatus.AVAILABLE });
      }
    }

    bulkBorrowing.status = BulkBorrowingStatus.COMPLETED;
    return this.bulkBorrowingRepository.save(bulkBorrowing);
  }

  async cancel(id: number): Promise<BulkBorrowing> {
    const bulkBorrowing = await this.findOne(id);

    if (bulkBorrowing.status === BulkBorrowingStatus.COMPLETED || bulkBorrowing.status === BulkBorrowingStatus.CANCELLED) {
      throw new BadRequestException('当前状态无法取消');
    }

    if (bulkBorrowing.status === BulkBorrowingStatus.LOCKED) {
      for (const item of bulkBorrowing.items || []) {
        item.locked = false;
        await this.bulkBorrowingItemRepository.save(item);

        if (item.instrumentId) {
          await this.bulkBorrowingRepository.manager.getRepository('Instrument')
            .update(item.instrumentId, { status: InstrumentStatus.AVAILABLE });
        }
      }
    }

    bulkBorrowing.status = BulkBorrowingStatus.CANCELLED;
    return this.bulkBorrowingRepository.save(bulkBorrowing);
  }

  async findAll(
    page = 1,
    limit = 10,
    status?: BulkBorrowingStatus,
  ): Promise<{ data: BulkBorrowing[]; total: number; page: number; limit: number }> {
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await this.bulkBorrowingRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['organizer', 'performance', 'approver', 'items', 'items.instrument', 'items.room', 'conflicts'],
      order: { createdAt: 'DESC' },
    });
    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<BulkBorrowing> {
    const bulkBorrowing = await this.bulkBorrowingRepository.findOne({
      where: { id },
      relations: ['organizer', 'performance', 'approver', 'items', 'items.instrument', 'items.room', 'conflicts'],
    });
    if (!bulkBorrowing) {
      throw new NotFoundException(`批量借用申请 #${id} 不存在`);
    }
    return bulkBorrowing;
  }

  async update(id: number, updateDto: UpdateBulkBorrowingDto): Promise<BulkBorrowing> {
    const bulkBorrowing = await this.findOne(id);

    if (bulkBorrowing.status !== BulkBorrowingStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态可以修改');
    }

    Object.assign(bulkBorrowing, {
      ...updateDto,
      startTime: updateDto.startTime ? new Date(updateDto.startTime) : bulkBorrowing.startTime,
      endTime: updateDto.endTime ? new Date(updateDto.endTime) : bulkBorrowing.endTime,
    });

    return this.bulkBorrowingRepository.save(bulkBorrowing);
  }

  async addItems(id: number, items: any[]): Promise<BulkBorrowing> {
    const bulkBorrowing = await this.findOne(id);

    if (bulkBorrowing.status !== BulkBorrowingStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态可以添加物品');
    }

    const itemEntities = items.map(item =>
      this.bulkBorrowingItemRepository.create({
        ...item,
        bulkBorrowingId: id,
      })
    );
    for (const entity of itemEntities) {
      await this.bulkBorrowingItemRepository.save(entity);
    }

    return this.findOne(id);
  }

  async removeItem(id: number, itemId: number): Promise<BulkBorrowing> {
    const bulkBorrowing = await this.findOne(id);

    if (bulkBorrowing.status !== BulkBorrowingStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态可以移除物品');
    }

    await this.bulkBorrowingItemRepository.delete(itemId);
    return this.findOne(id);
  }

  async resolveConflict(conflictId: number): Promise<BulkBorrowingConflict> {
    const conflict = await this.bulkBorrowingConflictRepository.findOne({
      where: { id: conflictId },
    });
    if (!conflict) {
      throw new NotFoundException(`冲突记录 #${conflictId} 不存在`);
    }
    conflict.resolved = true;
    return this.bulkBorrowingConflictRepository.save(conflict);
  }

  async remove(id: number): Promise<void> {
    const bulkBorrowing = await this.findOne(id);

    if (bulkBorrowing.status !== BulkBorrowingStatus.DRAFT && bulkBorrowing.status !== BulkBorrowingStatus.CANCELLED) {
      throw new BadRequestException('只有草稿或已取消的申请可以删除');
    }

    await this.bulkBorrowingConflictRepository.delete({ bulkBorrowingId: id });
    await this.bulkBorrowingItemRepository.delete({ bulkBorrowingId: id });
    const result = await this.bulkBorrowingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`批量借用申请 #${id} 不存在`);
    }
  }
}
