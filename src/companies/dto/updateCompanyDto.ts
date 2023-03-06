import { IsNotEmpty } from 'class-validator';

export class UpdateCompanyDto {
  @IsNotEmpty()
  lastName: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  adress: string;
  @IsNotEmpty()
  isDisable: boolean;
}
