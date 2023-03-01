import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FriendAcceptedEvent } from '../events/friend-accepted.event';
import { UserAlreadyFriendException } from '../exceptions/user.already.friend.exception';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/users.schema';
import { Model } from 'mongoose';
import { SenderNotFoundException } from '../exceptions/sender.notfound.exception';
import { ReceiverNotFoundException } from '../exceptions/receiver.notfound.exception';

@Injectable()
export class FriendAcceptedListener {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  @OnEvent('friend.accepted')
  async handleFriendAcceptedEvent(event: FriendAcceptedEvent) {
    const sender = await this.userModel.findById(event.sender).exec();
    const receiver = await this.userModel.findById(event.receiver).exec();

    if (sender === null) {
      throw new SenderNotFoundException();
    }
    if (receiver === null) {
      throw new ReceiverNotFoundException();
    }

    if (sender.friends.includes(receiver.id)) {
      throw new UserAlreadyFriendException();
    }
    sender.friends.push(receiver);
    receiver.friends.push(sender);

    await sender.save();
    await receiver.save();
  }
}
