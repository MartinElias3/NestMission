import { HttpException, HttpStatus } from '@nestjs/common';

export class SenderNotFoundException extends HttpException {
  constructor() {
    super('Sender not found', HttpStatus.NOT_FOUND);
  }
}
