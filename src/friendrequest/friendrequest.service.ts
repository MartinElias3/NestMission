import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FriendRequest, FriendRequestDocument } from './friendrequest.schema';
import { IFriendRequest } from './friendrequest.interface';
import { CreateFriendRequestDto } from './dto/createFriendRequestDto';
import { UpdateFriendRequestDto } from './dto/updateFriendRequest.Dto';
import { User, UserDocument } from 'src/users/users.schema';
import { SenderNotFoundException } from './exceptions/sender.notfound.exception';
import { ReceiverNotFoundException } from './exceptions/receiver.notfound.exception';
import { UserAlreadyFriendException } from './exceptions/user.already.friend.exception';
import { UserNotFriendException } from './exceptions/user.not.friend.exception';
import { HandleFriendRequestDto } from './dto/handleFriendRequestDto';
import { IUser } from 'src/users/user.interface';
import { FriendRequestNotFoundException } from './exceptions/friendRequest.notfound.exception';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FriendAcceptedEvent } from './events/friend-accepted.event';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequestDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<IFriendRequest[]> {
    const friendRequests = await this.friendRequestModel.find().exec();
    if (friendRequests === null) {
      throw new NotFoundException('friend requests not found');
    }
    return friendRequests;
  }

  async findOne(id: string): Promise<IFriendRequest | null> {
    const friendRequest = await this.friendRequestModel.findById(id).exec();
    if (friendRequest === null) {
      throw new NotFoundException('friend request not found');
    }
    return friendRequest;
  }
  async create(
    createFriendRequestDto: CreateFriendRequestDto,
  ): Promise<IFriendRequest> {
    const friendRequest = await this.friendRequestModel.create(
      createFriendRequestDto,
    );
    return friendRequest;
  }
  async update(
    friendRequestId: string,
    updateFriendRequestDto: UpdateFriendRequestDto,
  ): Promise<IFriendRequest | null> {
    const friendRequestUpdated =
      await this.friendRequestModel.findByIdAndUpdate(
        friendRequestId,
        updateFriendRequestDto,
        {
          new: true,
        },
      );
    if (friendRequestUpdated == null) {
      throw new NotFoundException('friend Request not found');
    }
    return friendRequestUpdated;
  }

  async delete(id: string): Promise<any> {
    const friendRequestToDelete = await this.friendRequestModel
      .findById(id)
      .exec();
    if (friendRequestToDelete == null) {
      throw new NotFoundException('friend request not found');
    }
    return await this.friendRequestModel.deleteOne({ _id: id });
  }

  async deleteFriend(idSender: string, idFriendToDelete: string): Promise<any> {
    const userSender = await this.userModel.findById(idSender).exec();
    if (userSender === null) {
      throw new SenderNotFoundException();
    }
    const userToDelete = await this.userModel.findById(idFriendToDelete).exec();
    if (userToDelete === null) {
      throw new ReceiverNotFoundException();
    }
    if (!userSender.friends.includes(userToDelete.id)) {
      throw new UserNotFriendException();
    }
    const userToDeletePosition = userSender.friends.indexOf(userToDelete);

    userSender.friends.splice(userToDeletePosition);
    await userSender.save();

    return userSender;
  }

  async handleFriendRequest(
    friendRequestToHandle: HandleFriendRequestDto,
  ): Promise<any> {
    const friendRequest = await this.friendRequestModel
      .findById(friendRequestToHandle.id)
      .exec();
    if (friendRequest === null) {
      throw new FriendRequestNotFoundException();
    }

    const sender = await this.userModel.findById(friendRequest.sender).exec();
    const receiver = await this.userModel
      .findById(friendRequest.receiver)
      .exec();

    if (sender === null) {
      throw new SenderNotFoundException();
    }
    if (receiver === null) {
      throw new ReceiverNotFoundException();
    }
    if (friendRequestToHandle.hasBeenAccepted) {
      const friendAcceptedEvent = new FriendAcceptedEvent();
      friendAcceptedEvent.receiver = receiver;
      friendAcceptedEvent.sender = sender;

      this.eventEmitter.emit('friend.accepted', friendAcceptedEvent);
    }
    if (!friendRequestToHandle.hasBeenAccepted) {
      this.delete(friendRequestToHandle.id);
    }
    friendRequest.hasBeenSeen = true;
    await friendRequest.save();
  }
}
