import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { ChatController } from './chat/chat.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      errorMessage(context, throttlerLimitDetail) {
        return `You have reached the limit of ${throttlerLimitDetail.limit} requests per ${throttlerLimitDetail.ttl} seconds`;
      },
      throttlers: [
        {
          limit: 10,
          ttl: 60,
        },
      ],
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI, {
      dbName: process.env.DATABASE_NAME,
      auth: {
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASS,
      },
    }),
    ChatModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [ChatController],
})
export class AppModule {}
