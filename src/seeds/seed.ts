import { DataSource } from 'typeorm';
import { UserEntity } from '../user/entitys/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as process from 'node:process';

@Injectable()
export class Seeder {
  constructor(private configService: ConfigService) {}

  async seed() {
    const dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '7582',
      database: 'auth_db',
      entities: [UserEntity],
      synchronize: false,
    });
    console.log(process.env.DATABASE_PASSWORD);
    await dataSource.initialize();

    const userRepo = dataSource.getRepository(UserEntity);

    const hashPasswordAdmin = await bcrypt.hash('@dm1np@ssw0rD', 10);
    const hashPasswordEmployee = await bcrypt.hash('Empl00y33p@ssw0rD', 10);

    const superAdmin = userRepo.create({
      fullname: 'SuperAdmin User1',
      email: 'superAdmin@gmail.com',
      password: hashPasswordAdmin,
      role: 'SuperAdmin',
    });

    const employee = userRepo.create({
      fullname: 'Employee User',
      email: 'employee@gmail.com',
      password: hashPasswordEmployee,
      role: 'Employee',
    });

    await userRepo.save([superAdmin, employee]);
    await dataSource.destroy();
  }
}

const seeder = new Seeder(new ConfigService());
seeder
  .seed()
  .then(() => {
    console.log('Seeding completed successfully');
  })
  .catch((error) => {
    console.error('Error during seeding', error);
  });
