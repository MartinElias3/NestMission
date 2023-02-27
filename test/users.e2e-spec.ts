import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { UsersModule } from '../src/users/user.module';
import { UsersService } from '../src/users/user.service';
import { INestApplication } from '@nestjs/common';
import { User, UserSchema } from '../src/users/users.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Connection, Model, connect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Users', () => {
  let app: INestApplication;
  const userService = { findAll: () => ['test'] };
  let userModel: Model<User>;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    userModel = mongoConnection.model(User.name, UserSchema);
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
      ],
    })
      .overrideProvider(UsersService)
      .useValue(userService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET users`, () => {
    return request(app.getHttpServer()).get('/users').expect(200).expect({
      data: userService.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
