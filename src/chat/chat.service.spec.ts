import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { ChatService } from './chat.service';
import { ChatRoom } from './schemas/chatroom.schema';
import { Message } from './schemas/message.schema';
import { EventEmitter2 } from 'eventemitter2';

const mockChatRoom = {
  name: 'Test Room',
  users: [],
  _id: 'someid',
};

const mockMessage = {
  roomId: 'someid',
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
            findById: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockChatRoom),
            }),
            save: jest.fn(),
          },
        },
        {
          provide: getModelToken(Message.name),
          useValue: {
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
            save: jest.fn(),
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
    const result = await service.joinRoom(
      'someid',
      new MongooseSchema.Types.ObjectId('someUserId'),
    );
    expect(result).toEqual(mockChatRoom);
  });

  it('should send a message', async () => {
    const result = await service.sendMessage(
      'someid',
      new MongooseSchema.Types.ObjectId('someUserId'),
      'Author',
      'Test message',
    );
    expect(result).toEqual(mockMessage);
  });

  it('should update a message', async () => {
    const result = await service.updateMessage(
      'someid',
      new MongooseSchema.Types.ObjectId('someUserId'),
      'Updated message',
    );
    expect(result).toEqual(mockMessage);
  });

  it('should delete a message', async () => {
    const result = await service.deleteMessage(
      'someid',
      new MongooseSchema.Types.ObjectId('someUserId'),
    );
    expect(result).toEqual(mockMessage);
  });

  it('should get messages from a chat room', async () => {
    jest.spyOn(messageModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockMessage]),
    } as any);
    const result = await service.getMessages(
      'someid',
      new MongooseSchema.Types.ObjectId('someUserId'),
    );
    expect(result).toEqual([mockMessage]);
  });
});
