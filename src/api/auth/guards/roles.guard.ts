import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { errorMessages } from 'src/errors/custom';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<number[]>('roleIds', context.getHandler());
    const request = context.switchToHttp().getRequest();
    if (!roles || roles.length === 0) return true;
    if (!request.user.roles.some((userRole) => roles.includes(userRole.id)))
      throw new UnauthorizedException(errorMessages.auth.notAllowed);
    return true;
  }
}
