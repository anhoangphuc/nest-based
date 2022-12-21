import { UsersRole } from '../enums/users-role.enum';

export interface IUsersSearch {
  email?: string[];
  role?: UsersRole[];
}
