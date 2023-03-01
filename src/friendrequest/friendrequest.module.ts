import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestSchema } from './friendrequest.schema';
import { FriendRequestController } from './friendrequest.controller';
import { FriendRequestService } from './friendrequest.service';
import { User, UserSchema } from 'src/users/users.schema';
import { FriendAcceptedListener } from './listeners/friend-accepted.listener';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FriendRequest.name, schema: FriendRequestSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService, FriendAcceptedListener],
})
export class FriendRequestModule {}
