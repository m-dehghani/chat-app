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
  _id: new MongooseSchema.Types.ObjectId('1'),
};
const mockMessage = {
  roomId: new MongooseSchema.Types.ObjectId('1'),
  author: 'Author',
  content: 'Test message',
  timestamp: new Date(),
  _id: new MongooseSchema.Types.ObjectId('1'),
};
describe('ChatService', () => {
  let service: ChatService;
  let chatRoomModel: Model<ChatRoom>;
  let messageModel: Model<Message>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(ChatRoom.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockChatRoom),
            findById: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockChatRoom),
            }),
            findByIdAndUpdate: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockChatRoom),
            }),
            save: jest.fn(),
          },
        },
        {
          provide: getModelToken(Message.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockMessage),
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
    chatRoomModel = module.get<Model<ChatRoom>>(getModelToken(ChatRoom.name));
    messageModel = module.get<Model<Message>>(getModelToken(Message.name));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a chat room', async () => {
    jest.spyOn(chatRoomModel.prototype, 'save').mockResolvedValue(mockChatRoom);
    const result = await service.createRoom('Test Room');
    expect(result).toEqual(mockChatRoom);
  });
  it('should join a chat room', async () => {
    const result = await service.joinRoom(
      mockChatRoom._id.toString(),
      new MongooseSchema.Types.ObjectId('1'),
    );
    expect(result).toEqual(mockChatRoom);
  });
  it('should send a message', async () => {
    jest.spyOn(messageModel.prototype, 'save').mockResolvedValue(mockMessage);
    const result = await service.sendMessage(
      mockChatRoom._id.toString(),
      new MongooseSchema.Types.ObjectId('1'),
      'Author',
      'Test message',
    );
    expect(result).toEqual(mockMessage);
  });
  it('should update a message', async () => {
    const result = await service.updateMessage(
      mockMessage._id.toString(),
      new MongooseSchema.Types.ObjectId('1'),
      'Updated message',
    );
    expect(result).toEqual(mockMessage);
  });
  it('should delete a message', async () => {
    const result = await service.deleteMessage(
      mockMessage._id.toString(),
      new MongooseSchema.Types.ObjectId(`1`),
    );
    expect(result).toEqual(mockMessage);
  });
  it('should get messages from a chat room', async () => {
    jest.spyOn(messageModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockMessage]),
    } as any);
    const result = await service.getMessages(
      mockChatRoom._id.toString(),
      new MongooseSchema.Types.ObjectId(`1`),
    );
    expect(result).toEqual([mockMessage]);
  });
});
