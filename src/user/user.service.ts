import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetMeDto,
  LogOutDto,
  SignInDto,
  SignUpDto,
} from '../globals/protos/auth';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../globals/types/jwtpayload.type';
import { Tokens } from '../globals/types/tokens.type';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: signUpDto.email },
      });
      if (user) {
        return { message: 'Bunday user mavjud!' };
      }

      const hash = await this.password_hash(signUpDto.password);
      const newUser = {
        ...signUpDto,
        password: hash,
      };
      const savedUser = await this.userRepo.save(newUser);
      const tokens = await this.getTokens(savedUser.id, savedUser.email);
      await this.redisService.set(`at_${savedUser.id}`, tokens.access_token);
      await this.redisService.set(`rt_${savedUser.id}`, tokens.refresh_token);
      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      };
    } catch (err) {
      return { message: err };
    }
  }

  async signin(signInDto: SignInDto) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: signInDto.email },
      });
      if (!user) {
        return { message: 'Email not found' };
      }

      const passwordMatch = await bcrypt.compare(
        signInDto.password,
        user.password,
      );

      if (!passwordMatch) {
        return { message: 'Password mistake' };
      }

      const tokens = await this.getTokens(user.id, user.email);
      await this.redisService.set(`at_${user.id}`, tokens.access_token);
      await this.redisService.set(`rt_${user.id}`, tokens.refresh_token);
      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      };
    } catch (err) {
      return { message: err };
    }
  }

  async logout(logOutDto: LogOutDto) {
    try {
      const payload = await this.jwtService.verify(logOutDto.token, {
        secret: process.env.AT_SECRET,
      });
      await this.redisService.del(`at_${payload.sub}`);
      await this.redisService.del(`rt_${payload.sub}`);
      return { message: 'LogOut' };
    } catch (err) {
      return { message: err };
    }
  }

  async getme(getMeDto: GetMeDto) {
    try {
      const payload = await this.jwtService.verify(getMeDto.token, {
        secret: process.env.AT_SECRET,
      });
      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      return {
        fullname: user.fullname,
        email: user.email,
        password: user.password,
        role: user.role,
      };
    } catch (err) {
      return { fullname: err };
    }
  }

  async password_hash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('AT_SECRET'),
        expiresIn: '60m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
