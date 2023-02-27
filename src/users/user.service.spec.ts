import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';
import { IUser } from './user.interface';
const mockUser2: IUser = {
  firstName: 'Martin',
  lastName: 'Doe',
  role: 1,
  age: 30,
  email: 'john.doe@example.com',
  password: 'password123',
  isDisable: false,
  friends: [],
};

const mockUser: IUser = {
  firstName: 'John',
  lastName: 'Doe',
  role: 1,
  age: 30,
  email: 'john.doe@example.com',
  password: 'password123',
  isDisable: false,
  friends: [mockUser2],
};

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const usersArray = [
    {
      firstName: 'John',
      lastName: 'Doe',
      role: 1,
      age: 30,
      email: 'john.doe@example.com',
      password: 'password123',
      isDisable: false,
      friends: [],
    },
    {
      firstName: 'Martin',
      lastName: 'Elias',
      role: 1,
      age: 30,
      email: 'john.doe@example.com',
      password: 'password123',
      isDisable: false,
      friends: [],
    },
  ];

  const usersWithId = {
    firstName: 'John',
    lastName: 'Doe',
    role: 1,
    age: 30,
    email: 'john.doe@example.com',
    password: 'password123',
    isDisable: false,
    friends: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(usersArray),
    } as any);
    const users = await service.findAll();
    expect(users).toEqual(usersArray);
  });

  it('should return one user', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(userWithId),
    } as any);
    const users = await service.findAll();
    expect(users).toEqual(usersArray);
  });

  it('should insert a new user', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        firstName: 'John',
        lastName: 'Doe',
        role: 1,
        age: 30,
        email: 'john.doe@example.com',
        password: 'password123',
        isDisable: false,
        friends: [mockUser2],
      }),
    );
    const newUser = await service.create({
      firstName: 'John',
      lastName: 'Doe',
      role: 1,
      age: 30,
      email: 'john.doe@example.com',
      password: 'password123',
      isDisable: false,
      friends: [mockUser2],
    });
    expect(newUser).toEqual(mockUser);
  });
});
