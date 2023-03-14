import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Work, WorkDocument } from './schema/work.schema';
import { DataProducedMessage } from '@iot/communication/messages/data-produced.message';

@Injectable()
export class AnalyserService {
  private logger = new Logger(AnalyserService.name);

  constructor(
    @InjectModel(Work.name) private readonly workModel: Model<WorkDocument>,
  ) {}

  async storeProducedData({ serialNumber, work }: DataProducedMessage['data']) {
    const workObject = new this.workModel({
      serialNumber,
      work,
      timestamp: new Date().toISOString(),
    });

    try {
      await workObject.save();
      return;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async findBySerialNumber(serialNumber: string) {
    return this.workModel.find({
      serialNumber,
    });
  }
}
