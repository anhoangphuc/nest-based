import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UsersRole } from '../../../shares/enums/users-role.enum';

@Exclude()
export class PublicUserInfoResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'Email of user',
    example: 'john@email.com',
  })
  email: string;

  @Expose()
  @IsEnum(UsersRole)
  @ApiProperty({
    enum: UsersRole,
    description: 'Role of user',
    example: UsersRole.USER_INACTIVATED,
  })
  role: UsersRole;
}
