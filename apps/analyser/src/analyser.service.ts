import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';

import { Work, WorkDocument } from './schema/work.schema';
import {
  RegisterUtilizationMessage,
  RegisterWorkMessage,
} from '@iot/communication';
import { Utilization, UtilizationDocument } from './schema/utilization.schema';

@Injectable()
export class AnalyserService {
  private logger = new Logger(AnalyserService.name);

  constructor(
    @InjectModel(Work.name) private readonly workModel: Model<WorkDocument>,
    @InjectModel(Utilization.name)
    private readonly utilizationModel: Model<UtilizationDocument>,
  ) {}

  async registerWork({ serialNumber, work }: RegisterWorkMessage['data']) {
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

  async registerUtilization({
    serialNumber,
    utilization,
  }: RegisterUtilizationMessage['data']) {
    const utilizationObject = new this.utilizationModel({
      serialNumber,
      utilization,
      timestamp: new Date().toISOString(),
    });

    try {
      await utilizationObject.save();
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
