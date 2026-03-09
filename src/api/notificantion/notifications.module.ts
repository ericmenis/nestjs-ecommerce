/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NotificationsConsumer } from './notifications.consumer';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [UserModule, RoleModule],
  providers: [NotificationsConsumer],
})
export class NotificationsModule {}
