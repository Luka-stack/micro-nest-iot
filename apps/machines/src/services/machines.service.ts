import { BadRequestException, Injectable } from '@nestjs/common';

import { QueryMachineDto } from '../dto/incoming/query-machine.dto';
import { UpdateMachineDto } from '../dto/incoming/update-machine.dto';
import { CreateMachineDto } from '../dto/incoming/create-machine.dto';
import { MachinesRepository } from '../repositories/machines.repository';
import { KepwareService } from './kepware.service';
import { plainToInstance } from 'class-transformer';
import { MachineDto } from '../dto/machine.dto';
import { ResponseMachinesDto } from '../dto/outcoming/response-machines.dto';
import { ResponseMachineDto } from '../dto/outcoming/response-machine.dto';

@Injectable()
export class MachinesService {
  constructor(
    private readonly machinesRepository: MachinesRepository,
    private readonly kepwareService: KepwareService,
  ) {}

  async store(machineDto: CreateMachineDto): Promise<ResponseMachineDto> {
    try {
      const machine = await this.machinesRepository.create(machineDto);

      this.kepwareService.emitMachineCreated({
        serialNumber: machine.serialNumber,
        productionRate: machine.productionRate,
        status: machine.status,
        version: machine.version,
        workBase: machine.model.workBase,
        workRange: machine.model.workRange,
        faultRate: machine.model.faultRate,
        defaultRate: machine.model.defaultRate,
        minRate: machine.model.minRate,
        maxRate: machine.model.maxRate,
      });

      return { data: plainToInstance(MachineDto, machine) };
    } catch (err) {
      throw err;
    }
  }

  async findOne(serialNumber: string): Promise<ResponseMachineDto> {
    try {
      const data = plainToInstance(
        MachineDto,
        await this.machinesRepository.findOne(serialNumber),
      );

      return { data };
    } catch (err) {
      throw err;
    }
  }

  async findMany(queryDto: QueryMachineDto): Promise<ResponseMachinesDto> {
    const { machines, total } = await this.machinesRepository.paginate(
      queryDto,
    );

    const data = plainToInstance(MachineDto, machines);

    return {
      data,
      meta: {
        count: data.length,
        offset: Number(queryDto.offset) || 0,
        limit: Number(queryDto.limit) || data.length,
        total: total,
      },
    };
  }

  async update(
    serialNumber: string,
    machineDto: UpdateMachineDto,
  ): Promise<ResponseMachineDto> {
    if (!machineDto.productionRate && !machineDto.status) {
      throw new BadRequestException('At least one field must change');
    }

    try {
      const machine = await this.machinesRepository.update(
        serialNumber,
        machineDto,
      );

      this.kepwareService.emitMachineUpdated({
        serialNumber: machine.serialNumber,
        version: machine.version,
        status: machineDto.status,
        productionRate: machineDto.productionRate,
      });

      return { data: plainToInstance(MachineDto, machine) };
    } catch (err) {
      throw err;
    }
  }

  async destroy(serialNumber: string): Promise<void> {
    try {
      await this.machinesRepository.delete(serialNumber);

      this.kepwareService.emitMachineDeleted({ serialNumber: serialNumber });
    } catch (err) {
      throw err;
    }
  }
}
