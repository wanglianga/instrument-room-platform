import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bcrypt from 'bcryptjs';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/enums/user-role.enum';
import { Room } from '../../rooms/entities/room.entity';
import { Instrument } from '../../instruments/entities/instrument.entity';
import { InstrumentCategory, InstrumentStatus } from '../../instruments/enums/instrument.enum';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const roomRepository = dataSource.getRepository(Room);
    const instrumentRepository = dataSource.getRepository(Instrument);

    console.log('Seeding users...');

    const hashedPassword = await bcrypt.hash('123456', 10);

    const users = [
      {
        username: 'admin',
        password: hashedPassword,
        name: '系统管理员',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        phone: '13800000001',
        department: '艺术学院',
      },
      {
        username: 'student01',
        password: hashedPassword,
        name: '张小明',
        email: 'student01@example.com',
        role: UserRole.STUDENT,
        phone: '13800000002',
        department: '音乐系',
      },
      {
        username: 'student02',
        password: hashedPassword,
        name: '李小红',
        email: 'student02@example.com',
        role: UserRole.STUDENT,
        phone: '13800000003',
        department: '音乐系',
      },
      {
        username: 'teacher01',
        password: hashedPassword,
        name: '王老师',
        email: 'teacher01@example.com',
        role: UserRole.TEACHER,
        phone: '13800000004',
        department: '音乐系',
      },
      {
        username: 'technician01',
        password: hashedPassword,
        name: '陈技师',
        email: 'technician01@example.com',
        role: UserRole.TECHNICIAN,
        phone: '13800000005',
        department: '设备维护中心',
      },
      {
        username: 'manager01',
        password: hashedPassword,
        name: '刘演出',
        email: 'manager01@example.com',
        role: UserRole.MANAGER,
        phone: '13800000006',
        department: '演出中心',
      },
    ];

    for (const userData of users) {
      const existingUser = await userRepository.findOne({ where: { username: userData.username } });
      if (!existingUser) {
        await userRepository.save(userRepository.create(userData));
        console.log(`  Created user: ${userData.username}`);
      }
    }

    console.log('Seeding rooms...');

    const rooms = [
      { roomNo: 'R001', name: '第一琴房', location: '艺术楼201', capacity: 5, equipment: '钢琴1台，音响1套', openHours: '08:00-22:00' },
      { roomNo: 'R002', name: '第二琴房', location: '艺术楼202', capacity: 3, equipment: '钢琴1台', openHours: '08:00-22:00' },
      { roomNo: 'R003', name: '弦乐排练厅', location: '艺术楼301', capacity: 20, equipment: '大提琴4把，小提琴10把，中提琴4把，低音提琴2把', openHours: '08:00-21:00' },
      { roomNo: 'R004', name: '管乐排练厅', location: '艺术楼302', capacity: 30, equipment: '长笛4支，单簧管4支，萨克斯4支，小号4支，长号3支，圆号2支', openHours: '08:00-21:00' },
      { roomNo: 'R005', name: '打击乐教室', location: '艺术楼101', capacity: 15, equipment: '架子鼓2套，定音鼓1组，木琴1台，马林巴1台', openHours: '09:00-20:00' },
    ];

    const savedRooms = [];
    for (const roomData of rooms) {
      const existingRoom = await roomRepository.findOne({ where: { roomNo: roomData.roomNo } });
      if (!existingRoom) {
        const room = await roomRepository.save(roomRepository.create(roomData));
        savedRooms.push(room);
        console.log(`  Created room: ${roomData.roomNo}`);
      } else {
        savedRooms.push(existingRoom);
      }
    }

    console.log('Seeding instruments...');

    const room1 = savedRooms.find(r => r.roomNo === 'R001');
    const room2 = savedRooms.find(r => r.roomNo === 'R002');
    const room3 = savedRooms.find(r => r.roomNo === 'R003');
    const room4 = savedRooms.find(r => r.roomNo === 'R004');
    const room5 = savedRooms.find(r => r.roomNo === 'R005');

    const instruments = [
      { instrumentNo: 'I001', name: '三角钢琴', category: InstrumentCategory.KEYBOARD, brand: 'Yamaha', model: 'C7X', purchaseDate: '2022-01-15', value: 280000, status: InstrumentStatus.AVAILABLE, roomId: room1?.id, depositAmount: 2000, description: '专业演奏级三角钢琴' },
      { instrumentNo: 'I002', name: '立式钢琴', category: InstrumentCategory.KEYBOARD, brand: 'Pearl River', model: 'UP120M', purchaseDate: '2020-09-01', value: 25000, status: InstrumentStatus.AVAILABLE, roomId: room2?.id, depositAmount: 300, description: '教学用立式钢琴' },
      { instrumentNo: 'I003', name: '小提琴', category: InstrumentCategory.STRING, brand: 'Stradivari', model: '1716', purchaseDate: '2019-05-20', value: 85000, status: InstrumentStatus.AVAILABLE, roomId: room3?.id, depositAmount: 1000, description: '高级演奏小提琴' },
      { instrumentNo: 'I004', name: '大提琴', category: InstrumentCategory.STRING, brand: 'Stradivari', model: 'Davidov', purchaseDate: '2019-06-10', value: 120000, status: InstrumentStatus.AVAILABLE, roomId: room3?.id, depositAmount: 1500, description: '专业大提琴' },
      { instrumentNo: 'I005', name: '长笛', category: InstrumentCategory.WIND, brand: 'Yamaha', model: 'YFL-482H', purchaseDate: '2021-03-15', value: 15000, status: InstrumentStatus.AVAILABLE, roomId: room4?.id, depositAmount: 500, description: '银质长笛' },
      { instrumentNo: 'I006', name: '萨克斯', category: InstrumentCategory.WIND, brand: 'Selmer', model: 'Reference 54', purchaseDate: '2020-11-20', value: 35000, status: InstrumentStatus.AVAILABLE, roomId: room4?.id, depositAmount: 800, description: '次中音萨克斯' },
      { instrumentNo: 'I007', name: '架子鼓', category: InstrumentCategory.PERCUSSION, brand: 'Pearl', model: 'Masterworks', purchaseDate: '2022-04-01', value: 45000, status: InstrumentStatus.AVAILABLE, roomId: room5?.id, depositAmount: 1000, description: '专业级架子鼓' },
      { instrumentNo: 'I008', name: '中提琴', category: InstrumentCategory.STRING, brand: 'Stradivari', model: '1672', purchaseDate: '2019-07-08', value: 65000, status: InstrumentStatus.IN_REPAIR, roomId: room3?.id, depositAmount: 800, description: '维修中' },
      { instrumentNo: 'I009', name: '小号', category: InstrumentCategory.WIND, brand: 'Bach', model: 'Stradivarius 180', purchaseDate: '2021-08-15', value: 18000, status: InstrumentStatus.AVAILABLE, roomId: room4?.id, depositAmount: 600, description: '专业小号' },
      { instrumentNo: 'I010', name: '电钢琴', category: InstrumentCategory.KEYBOARD, brand: 'Roland', model: 'RD-2000', purchaseDate: '2023-01-10', value: 22000, status: InstrumentStatus.AVAILABLE, roomId: room1?.id, depositAmount: 500, description: '舞台电钢琴' },
    ];

    for (const instrumentData of instruments) {
      const existingInstrument = await instrumentRepository.findOne({ where: { instrumentNo: instrumentData.instrumentNo } });
      if (!existingInstrument) {
        await instrumentRepository.save(instrumentRepository.create(instrumentData as any));
        console.log(`  Created instrument: ${instrumentData.instrumentNo}`);
      }
    }

    console.log('Seeding completed!');
  }
}
