import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GetMeDto,
  LogOutDto,
  SignInDto,
  SignUpDto,
} from 'globals/protos/auth';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('AuthService', 'SignUp')
  signup(signUpDto: SignUpDto) {
    return this.userService.signup(signUpDto);
  }

  @GrpcMethod('AuthService', 'SignIn')
  signin(signInDto: SignInDto) {
    return this.userService.signin(signInDto);
  }

  @GrpcMethod('AuthService', 'LogOut')
  logout(logOutDto: LogOutDto) {
    return this.userService.logout(logOutDto);
  }

  @GrpcMethod('AuthService', 'GetMe')
  getme(getMeDto: GetMeDto) {
    return this.userService.getme(getMeDto);
  }
}
