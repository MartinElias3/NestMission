import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Company } from 'src/companies/company.schema';

export type ActivityDocument = HydratedDocument<Activity>;
@Schema()
export class Activity {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }] })
  company: Company;
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  adress: string;
  @Prop()
  isDisable: boolean;
}
export const ActivitySchema = SchemaFactory.createForClass(Activity);
