import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Instrument } from '../../instruments/entities/instrument.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  roomNo: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  capacity: number;

  @Column({ type: 'text', nullable: true })
  equipment: string;

  @Column({ type: 'text', nullable: true })
  openHours: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Instrument, (instrument) => instrument.room)
  instruments: Instrument[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
