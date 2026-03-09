import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../database/entities/role.entity';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { UserModule } from '../user/user.module';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), UserModule],
  controllers: [RoleController],
  providers: [RoleService, AuthGuard, RolesGuard, Reflector],
  exports: [RoleService],
})
export class RoleModule {}
