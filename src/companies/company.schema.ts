import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/users.schema';

export type CompanyDocument = HydratedDocument<Company>;
@Schema()
export class Company {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  owner: User;
  @Prop()
  name: string;
  @Prop()
  adress: string;
  @Prop()
  isDisable: boolean;
}
export const CompanySchema = SchemaFactory.createForClass(Company);
