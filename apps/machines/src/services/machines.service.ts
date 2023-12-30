import { UserPayload } from '@iot/security';
import { plainToInstance } from 'class-transformer';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { MachineDto } from '../dto/machine.dto';
import { MACHINE_STATUS } from '../app.types';
import { KepwareService } from './kepware.service';
import { QueryMachineDto } from '../dto/incoming/query-machine.dto';
import { UpdateMachineDto } from '../dto/incoming/update-machine.dto';
import { AssignEmployeeDto } from '../dto/incoming/assign-employee.dto';
import { ResponseMachineDto } from '../dto/outcoming/response-machine.dto';
import { MachinesRepository } from '../repositories/machines.repository';
import { ResponseMachinesDto } from '../dto/outcoming/response-machines.dto';
import { ResponseMachineStatusDto } from '../dto/outcoming/response-machine-status.dto';

@Injectable()
export class MachinesService {
  private readonly logger = new Logger(MachinesService.name);

  constructor(
    private readonly machinesRepository: MachinesRepository,
    private readonly kepwareService: KepwareService,
  ) {}

  async findOne(serialNumber: string): Promise<ResponseMachineDto> {
    const machine = await this.machinesRepository.findOne(serialNumber, false);
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

  async findMany(
    queryDto: QueryMachineDto,
    user: UserPayload,
  ): Promise<ResponseMachinesDto> {
    const filters = this.sanitizeFilters(queryDto, user);

    const { data, total } = await this.machinesRepository.query(filters);

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

    if (
      machineDto.status !== MACHINE_STATUS.IDLE &&
      machineDto.status !== MACHINE_STATUS.WORKING
    ) {
      throw new BadRequestException('You cannot change machine status');
    }

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
  }

  async assignEmployee(serialNumber: string, employee: AssignEmployeeDto) {
    const machine = await this.machinesRepository.assignEmployee(
      serialNumber,
      employee.employee || null,
    );

    return { data: plainToInstance(MachineDto, machine) };
  }

  async assignMaintainer(serialNumber: string, user: UserPayload) {
    const machine = await this.machinesRepository.assignMaintainer(
      serialNumber,
      user.email,
    );

    return { data: plainToInstance(MachineDto, machine) };
  }

  async brokeMachine({
    serialNumber,
    version,
  }: {
    serialNumber: string;
    version: number;
  }) {
    try {
      const machine = await this.machinesRepository.findOne(serialNumber, true);

      if (machine.version !== version) {
        throw new Error('Machine version is outdated');
      }

      await this.machinesRepository.update(serialNumber, {
        status: 'BROKEN',
      });
    } catch (err) {
      this.logger.error("Couldn't handle broke machine event", err);
      throw err;
    }
  }

  sanitizeFilters(queryDto: QueryMachineDto, user: UserPayload) {
    if (user?.role === 'employee') {
      queryDto.employee = user.email;
      delete queryDto.maintainer;
    } else if (user?.role === 'maintainer') {
      if (queryDto.maintainer) {
        delete queryDto.maintainer;
      } else {
        queryDto.maintainer = user.email;
      }

      delete queryDto.employee;
    }

    return queryDto;
  }
}
