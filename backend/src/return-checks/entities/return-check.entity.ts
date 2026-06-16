import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ReturnCheckResult } from '../enums/return-check.enum';
import { User } from '../../users/entities/user.entity';
import { Instrument } from '../../instruments/entities/instrument.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('return_checks')
export class ReturnCheck {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ReturnCheckResult,
  })
  result: ReturnCheckResult;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  damageDetails: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedRepairCost: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'checkerId' })
  checker: User;

  @Column()
  checkerId: number;

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

  @Column({ default: false })
  hasDamage: boolean;

  @Column({ type: 'text', nullable: true })
  photos: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
