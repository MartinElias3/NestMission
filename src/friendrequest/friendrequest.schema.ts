import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from 'src/users/users.schema';

export type FriendRequestDocument = HydratedDocument<FriendRequest>;
@Schema()
export class FriendRequest {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  sender: User;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  receiver: User;
  @Prop()
  hasBeenSeen: boolean;
  @Prop()
  hasBeenAccepted: boolean;
}
export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
