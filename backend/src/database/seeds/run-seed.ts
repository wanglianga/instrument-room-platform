import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import * as dotenv from 'dotenv';
import { MainSeeder } from './main.seeder';

dotenv.config();

async function main() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'instrument_room',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('Data Source has been initialized!');

    await runSeeders(dataSource, {
      seeds: [MainSeeder],
    });

    console.log('Seeding completed successfully!');
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

main();
