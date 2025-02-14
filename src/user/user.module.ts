import { Module } from '@nestjs/common';
import { UserController } from '@user/user.controller';
import { UserService } from '@user/user.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@user/entitys/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({}),
    RedisModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
