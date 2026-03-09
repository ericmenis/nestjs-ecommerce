import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/api/user/dto/user.dto';
import { UserService } from 'src/api/user/services/user.service';
import { errorMessages } from 'src/errors/custom';
import { PayloadDto } from '../dto/auth.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserLoggedInEvent } from 'src/domain/events/user.events';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async login(user: CreateUserDto) {
    const { email, password } = user;
    const alreadyExistingUser = await this.userService.findByEmail(email);
    if (!alreadyExistingUser)
      throw new UnauthorizedException(errorMessages.auth.wronCredentials);

    const isValidPassword = await this.userService.comparePassword(
      password,
      alreadyExistingUser.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException(errorMessages.auth.wronCredentials);

    this.eventEmitter.emit(
      'auth.login',
      new UserLoggedInEvent(alreadyExistingUser.id, email, new Date()),
    );
    return this.generateToken({
      id: alreadyExistingUser.id,
      email,
    });
  }

  async register(user: CreateUserDto) {
    const alreadyExistingUser = await this.userService.findByEmail(user.email);
    if (alreadyExistingUser)
      throw new ConflictException(errorMessages.auth.userAlreadyExist);
    return this.userService.registerNewCustomer(user);
  }

  async generateToken(payload: PayloadDto) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwt.secret'),
    });

    return { accessToken };
  }
}
