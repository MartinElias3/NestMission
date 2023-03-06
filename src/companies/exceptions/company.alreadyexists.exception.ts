import { HttpException, HttpStatus } from '@nestjs/common';

export class CompanyAlreadyExistsException extends HttpException {
  constructor() {
    super('company already exists', HttpStatus.BAD_REQUEST);
  }
}
