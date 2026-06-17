import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BulkBorrowingStatus } from '../enums/bulk-borrowing.enum';
import { User } from '../../users/entities/user.entity';
import { Performance } from '../../performances/entities/performance.entity';
import { BulkBorrowingItem } from './bulk-borrowing-item.entity';
import { BulkBorrowingConflict } from './bulk-borrowing-conflict.entity';

@Entity('bulk_borrowings')
export class BulkBorrowing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  programList: string;

  @Column({ type: 'text', nullable: true })
  rehearsalSchedule: string;

  @Column({ type: 'text', nullable: true })
  borrowingList: string;

  @Column({
    type: 'enum',
    enum: BulkBorrowingStatus,
    default: BulkBorrowingStatus.DRAFT,
  })
  status: BulkBorrowingStatus;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column()
  organizerId: number;

  @ManyToOne(() => Performance, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'performanceId' })
  performance: Performance;

  @Column({ nullable: true })
  performanceId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approverId' })
  approver: User;

  @Column({ nullable: true })
  approverId: number;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectReason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => BulkBorrowingItem, (item) => item.bulkBorrowing, { cascade: true })
  items: BulkBorrowingItem[];

  @OneToMany(() => BulkBorrowingConflict, (conflict) => conflict.bulkBorrowing, { cascade: true })
  conflicts: BulkBorrowingConflict[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
