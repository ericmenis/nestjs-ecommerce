import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { CreateUserDto } from '../dto/user.dto';
import { Role } from 'src/database/entities/role.entity';
import { UserRelation } from '../dto/user.types';
import { errorMessages } from 'src/errors/custom';
import { RoleService } from 'src/api/role/services/role.service';
import { RoleIds } from 'src/api/role/enum/role.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  UserRegisteredEvent,
  UserRoleAssignedEvent,
} from 'src/domain/events/user.events';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private eventEmitter: EventEmitter2,
  ) {}

  public async createUser(
    body: CreateUserDto,
    ...roles: Role[]
  ): Promise<User> {
    body.password = await hash(body.password, 10);
    const user: User = this.userRepository.create({
      ...body,
      roles,
    });

    return this.userRepository.save(user);
  }

  public async findByEmail(
    email: string,
    relations?: UserRelation,
  ): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: {
        email,
      },
      relations,
    });
    return user;
  }

  public async comparePassword(password, userPassword): Promise<boolean> {
    return compare(password, userPassword);
  }

  public async findById(id: number, relations?: UserRelation): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: {
        id,
      },
      relations,
    });
    if (!user) {
      throw new NotFoundException(errorMessages.user.notFound);
    }
    return user;
  }

  public async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: { roles: true } });
  }

  public async save(user: User) {
    return this.userRepository.save(user);
  }

  async registerNewCustomer(data: CreateUserDto) {
    const customerRole = await this.roleRepository.findOneBy({
      id: RoleIds.Customer,
    });
    const newUser = await this.createUser(data, customerRole);

    this.eventEmitter.emit(
      'user.registered',
      new UserRegisteredEvent(newUser.id, newUser.email, new Date()),
    );

    return newUser;
  }

  async assignRole(userId: number, role: Role): Promise<User> {
    const user = await this.findById(userId, { roles: true });

    if (user.roles.some((r) => r.id === role.id)) {
      throw new BadRequestException(`User already has role: ${role.name}`);
    }

    user.roles.push(role);
    const updatedUser = await this.userRepository.save(user);

    this.eventEmitter.emit(
      'user.role-assigned',
      new UserRoleAssignedEvent(updatedUser.id, role.id, role.name, new Date()),
    );

    return updatedUser;
  }
}
