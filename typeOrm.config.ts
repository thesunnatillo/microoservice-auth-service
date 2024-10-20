import { DataSource } from "typeorm";
import { UserEntity } from './src/user/entitys/user.entity';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '7582',
  database: 'auth_db',
  migrations: ['migrations/**'],
  entities: [UserEntity],
})
