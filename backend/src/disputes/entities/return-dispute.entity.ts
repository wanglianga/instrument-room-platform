import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DisputeType, DisputeStatus, PerformanceImpact } from '../enums/dispute.enum';
import { User } from '../../users/entities/user.entity';
import { Instrument } from '../../instruments/entities/instrument.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { ReturnCheck } from '../../return-checks/entities/return-check.entity';

@Entity('return_disputes')
export class ReturnDispute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: DisputeType,
  })
  disputeType: DisputeType;

  @Column({
    type: 'enum',
    enum: DisputeStatus,
    default: DisputeStatus.PENDING,
  })
  status: DisputeStatus;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  photos: string;

  @ManyToOne(() => ReturnCheck, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'returnCheckId' })
  returnCheck: ReturnCheck;

  @Column({ nullable: true })
  returnCheckId: number;

  @ManyToOne(() => Instrument, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument;

  @Column()
  instrumentId: number;

  @ManyToOne(() => Reservation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @Column()
  reservationId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'registeredById' })
  registeredBy: User;

  @Column()
  registeredById: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  @Column({ nullable: true })
  teacherId: number;

  @Column({
    type: 'enum',
    enum: PerformanceImpact,
    nullable: true,
  })
  performanceImpact: PerformanceImpact;

  @Column({ type: 'text', nullable: true })
  teacherComment: string;

  @Column({ type: 'timestamp', nullable: true })
  teacherReviewedAt: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'technicianId' })
  technician: User;

  @Column({ nullable: true })
  technicianId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  repairQuote: number;

  @Column({ type: 'text', nullable: true })
  technicianComment: string;

  @Column({ type: 'timestamp', nullable: true })
  technicianQuotedAt: Date;

  @Column({ type: 'text', nullable: true })
  checkoutPhotos: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  deductedAmount: number;

  @Column({ type: 'text', nullable: true })
  resolutionNote: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
