import { Module, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { APP_PIPE } from '@nestjs/core';
import { FriendRequestModule } from './friendrequest/friendrequest.module';
@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://martin:martinmartin@cluster0.9ef1j8k.mongodb.net/?retryWrites=true&w=majority',
    ),
    UsersModule,
    FriendRequestModule,
  ],
})
export class AppModule {}
