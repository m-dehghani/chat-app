import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoom } from './schemas/chatroom.schema';
import { Message } from './schemas/message.schema';
import { EventEmitter2 } from 'eventemitter2';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createRoom(name: string): Promise<ChatRoom> {
    const newRoom = new this.chatRoomModel({ name });
    return newRoom.save();
  }

  async joinRoom(roomId: string, userId: Types.ObjectId): Promise<ChatRoom> {
    const room = await this.chatRoomModel.findById(roomId).exec();
    if (!room) {
      throw new BadRequestException('Chat room not found');
    }

    if (!room.users.includes(userId)) {
      room.users.push(userId);
      await room.save();
    }

    return room;
  }

  async sendMessage(
    roomId: string,
    userId: Types.ObjectId,
    author: string,
    content: string,
  ): Promise<Message> {
    const room = await this.chatRoomModel.findById(roomId).exec();
    if (!room) {
      throw new BadRequestException('Chat room not found');
    }

    if (!room.users.includes(userId)) {
      throw new ForbiddenException('Access denied');
    }

    const newMessage = new this.messageModel({ roomId, author, content });
    const savedMessage = await newMessage.save();
    this.eventEmitter.emit('messageSent', savedMessage);
    return savedMessage;
  }

  async updateMessage(
    messageId: string,
    userId: Types.ObjectId,
    content: string,
  ): Promise<Message> {
    const message = await this.messageModel.findById(messageId).exec();
    if (!message) {
      throw new BadRequestException('Message not found');
    }

    const room = await this.chatRoomModel.findById(message.roomId).exec();
    if (!room.users.includes(userId)) {
      throw new ForbiddenException('Access denied');
    }

    message.content = content;
    const updatedMessage = await message.save();
    this.eventEmitter.emit('messageUpdated', updatedMessage);
    return updatedMessage;
  }

  async deleteMessage(
    messageId: string,
    userId: Types.ObjectId,
  ): Promise<Message> {
    const message = await this.messageModel.findById(messageId).exec();
    if (!message) {
      throw new BadRequestException('Message not found');
    }

    const room = await this.chatRoomModel.findById(message.roomId).exec();
    if (!room.users.includes(userId)) {
      throw new ForbiddenException('Access denied');
    }

    const deletedMessage = await this.messageModel
      .findByIdAndDelete(messageId)
      .exec();
    if (deletedMessage) {
      this.eventEmitter.emit('messageDeleted', deletedMessage);
    }
    return deletedMessage;
  }

  async getMessages(
    roomId: string,
    userId: Types.ObjectId,
  ): Promise<Message[]> {
    const room = await this.chatRoomModel.findById(roomId).exec();
    if (!room.users.includes(userId)) {
      throw new ForbiddenException('Access denied');
    }
    return this.messageModel.find({ roomId }).exec();
  }
}
