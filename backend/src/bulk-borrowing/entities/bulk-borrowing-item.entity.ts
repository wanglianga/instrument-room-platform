import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Instrument } from '../../instruments/entities/instrument.entity';
import { Room } from '../../rooms/entities/room.entity';
import { BulkBorrowing } from './bulk-borrowing.entity';

@Entity('bulk_borrowing_items')
export class BulkBorrowingItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BulkBorrowing, (bulk) => bulk.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bulkBorrowingId' })
  bulkBorrowing: BulkBorrowing;

  @Column()
  bulkBorrowingId: number;

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

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ default: false })
  locked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
