import { Module, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/user.module';
import { UsersController } from './users/user.controller';
import { UsersService } from './users/user.service';
import { APP_PIPE } from '@nestjs/core';
@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://martin:martinmartin@cluster0.9ef1j8k.mongodb.net/?retryWrites=true&w=majority',
    ),
    UsersModule,
  ],
})
export class AppModule {}
