import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  age: number;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  role: number;
  @Prop()
  isDisable: boolean;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  friends: User[];
}
export const UserSchema = SchemaFactory.createForClass(User);
