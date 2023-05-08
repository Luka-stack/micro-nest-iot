import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';

import { Work, WorkDocument } from './schema/work.schema';
import {
  RegisterUtilizationMessage,
  RegisterWorkMessage,
} from '@iot/communication';
import { Utilization, UtilizationDocument } from './schema/utilization.schema';
import { QueryUtilizationDto } from './dto/query-utilization.dto';
import { StatisticsDto } from './dto/statistics-dto';

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

  async getUtilization(serialNumber: string, query: QueryUtilizationDto) {
    return {
      data: await this.utilizationModel.aggregate([
        {
          $match: {
            serialNumber,
            timestamp: {
              $gte: new Date(query.fromDate),
              $lte: new Date(query.toDate),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
            },
            utilization: {
              $sum: '$utilization',
            },
          },
        },
        {
          $addFields: {
            utilization: {
              $divide: ['$utilization', 60],
            },
          },
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            utilization: 1,
          },
        },
        {
          $sort: { date: 1 },
        },
      ]),
    };
  }

  async getStatistics(serialNumber: string): Promise<StatisticsDto> {
    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);

    const [wholeData, statistics] = await Promise.all([
      this.utilizationModel.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
            },
            utilization: { $sum: '$utilization' },
          },
        },
      ]),
      this.utilizationModel.aggregate([
        {
          $match: {
            serialNumber,
            timestamp: {
              $gte: new Date(
                todayDate.getTime() - 4 * 31 * 24 * 60 * 60 * 1000,
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
            },
            utilization: { $sum: '$utilization' },
          },
        },
        {
          $group: {
            _id: null,
            today: {
              $sum: {
                $cond: [
                  {
                    $eq: [{ $toDate: '$_id' }, { $toDate: todayDate }],
                  },
                  '$utilization',
                  0,
                ],
              },
            },
            firstSevenDays: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: [
                          { $toDate: '$_id' },
                          { $subtract: [todayDate, 6 * 24 * 60 * 60 * 1000] },
                        ],
                      },
                      {
                        $lte: [{ $toDate: '$_id' }, todayDate],
                      },
                    ],
                  },
                  '$utilization',
                  0,
                ],
              },
            },
            firstMonth: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: [
                          { $toDate: '$_id' },
                          { $subtract: [todayDate, 30 * 24 * 60 * 60 * 1000] },
                        ],
                      },
                      {
                        $lte: [{ $toDate: '$_id' }, todayDate],
                      },
                    ],
                  },
                  '$utilization',
                  0,
                ],
              },
            },
            quater: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: [
                          { $toDate: '$_id' },
                          {
                            $subtract: [
                              todayDate,
                              4 * 30 * 24 * 60 * 60 * 1000,
                            ],
                          },
                        ],
                      },
                      {
                        $lte: [{ $toDate: '$_id' }, todayDate],
                      },
                    ],
                  },
                  '$utilization',
                  0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    const totalUtilization = wholeData.reduce(
      (acc, curr) => acc + curr.utilization,
      0,
    );

    return {
      data: {
        average: totalUtilization / wholeData.length,
        today: statistics[0].today,
        firstSevenDays: statistics[0].firstSevenDays,
        firstMonth: statistics[0].firstMonth,
        quater: statistics[0].quater,
      },
    };
  }
}
