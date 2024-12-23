import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController, MessageGateway } from './chat.controller';
import { ChatRoom, ChatRoomSchema } from './schemas/chatroom.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { ObjectIdMiddleware } from './middlewares/object-id.middleware';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    EventEmitterModule.forRoot(),
  ],
  providers: [ChatService, MessageGateway],
  controllers: [ChatController],
})
export class ChatModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ObjectIdMiddleware)
      .forRoutes(
        { path: 'chat/message', method: RequestMethod.POST },
        { path: 'chat/message/:id', method: RequestMethod.PUT },
        { path: 'chat/message/:id', method: RequestMethod.DELETE },
        { path: 'chat/room/:id/join', method: RequestMethod.POST },
        { path: 'chat/messages/:roomId', method: RequestMethod.GET },
      );
  }
}
