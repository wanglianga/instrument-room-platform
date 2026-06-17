import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MainSeeder } from '../../database/seeds/main.seeder';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async onModuleInit() {
    if (process.env.RUN_SEED === 'true') {
      console.log('Running seed data...');
      try {
        const seeder = new MainSeeder();
        await seeder.run(this.dataSource, null as any);
        console.log('Seed data completed!');
      } catch (error) {
        console.error('Error running seed data:', error);
      }
    }
  }
}
