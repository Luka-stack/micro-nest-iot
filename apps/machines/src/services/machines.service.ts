import { plainToInstance } from 'class-transformer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { MachineDto } from '../dto/machine.dto';
import { KepwareService } from './kepware.service';
import { QueryMachineDto } from '../dto/incoming/query-machine.dto';
import { UpdateMachineDto } from '../dto/incoming/update-machine.dto';
import { ResponseMachineDto } from '../dto/outcoming/response-machine.dto';
import { MachinesRepository } from '../repositories/machines.repository';
import { ResponseMachinesDto } from '../dto/outcoming/response-machines.dto';
import { ResponseMachineStatusDto } from '../dto/outcoming/response-machine-status.dto';
import { AssignEmployeeDto } from '../dto/incoming/assign-employee.dto';

@Injectable()
export class MachinesService {
  constructor(
    private readonly machinesRepository: MachinesRepository,
    private readonly kepwareService: KepwareService,
  ) {}

  async findOne(serialNumber: string): Promise<ResponseMachineDto> {
    const machine = await this.machinesRepository.findOne(serialNumber);

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    return { data: plainToInstance(MachineDto, machine) };
  }

  async findMachineStatus(
    serialNumber: string,
  ): Promise<ResponseMachineStatusDto> {
    const machine = await this.machinesRepository.findStatus(serialNumber);

    if (!machine) {
      throw new NotFoundException('Machine not found');
    }

    return { data: machine };
  }

  async findMany(queryDto: QueryMachineDto): Promise<ResponseMachinesDto> {
    const { data, total } = await this.machinesRepository.query(queryDto);

    return {
      data: plainToInstance(MachineDto, data),
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

  async assignEmployee(serialNumber: string, employee: AssignEmployeeDto) {
    const machine = await this.machinesRepository.assignEmployee(
      serialNumber,
      employee.employee || null,
    );

    return { data: plainToInstance(MachineDto, machine) };
  }
}
