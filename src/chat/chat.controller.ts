import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Get,
  ForbiddenException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoom } from './schemas/chatroom.schema';
import { Message } from './schemas/message.schema';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('room')
  async createRoom(@Body('name') name: string): Promise<ChatRoom> {
    return this.chatService.createRoom(name);
  }

  @Post('room/:id/join')
  async joinRoom(
    @Param('id') id: string,
    @Body('userId') userId: string,
  ): Promise<ChatRoom> {
    return this.chatService.joinRoom(id, userId);
  }

  @Post('message')
  async sendMessage(
    @Body('roomId') roomId: string,
    @Body('userId') userId: string,
    @Body('author') author: string,
    @Body('content') content: string,
  ): Promise<Message> {
    return this.chatService.sendMessage(roomId, userId, author, content);
  }

  @Put('message/:id')
  async updateMessage(
    @Param('id') messageId: string,
    @Body('userId') userId: string,
    @Body('content') content: string,
  ): Promise<Message> {
    return this.chatService.updateMessage(messageId, userId, content);
  }

  @Delete('message/:id')
  async deleteMessage(
    @Param('id') messageId: string,
    @Body('userId') userId: string,
  ): Promise<Message> {
    return this.chatService.deleteMessage(messageId, userId);
  }

  @Get('messages/:roomId')
  async getMessages(
    @Param('roomId') roomId: string,
    @Body('userId') userId: string,
  ): Promise<Message[]> {
    return this.chatService.getMessages(roomId, userId);
  }
}

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  handleMessageSent(message: Message) {
    this.server.emit('messageSent', message);
  }

  handleMessageUpdated(message: Message) {
    this.server.emit('messageUpdated', message);
  }

  handleMessageDeleted(message: Message) {
    this.server.emit('messageDeleted', message);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() message: { roomId: string; author: string; content: string },
  ): void {
    this.server.emit('messageSent', message);
  }
}
