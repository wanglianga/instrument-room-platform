import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationsModule } from './reservations/reservations.module';
import { DepositsModule } from './deposits/deposits.module';
import { ReturnChecksModule } from './return-checks/return-checks.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { DamagesModule } from './damages/damages.module';
import { PerformancesModule } from './performances/performances.module';
import { DisputesModule } from './disputes/disputes.module';
import { BulkBorrowingModule } from './bulk-borrowing/bulk-borrowing.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'instrument_room',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsersModule,
    InstrumentsModule,
    RoomsModule,
    ReservationsModule,
    DepositsModule,
    ReturnChecksModule,
    MaintenanceModule,
    DamagesModule,
    PerformancesModule,
    DisputesModule,
    BulkBorrowingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
