import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Activity } from 'src/activities/activity.schema';
import { Company } from 'src/companies/company.schema';
import { User } from 'src/users/users.schema';
export type BookingDocument = HydratedDocument<Booking>;
@Schema()
export class Booking {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  user: User;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }] })
  activity: Activity;
  @Prop()
  startedAt: string;
  @Prop()
  finishedAt: string;
  @Prop()
  status: string;
}
export const BookingSchema = SchemaFactory.createForClass(Booking);
