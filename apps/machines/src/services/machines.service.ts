import { ClientProxy } from '@nestjs/microservices';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { QueryMachineDto } from '../dto/query-machine.dto';
import { UpdateMachineDto } from '../dto/update-machine.dto';
import { CreateMachineDto } from '../dto/create-machine.dto';
import { MachineBo } from '../bos/machine.bo';
import { MachinesRepository } from '../repositories/machines.repository';

@Injectable()
export class MachinesService {
  constructor(
    private readonly machinesRepository: MachinesRepository,
    @Inject('KEPWARE') private readonly billingClient: ClientProxy,
  ) {}

  async store(machineDto: CreateMachineDto): Promise<MachineBo> {
    try {
      return await this.machinesRepository.create(machineDto);
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
      return await this.machinesRepository.update(serialNumber, machineDto);
    } catch (err) {
      throw err;
    }
  }

  async destroy(serialNumber: string): Promise<void> {
    try {
      return await this.machinesRepository.delete(serialNumber);
    } catch (err) {
      throw err;
    }
  }

  // changeStatus(request: { name: string; on: boolean }) {
  //   this.billingClient.emit('device_status', {
  //     request,
  //   });
  //   return { name: request.name, on: request.on };
  // }
}
