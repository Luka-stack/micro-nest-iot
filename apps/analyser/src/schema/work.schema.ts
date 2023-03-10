import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkDocument = Work & Document;

@Schema({
  timeseries: {
    timeField: 'timestamp',
    metaField: 'serialNumber',
    granularity: 'minutes',
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

export const WorkSchema = SchemaFactory.createForClass(Work);
