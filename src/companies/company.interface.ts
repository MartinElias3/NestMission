import { User } from 'src/users/users.schema';
export interface ICompany {
  owner: User;
  name: string;
  adress: string;
  isDisable: boolean;
}
