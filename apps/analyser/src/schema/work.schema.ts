import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timeseries: {
    timeField: 'timestamp',
    metaField: 'serialNumber',
    granularity: 'minutes',
  },
  toObject: {
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      delete ret.serialNumber;
    },
  },
})
export class Work {
  @Prop({ required: true })
  serialNumber: string;

  @Prop({ required: true })
  work: number;

  @Prop({ required: true })
  timestamp: Date;
}

export type WorkDocument = Work & Document;

export const WorkSchema = SchemaFactory.createForClass(Work);
