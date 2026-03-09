import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/database/entities/role.entity';
import { AssignRoleDto } from '../dto/role.dto';
import { errorMessages } from 'src/errors/custom';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoleAssignRequestedEvent } from 'src/domain/events/role.events';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findById(roleId: number) {
    const role = await this.rolesRepository.findOne({
      where: {
        id: roleId,
      },
    });
    if (!role) {
      throw new NotFoundException(errorMessages.role.notFound);
    }
    return role;
  }

  async validateRole(roleId: number): Promise<void> {
    const exists = await this.rolesRepository.exist({
      where: { id: roleId },
    });

    if (!exists) {
      throw new BadRequestException(`Invalid role ID: ${roleId}`);
    }
  }

  async assignRole(data: AssignRoleDto): Promise<{ message: string }> {
    await this.validateRole(data.roleId);

    this.eventEmitter.emit(
      'role.assign.requested',
      new RoleAssignRequestedEvent(data.userId, data.roleId),
    );

    return { message: 'Role assignment in progress' };
  }
}
