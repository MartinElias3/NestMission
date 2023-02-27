import { HttpException, HttpStatus } from '@nestjs/common';

export class ReceiverNotFoundException extends HttpException {
  constructor() {
    super('Receiver not found', HttpStatus.NOT_FOUND);
  }
}
