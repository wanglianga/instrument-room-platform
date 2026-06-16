import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DamageStatus, DamageSeverity } from '../enums/damage.enum';
import { User } from '../../users/entities/user.entity';
import { Instrument } from '../../instruments/entities/instrument.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { ReturnCheck } from '../../return-checks/entities/return-check.entity';

@Entity('damage_records')
export class DamageRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: DamageSeverity,
  })
  severity: DamageSeverity;

  @Column({
    type: 'enum',
    enum: DamageStatus,
    default: DamageStatus.REPORTED,
  })
  status: DamageStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  compensationAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  repairCost: number;

  @Column({ type: 'text', nullable: true })
  assessNotes: string;

  @Column({ type: 'text', nullable: true })
  photos: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'reportedById' })
  reportedBy: User;

  @Column({ nullable: true })
  reportedById: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'responsibleUserId' })
  responsibleUser: User;

  @Column({ nullable: true })
  responsibleUserId: number;

  @ManyToOne(() => Instrument, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument;

  @Column()
  instrumentId: number;

  @ManyToOne(() => Reservation, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @Column({ nullable: true })
  reservationId: number;

  @ManyToOne(() => ReturnCheck, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'returnCheckId' })
  returnCheck: ReturnCheck;

  @Column({ nullable: true })
  returnCheckId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'handledById' })
  handledBy: User;

  @Column({ nullable: true })
  handledById: number;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'text', nullable: true })
  resolutionNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
