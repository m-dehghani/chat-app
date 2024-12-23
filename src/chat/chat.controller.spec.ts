import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { ChatService } from './chat.service';

describe('ChatController (e2e)', () => {
  let app: INestApplication;
  const chatService = {
    createRoom: jest
      .fn()
      .mockResolvedValue({ name: 'Test Room', _id: 'someid', users: [] }),
    joinRoom: jest.fn().mockResolvedValue({
      name: 'Test Room',
      _id: 'someid',
      users: ['someUserId'],
    }),
    sendMessage: jest.fn().mockResolvedValue({
      roomId: 'someid',
      author: 'Author',
      content: 'Test message',
      timestamp: new Date(),
    }),
    updateMessage: jest.fn().mockResolvedValue({
      roomId: 'someid',
      author: 'Author',
      content: 'Updated message',
      timestamp: new Date(),
    }),
    deleteMessage: jest.fn().mockResolvedValue({
      roomId: 'someid',
      author: 'Author',
      content: 'Test message',
      timestamp: new Date(),
    }),
    getMessages: jest.fn().mockResolvedValue([
      {
        roomId: 'someid',
        author: 'Author',
        content: 'Test message',
        timestamp: new Date(),
      },
    ]),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ChatService)
      .useValue(chatService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/chat/room (POST) should create a new chat room', () => {
    return request(app.getHttpServer())
      .post('/chat/room')
      .send({ name: 'Test Room' })
      .expect(201)
      .expect(chatService.createRoom());
  });

  it('/chat/room/:id/join (POST) should join a chat room', () => {
    return request(app.getHttpServer())
      .post('/chat/room/someid/join')
      .send({ userId: 'someUserId' })
      .expect(201)
      .expect(chatService.joinRoom());
  });

  it('/chat/message (POST) should send a message', () => {
    return request(app.getHttpServer())
      .post('/chat/message')
      .send({
        roomId: 'someid',
        userId: 'someUserId',
        author: 'Author',
        content: 'Test message',
      })
      .expect(201)
      .expect(chatService.sendMessage());
  });

  it('/chat/message/:id (PUT) should update a message', () => {
    return request(app.getHttpServer())
      .put('/chat/message/someid')
      .send({ userId: 'someUserId', content: 'Updated message' })
      .expect(200)
      .expect(chatService.updateMessage());
  });

  it('/chat/message/:id (DELETE) should delete a message', () => {
    return request(app.getHttpServer())
      .delete('/chat/message/someid')
      .send({ userId: 'someUserId' })
      .expect(200)
      .expect(chatService.deleteMessage());
  });

  it('/chat/messages/:roomId (GET) should get messages from a chat room', () => {
    return request(app.getHttpServer())
      .get('/chat/messages/someid')
      .send({ userId: 'someUserId' })
      .expect(200)
      .expect(chatService.getMessages());
  });

  afterAll(async () => {
    await app.close();
  });
});
