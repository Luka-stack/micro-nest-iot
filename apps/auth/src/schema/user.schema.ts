import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ require: true, unique: true })
  email: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: true })
  role: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
