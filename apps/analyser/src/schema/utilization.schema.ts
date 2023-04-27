import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timeseries: {
    timeField: 'timestamp',
    metaField: 'serialNumber',
    granularity: 'minutes',
  },
})
export class Utilization {
  @Prop({ required: true })
  serialNumber: string;

  @Prop({ required: true })
  utilization: number;

  @Prop({ required: true })
  timestamp: Date;
}

export type UtilizationDocument = Utilization & Document;

export const UtilizationSchema = SchemaFactory.createForClass(Utilization);
