import { Company } from 'src/companies/company.schema';

export interface IActivity {
  company: Company;
  name: string;
  description: string;
  adress: string;
  isDisable: boolean;
}
