import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFriendException extends HttpException {
  constructor() {
    super('user is not in the friends list', HttpStatus.NOT_FOUND);
  }
}
