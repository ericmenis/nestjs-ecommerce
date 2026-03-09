import { Expose, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RoleDto } from 'src/api/user/dto/user.dto';

export class AssignRoleDto {
  @IsNumber()
  @IsNotEmpty()
  public userId: number;

  @IsNumber()
  @IsNotEmpty()
  public roleId: number;
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class UserDto {
  @Expose()
  public id: number;

  @Expose()
  public email: string;

  @Expose()
  @Type(() => RoleDto)
  public roles: RoleDto[];
}
