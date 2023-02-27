import { IsNotEmpty } from 'class-validator';
import { User } from '../users.schema';

export class UpdateUserDto {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  age: number;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  role: number;
  @IsNotEmpty()
  isDisable: boolean;
  @IsNotEmpty()
  friends: [User];
}
