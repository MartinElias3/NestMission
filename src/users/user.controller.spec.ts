import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { getMaxListeners } from 'process';
import { IUser } from './user.interface';
import { plainToInstance } from 'class-transformer';
import { UsersModule } from './user.module';
import { IdDto } from './dto/IdDto';
import { User, UserSchema } from './users.schema';

const moduleMocker = new ModuleMocker(global);

describe('UsersController', () => {
  let userController: UsersController;
  let userService: UsersService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();
    userController = moduleRef.get<UsersController>(UsersController);
  });

  it('should return an entity of client if successful', async () => {
    const user: IUser = {
      firstName: 'John',
      lastName: 'Doe',
      role: 1,
      age: 30,
      email: 'john.doe@example.com',
      password: 'password123',
      isDisable: false,
      friends: [],
    };
    const mockNumberToSatisfyParameters = new IdDto();
    jest.spyOn(mockUserService, 'findOne').mockResolvedValue(user);
    expect(await userController.find(mockNumberToSatisfyParameters)).toBe(user);
  });
});
