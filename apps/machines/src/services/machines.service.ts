import { UserPayload } from '@iot/security';
import { plainToInstance } from 'class-transformer';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { MachineDto } from '../dto/machine.dto';
import { MACHINE_STATUS, NOT_ASSIGNED } from '../app.types';
import { KepwareService } from './kepware.service';
import { QueryMachineDto } from '../dto/incoming/query-machine.dto';
import { UpdateMachineDto } from '../dto/incoming/update-machine.dto';
import { AssignEmployeeDto } from '../dto/incoming/assign-employee.dto';
import { ResponseMachineDto } from '../dto/outcoming/response-machine.dto';
import { MachinesRepository } from '../repositories/machines.repository';
import { ResponseMachinesDto } from '../dto/outcoming/response-machines.dto';
import { ResponseMachineStatusDto } from '../dto/outcoming/response-machine-status.dto';
import { Machine, MaintainInfo } from '../bos/machine';
import { MachineMaintainInfoDto } from '../dto/machine-maintain-info.dto';

@Injectable()
export class MachinesService {
  private static readonly EMPLOYEE_AVAIABLE_STATUS: string[] = [
    MACHINE_STATUS.IDLE,
    MACHINE_STATUS.WORKING,
  ];

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
    user: UserPayload,
  ): Promise<ResponseMachineDto> {
    const machine = await this.machinesRepository.findOne(serialNumber, true);

    if (!machineDto.status && !machineDto.productionRate) {
      return { data: plainToInstance(MachineDto, machine) };
    }

    this.validateUpdateAccess(user, machine, machineDto.status);

    if (
      (machineDto.status &&
        machineDto.status === MACHINE_STATUS.WORKING &&
        machineDto.status !== MACHINE_STATUS.WORKING) ||
      (machineDto.status !== MACHINE_STATUS.WORKING &&
        machine.status === MACHINE_STATUS.WORKING)
    ) {
      (machineDto as any).lastStatusUpdate = new Date();
    }

    const updatedMachine = await this.machinesRepository.update(
      serialNumber,
      machineDto,
      machine.version + 1,
    );

    this.kepwareService.emitMachineUpdated({
      serialNumber: machine.serialNumber,
      version: machine.version,
      status: machineDto.status,
      productionRate: machineDto.productionRate,
    });

    return { data: plainToInstance(MachineDto, updatedMachine) };
  }

  async reportDefect(serialNumber: string, notes: string) {
    const machine = await this.machinesRepository.findOne(serialNumber, true);

    const updatedInfo = await this.machinesRepository.updateMaintainInfo(
      machine.id,
      {
        notes,
      },
    );

    return { data: plainToInstance(MachineMaintainInfoDto, updatedInfo) };
  }

  async changePriority(serialNumber: string, priority: string) {
    const machine = await this.machinesRepository.findOne(serialNumber, true);

    const updatedInfo = await this.machinesRepository.updateMaintainInfo(
      machine.id,
      {
        priority: priority as MaintainInfo['priority'],
      },
    );

    return { data: plainToInstance(MachineMaintainInfoDto, updatedInfo) };
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

      await this.machinesRepository.update(
        serialNumber,
        {
          status: 'BROKEN',
        },
        machine.version + 1,
      );
    } catch (err) {
      this.logger.error("Couldn't handle broke machine event", err);
      throw err;
    }
  }

  private sanitizeFilters(queryDto: QueryMachineDto, user: UserPayload) {
    if (user?.role === 'employee') {
      queryDto.employee = user.email;
      delete queryDto.maintainer;
    } else if (user?.role === 'maintainer') {
      if (queryDto.maintainer) {
        queryDto.maintainer = user.email;
      } else {
        queryDto.maintainer = NOT_ASSIGNED;
      }

      delete queryDto.employee;
    }

    return queryDto;
  }

  private validateUpdateAccess(
    user: UserPayload,
    machine: Machine,
    newStatus?: string,
  ) {
    if (user.role === 'administrator') {
      return;
    }

    if (user.role === 'employee') {
      if (machine.assignedEmployee !== user.email) {
        throw new UnauthorizedException('You cannot update this machine');
      }

      if (!MachinesService.EMPLOYEE_AVAIABLE_STATUS.includes(machine.status)) {
        throw new BadRequestException(
          'You cannot change machine while broke or maintenance',
        );
      }

      return;
    }

    if (user.role === 'maintainer') {
      if (machine.assignedMaintainer !== user.email) {
        throw new UnauthorizedException('You cannot update this machine');
      }

      if (newStatus === MACHINE_STATUS.WORKING) {
        throw new BadRequestException('Invalid status');
      }

      return;
    }
  }
}
