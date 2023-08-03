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
    const tillThatDay = new Date(query.toDate);
    tillThatDay.setDate(tillThatDay.getDate() + 1);

    const databaseData = await this.utilizationModel.aggregate([
      {
        $match: {
          serialNumber,
          timestamp: {
            $gte: new Date(query.fromDate),
            $lt: tillThatDay,
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
    ]);

    return {
      data: this.fillMissingDates(databaseData, query.fromDate, query.toDate),
    };
  }

  async getStatistics(serialNumber: string): Promise<StatisticsDto> {
    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);

    const [wholeData, statistics] = await Promise.all([
      this.utilizationModel.aggregate([
        {
          $match: {
            serialNumber,
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
          $addFields: {
            utilization: {
              $divide: ['$utilization', 60],
            },
          },
        },
      ]),
      this.utilizationModel.aggregate([
        {
          $match: {
            serialNumber,
            timestamp: {
              $gte: new Date(todayDate.getTime() - 31 * 24 * 60 * 60 * 1000),
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
          $addFields: {
            utilization: {
              $divide: ['$utilization', 60],
            },
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
            lastWeek: {
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
            lastMonth: {
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
          },
        },
      ]),
    ]);

    if (!wholeData.length) {
      return {
        data: {
          total: 0,
          today: 0,
          lastWeek: 0,
          avgLastWeek: 0,
          lastMonth: 0,
          avgLastMonth: 0,
        },
      };
    }

    return {
      data: {
        total: wholeData.reduce((acc, curr) => curr.utilization, 0),
        today: statistics[0].today,
        lastWeek: statistics[0].lastWeek,
        avgLastWeek: statistics[0].lastWeek / 7,
        lastMonth: statistics[0].lastMonth,
        avgLastMonth: Math.floor(statistics[0].lastMonth / 31),
      },
    };
  }

  private fillMissingDates(
    data: { date: string }[],
    startDateString: string,
    endDateString: string,
  ) {
    const filledData = [];
    const currentDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    while (currentDate <= endDate) {
      let found = false;

      for (const obj of data) {
        const objDate = new Date(obj.date);

        if (objDate.getTime() === currentDate.getTime()) {
          filledData.push(obj);
          found = true;
          break;
        }
      }

      if (!found) {
        filledData.push({
          date: currentDate.toISOString().slice(0, 10),
          utilization: 0,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return filledData;
  }
}
