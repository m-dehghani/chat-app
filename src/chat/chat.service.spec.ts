import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { ChatService } from './chat.service';
import { ChatRoom } from './schemas/chatroom.schema';
import { Message } from './schemas/message.schema';
import { EventEmitter2 } from 'eventemitter2';
import { Types } from 'mongoose';

const mockChatRoom = {
  _id: new Types.ObjectId(),
  name: 'Test Room',
  users: [],
  save: jest.fn().mockResolvedValue(this),
};

const mockMessage = {
  _id: new Types.ObjectId(),
  roomId: new Types.ObjectId(),
  author: 'Author',
  content: 'Test message',
  timestamp: new Date(),
};

describe('ChatService', () => {
  let service: ChatService;
  let messageModel: Model<Message>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(ChatRoom.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockChatRoom),
            findById: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockChatRoom),
            }),
          },
        },
        {
          provide: getModelToken(Message.name),
          useValue: {
            create: jest.fn().mockResolvedValue(mockMessage),
            find: jest.fn(),
            findById: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockMessage),
            }),
            findByIdAndUpdate: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockMessage),
            }),
            findByIdAndDelete: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockMessage),
            }),
          },
        },
        EventEmitter2,
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    messageModel = module.get<Model<Message>>(getModelToken(Message.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a chat room', async () => {
    const result = await service.createRoom('Test Room');
    expect(result).toEqual(mockChatRoom);
  });

  it('should join a chat room', async () => {
    const userObjectId = new MongooseSchema.Types.ObjectId(`1`);
    const result = await service.joinRoom(
      '507f191e810c19729de860ea',
      userObjectId,
    );
    expect(result).toEqual(mockChatRoom);
  });

  it('should send a message', async () => {
    const userObjectId = new MongooseSchema.Types.ObjectId(`1`);
    const result = await service.sendMessage(
      '507f191e810c19729de860ea',
      userObjectId,
      'Author',
      'Test message',
    );
    expect(result).toEqual(mockMessage);
  });

  it('should update a message', async () => {
    const userObjectId = new MongooseSchema.Types.ObjectId('1');
    const result = await service.updateMessage(
      '507f191e810c19729de860ea',
      userObjectId,
      'Updated message',
    );
    expect(result).toEqual(mockMessage);
  });

  it('should delete a message', async () => {
    const userObjectId = new MongooseSchema.Types.ObjectId('1');
    const result = await service.deleteMessage(
      '507f191e810c19729de860ea',
      userObjectId,
    );
    expect(result).toEqual(mockMessage);
  });

  it('should get messages from a chat room', async () => {
    jest.spyOn(messageModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockMessage]),
    } as any);
    const userObjectId = new MongooseSchema.Types.ObjectId(`1`);
    const result = await service.getMessages(
      '507f191e810c19729de860ea',
      userObjectId,
    );
    expect(result).toEqual([mockMessage]);
  });
});
