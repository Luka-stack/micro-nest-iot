import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Access {
  @Prop({ required: true })
  employee: string;

  @Prop({ required: true, unique: true })
  machineId: string;

  @Prop({ required: true })
  version: number;
}

export type AccessDocument = Access & Document;

export const AccessSchema = SchemaFactory.createForClass(Access);
