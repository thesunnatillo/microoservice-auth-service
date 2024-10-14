import { DataSource } from 'typeorm';
import { UserEntity } from '@user/entitys/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const dataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get('DATABASE_USER'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [UserEntity],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();

  const userRepo = dataSource.getRepository(UserEntity);

  const hashPasswordAdmin = await bcrypt.hash(
    configService.get<string>('SA_PWRD'),
    10,
  );
  const hashPasswordEmployee = await bcrypt.hash(
    configService.get<string>('E_PWRD'),
    10,
  );

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

seed()
  .then(() => {
    console.log('Seeding completed successfully');
  })
  .catch((error) => {
    console.error('Error during seeding', error);
  });
