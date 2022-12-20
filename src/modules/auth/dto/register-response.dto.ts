import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UsersRole } from '../../../shares/enums/users-role.enum';

@Exclude()
export class RegisterResponseDto {
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

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Verify token to verify account',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhvYW5',
  })
  verifyToken: string;
}
