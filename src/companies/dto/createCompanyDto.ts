import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/users.schema';

export class CreateCompanyDto {
  @IsNotEmpty()
  owner: User;
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  adress: string;
  @IsNotEmpty()
  isDisable: boolean;
}
