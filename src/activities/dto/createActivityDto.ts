import { IsNotEmpty } from 'class-validator';
import { Company } from 'src/companies/company.schema';

export class CreateActivityDto {
  @IsNotEmpty()
  company: Company;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  adress: string;
  @IsNotEmpty()
  isDisable: boolean;
}
