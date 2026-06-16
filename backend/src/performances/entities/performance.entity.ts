import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { PerformanceStatus } from '../enums/performance.enum';
import { User } from '../../users/entities/user.entity';
import { Instrument } from '../../instruments/entities/instrument.entity';

@Entity('performances')
export class Performance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  location: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: PerformanceStatus,
    default: PerformanceStatus.PLANNED,
  })
  status: PerformanceStatus;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @Column({ nullable: true })
  managerId: number;

  @ManyToMany(() => Instrument)
  @JoinTable({
    name: 'performance_instruments',
    joinColumn: { name: 'performanceId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'instrumentId', referencedColumnName: 'id' },
  })
  instruments: Instrument[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp', nullable: true })
  setupStartTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  tearDownEndTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
