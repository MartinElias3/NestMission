import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  NotFoundException,
  HttpException,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { response } from 'express';
import { FriendRequestService } from './friendrequest.service';
import { IdDto } from './dto/IdDto';
import { CreateFriendRequestDto } from './dto/createFriendRequestDto';
import { addfriendDto } from './dto/addFriendDto';
import { SenderNotFoundException } from './exceptions/sender.notfound.exception';
import { ReceiverNotFoundException } from './exceptions/receiver.notfound.exception';
import { UserAlreadyFriendException } from './exceptions/user.already.friend.exception';
import { UserNotFriendException } from './exceptions/user.not.friend.exception';
import { HandleFriendRequestDto } from './dto/handleFriendRequestDto';
import { FriendRequestNotFoundException } from './exceptions/friendRequest.notfound.exception';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}
  @Get()
  async findAll() {
    try {
      const friendsRequests = await this.friendRequestService.findAll();
      return friendsRequests;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'FREINDS_REQUESTS_NOT_FOUND',
            error: 'Friends requests not found',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      }
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: 'BAD_REQUEST',
        message: 'We could not retrieve the friends requests',
      });
    }
  }
  @Get(':id')
  async find(@Param(new ValidationPipe({ whitelist: true })) { id }: IdDto) {
    try {
      const friendRequest = await this.friendRequestService.findOne(id);
      return friendRequest;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'FRIEND_REQUEST_NOT_FOUND',
            error: 'Friend Request not found',
            message: 'We could not found the friend request with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      }
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: 'BAD_REQUEST',
        message: 'We could not retrieve the friend request',
      });
    }
  }

  @Post()
  async create(
    @Res() response: any,
    @Body() createFriendRequestDto: CreateFriendRequestDto,
  ) {
    try {
      const friendRequest = await this.friendRequestService.create(
        createFriendRequestDto,
      );
      return response.status(HttpStatus.CREATED).json({
        message: 'Friend Request has been successfully created',
        friendRequest,
      });
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: 'We could not create the friend request',
      });
    }
  }
  @Put()
  async handleFriendRequest(
    @Res() response: any,
    @Body() handleFriendRequestDto: HandleFriendRequestDto,
  ) {
    try {
      const friendRequestToHandle =
        await this.friendRequestService.handleFriendRequest(
          handleFriendRequestDto,
        );
      return response.status(HttpStatus.OK).json({
        message: 'Friend Request has been successfully handled',
        friendRequestToHandle,
      });
    } catch (error) {
      if (error instanceof SenderNotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'USER_SENDER_NOT_FOUND',
            error: 'User sender not found',
            message: 'We could not found the user sender with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      } else if (error instanceof FriendRequestNotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'FRIEND_REQUEST_NOT_FOUND',
            error: 'Friend Request not found',
            message: 'We could not found the friend request with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      } else if (error instanceof ReceiverNotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            code: 'USER_RECEIVER_NOT_FOUND',
            error: 'User receiver not found',
            message: 'We could not found the user receiver with id ${id}',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      } else if (error instanceof UserAlreadyFriendException) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            code: 'USER_ALREADY_FRIEND',
            error: 'User receiver is already a friend',
            message: 'User receiver is already a friend',
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          },
        );
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: 'We could not add the user',
        });
      }
    }
  }
}
