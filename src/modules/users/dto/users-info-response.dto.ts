import { PublicUserInfoResponseDto } from './public-user-info.response.dto';
import { Exclude } from 'class-transformer';

@Exclude()
export class UsersInfoResponseDto extends PublicUserInfoResponseDto {}
