import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ require: true })
  email: string;

  @Prop({ required: true })
  displayName: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  authenticated: boolean;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
