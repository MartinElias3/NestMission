import { User } from './users.schema';
export interface IUser {
  firstName: string;
  lastName: string;
  role: number;
  age: number;
  email: string;
  password: string;
  isDisable: boolean;
  friends: User[];
}
