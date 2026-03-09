/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  UserLoggedInEvent,
  UserRegisteredEvent,
  UserRoleAssignedEvent,
} from 'src/domain/events/user.events';
import { RoleAssignRequestedEvent } from 'src/domain/events/role.events';
import { UserService } from '../user/services/user.service';
import { RoleService } from '../role/services/role.service';

@Injectable()
export class NotificationsConsumer {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @OnEvent('role.assign.requested')
  async handleRoleAssignRequested(event: RoleAssignRequestedEvent) {
    const role = await this.roleService.findById(event.roleId);
    await this.userService.assignRole(event.userId, role);
    console.log(
      `[EVENTO]: Rol ${role.name} asignado al usuario ${event.userId}`,
    );
  }

  @OnEvent('user.registered')
  handleUserRegistered(event: UserRegisteredEvent) {
    console.log(`\n[EVENTO]: Bienvenida para ${event.email}`);
    console.log(`> "¡Hola! Tu cuenta ha sido creada con éxito."\n`);
  }

  @OnEvent('auth.login')
  handleUserLogin(event: UserLoggedInEvent) {
    console.log(`\n[EVENTO]: Inicio de sesión.`);
    console.log(`> "Hola de nuevo, ${event.email}."\n`);
  }

  @OnEvent('product.activated')
  handleProductActivated(payload: { id: number; name: string }) {
    console.log(`\n[EVENTO]: Catálogo actualizado.`);
    console.log(
      `> "El producto '${payload.name}' (ID: ${payload.id}) ahora es visible para los clientes."\n`,
    );
  }

  @OnEvent('user.role-assigned')
  handleUserRoleAssignedEvent(event: UserRoleAssignedEvent) {
    console.log(`[EVENTO]: Procesando cambio de permisos`);
    console.log(`ID Usuario: ${event.userId}`);
    console.log(`Nuevo Rol: ${event.name} (ID: ${event.roleId})`);
    console.log(`Fecha de asignación: ${event.assignedAt.toLocaleString()}`);
  }
}
