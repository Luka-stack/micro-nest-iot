import { BadRequestException, Injectable } from '@nestjs/common';

import { QueryMachineDto } from '../dto/query-machine.dto';
import { UpdateMachineDto } from '../dto/update-machine.dto';
import { CreateMachineDto } from '../dto/create-machine.dto';
import { MachineBo } from '../bos/machine.bo';
import { MachinesRepository } from '../repositories/machines.repository';
import { KepwareService } from './kepware.service';

@Injectable()
export class MachinesService {
  constructor(
    private readonly machinesRepository: MachinesRepository,
    private readonly kepwareService: KepwareService,
  ) {}

  async store(machineDto: CreateMachineDto): Promise<MachineBo> {
    try {
      const machine = await this.machinesRepository.create(machineDto);

      this.kepwareService.emitMachineCreated({
        serialNumber: machine.serialNumber,
        productionRate: machine.productionRate,
        status: machine.status,
        version: machine.version,
      });

      return machine;
    } catch (err) {
      throw err;
    }
  }

  async findOne(serialNumber: string): Promise<MachineBo> {
    try {
      return await this.machinesRepository.findOne(serialNumber);
    } catch (err) {
      throw err;
    }
  }

  async findMany(queryDto: QueryMachineDto): Promise<MachineBo[]> {
    try {
      return await this.machinesRepository.findMany(queryDto);
    } catch (err) {
      throw err;
    }
  }

  async update(
    serialNumber: string,
    machineDto: UpdateMachineDto,
  ): Promise<MachineBo> {
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

      return machine;
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
