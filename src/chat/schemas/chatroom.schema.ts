import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
@Schema()
export class ChatRoom extends Document {
  @Prop({ required: true }) name: string;
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  users: MongooseSchema.Types.ObjectId[];
}
export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
