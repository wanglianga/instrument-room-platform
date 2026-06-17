import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ConflictType, ConflictSeverity } from '../enums/bulk-borrowing.enum';
import { BulkBorrowing } from './bulk-borrowing.entity';
import { Instrument } from '../../instruments/entities/instrument.entity';
import { Room } from '../../rooms/entities/room.entity';

@Entity('bulk_borrowing_conflicts')
export class BulkBorrowingConflict {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BulkBorrowing, (bulk) => bulk.conflicts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bulkBorrowingId' })
  bulkBorrowing: BulkBorrowing;

  @Column()
  bulkBorrowingId: number;

  @Column({
    type: 'enum',
    enum: ConflictType,
  })
  conflictType: ConflictType;

  @Column({
    type: 'enum',
    enum: ConflictSeverity,
  })
  severity: ConflictSeverity;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Instrument, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument;

  @Column({ nullable: true })
  instrumentId: number;

  @ManyToOne(() => Room, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column({ nullable: true })
  roomId: number;

  @Column({ type: 'text', nullable: true })
  suggestion: string;

  @Column({ default: false })
  resolved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
