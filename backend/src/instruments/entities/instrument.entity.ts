import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { InstrumentCategory, InstrumentStatus } from '../enums/instrument.enum';
import { Room } from '../../rooms/entities/room.entity';

@Entity('instruments')
export class Instrument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  instrumentNo: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: InstrumentCategory,
  })
  category: InstrumentCategory;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column({ type: 'date' })
  purchaseDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({
    type: 'enum',
    enum: InstrumentStatus,
    default: InstrumentStatus.AVAILABLE,
  })
  status: InstrumentStatus;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @ManyToOne(() => Room, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column({ nullable: true })
  roomId: number;

  @Column({ default: 0 })
  depositAmount: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
