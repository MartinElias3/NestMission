import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyFriendException extends HttpException {
  constructor() {
    super('user is already a friend', HttpStatus.NOT_FOUND);
  }
}
