import { BadRequestException } from '@nestjs/common';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../src/database/prisma.service';
import { QueryMachineDto } from '../../src/dto/query-machine.dto';
import { MachinesService } from '../../src/services/machines.service';

const prismaServiceMock = () => ({
  machine: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

const clientProxy = () => ({});

type PrismaMock = ReturnType<typeof prismaServiceMock>;

describe('MachinesService', () => {
  let machinesService: MachinesService;
  let prismaService: PrismaMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MachinesService,
        {
          provide: PrismaService,
          useFactory: prismaServiceMock,
        },
        {
          provide: 'KEPWARE',
          useFactory: clientProxy,
        },
      ],
    }).compile();

    machinesService = module.get(MachinesService);
    prismaService = module.get(PrismaService);
  });

  it('MachinesService defined', () => {
    expect(machinesService).toBeDefined();
  });

  describe('create new device', () => {
    const machineDto = {
      serialNumber: '123',
      producent: 'Producent',
      type: 'Type',
      modelId: 1,
    };

    it('throws bad request because machine with provided serial number exists', async () => {
      prismaService.machine.create.mockImplementationOnce(() => {
        throw new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2002',
          clientVersion: '1.0',
        });
      });

      expect(() => machinesService.createMachine(machineDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws bad request because referenced field doesnt exist', async () => {
      prismaService.machine.create.mockImplementationOnce(() => {
        throw new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2003',
          clientVersion: '1.0',
        });
      });

      expect(() => machinesService.createMachine(machineDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws internal error, unexpected error occurred', async () => {
      prismaService.machine.create.mockImplementationOnce(() => {
        throw new Error('Unexpected');
      });

      expect(() => machinesService.createMachine(machineDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('creates new machine', async () => {
      prismaService.machine.create.mockImplementationOnce((data) => data.data);

      const machine = await machinesService.createMachine(machineDto);

      expect(machine.serialNumber).toBe(machineDto.serialNumber);
      expect(machine.producent).toBe(machineDto.producent);
      expect(machine.type).toBe(machineDto.type);
      expect(machine.modelId).toBe(machineDto.modelId);
      expect(prismaService.machine.create).toBeCalledTimes(1);
    });

    it('creates new machine with default veersion, startedAt, status, productionRate', async () => {
      const defProductionRate = 10;
      const defStatus = 'IDLE';
      const defVersion = 1;

      prismaService.machine.create.mockImplementationOnce((data) => data.data);

      const machine = await machinesService.createMachine(machineDto);

      expect(machine.productionRate).toBe(defProductionRate);
      expect(machine.status).toBe(defStatus);
      expect(machine.version).toBe(defVersion);
    });
  });

  describe('get one device', () => {
    const findMachineDto = {
      serialNumber: '123456',
    };

    const machineMock = {
      serialNumber: findMachineDto.serialNumber,
      producent: 'Prod 1',
      status: 'IDLE',
    };

    it('returns a machine', async () => {
      prismaService.machine.findUnique.mockReturnValueOnce(machineMock);

      const machine = await machinesService.findOne(findMachineDto);

      expect(machine.serialNumber).toBe(machineMock.serialNumber);
      expect(machine.producent).toBe(machineMock.producent);
      expect(prismaService.machine.findUnique).toBeCalledTimes(1);
    });

    it('throw bad request if device not found', async () => {
      expect(() => machinesService.findOne(findMachineDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('query builder', () => {
    it('returns correctly build query for product', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.producents = 'Producent';
      const query = machinesService.queryBuilder(machineQuery);

      const machineQuery2 = new QueryMachineDto();
      machineQuery2.producents = 'Prod 1, Prod 2';
      const query2 = machinesService.queryBuilder(machineQuery2);

      expect(query.producent).toStrictEqual({
        in: machineQuery.producents.split(','),
      });
      expect(query2.producent).toStrictEqual({
        in: machineQuery2.producents.split(','),
      });
    });

    it('returns correctly build query for type', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.types = 'Type';
      const query = machinesService.queryBuilder(machineQuery);

      const machineQuery2 = new QueryMachineDto();
      machineQuery2.types = 'Type 1, Type 2';
      const query2 = machinesService.queryBuilder(machineQuery2);

      expect(query.type).toStrictEqual({
        in: machineQuery.types.split(','),
      });
      expect(query2.type).toStrictEqual({
        in: machineQuery2.types.split(','),
      });
    });

    it('returns correctly build query for model', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.models = 'Model';
      const query = machinesService.queryBuilder(machineQuery);

      const machineQuery2 = new QueryMachineDto();
      machineQuery2.models = 'Model 1, Model 2';
      const query2 = machinesService.queryBuilder(machineQuery2);

      expect(query.model).toStrictEqual({
        name: { in: machineQuery.models.split(',') },
      });
      expect(query2.model).toStrictEqual({
        name: { in: machineQuery2.models.split(',') },
      });
    });

    it('returns correctly build query for status', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.status = 'IDLE';
      const query = machinesService.queryBuilder(machineQuery);

      const machineQuery2 = new QueryMachineDto();
      machineQuery2.status = 'idle, BroKen';
      const query2 = machinesService.queryBuilder(machineQuery2);

      expect(query.status).toStrictEqual({
        in: machineQuery.status
          .split(',')
          .map((status) => status.toUpperCase()),
      });
      expect(query2.status).toStrictEqual({
        in: machineQuery2.status
          .split(',')
          .map((status) => status.toUpperCase()),
      });
    });

    it('returns correctly build query for productionRate', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.rate = '20';
      machineQuery.rateFilter = 'lt';
      const query = machinesService.queryBuilder(machineQuery);

      expect(query.productionRate).toStrictEqual({ lt: 20 });
    });

    it('returns correctly build query for productionRate with default filter', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.rate = '20';
      const query = machinesService.queryBuilder(machineQuery);

      expect(query.productionRate).toStrictEqual({ equals: 20 });
    });

    it('returns correctly build query for startedAt', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.startedAt = '2023-02-04';
      machineQuery.startedAtFilter = 'gt';
      const query = machinesService.queryBuilder(machineQuery);

      expect(query.startedAt).toStrictEqual({
        gt: new Date(machineQuery.startedAt),
      });
    });

    it('returns correctly build query for model with default filter', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.startedAt = '2023-02-04';
      const query = machinesService.queryBuilder(machineQuery);

      expect(query.startedAt).toStrictEqual({
        equals: new Date(machineQuery.startedAt),
      });
    });

    it('returns empty objects if no query passed', () => {
      const machineQuery = new QueryMachineDto();
      const query = machinesService.queryBuilder(machineQuery);

      expect(query.producent).toStrictEqual({});
      expect(query.type).toStrictEqual({});
      expect(query.model).toStrictEqual({});
      expect(query.status).toStrictEqual({});
      expect(query.productionRate).toStrictEqual({});
      expect(query.startedAt).toStrictEqual({});
    });
  });

  describe('query machines', () => {
    it('it returns empty list of machines', async () => {
      prismaService.machine.findMany.mockReturnValueOnce([]);

      const result = await machinesService.query({});

      expect(result.length).toEqual(0);
      expect(prismaService.machine.findMany).toBeCalledTimes(1);
    });

    it('it returns a list of machines', async () => {
      const machine1 = { id: 1, serialNumber: '123' };
      const machine2 = { id: 2, serialNumber: '099' };

      prismaService.machine.findMany.mockReturnValueOnce([machine1, machine2]);

      const result = await machinesService.query({});

      expect(result.length).toEqual(2);
      expect(result[0]).toStrictEqual(machine1);
      expect(result[1]).toStrictEqual(machine2);
      expect(prismaService.machine.findMany).toBeCalledTimes(1);
    });
  });

  describe('update machine', () => {
    const serialNumber = '123456';
    const machineDto = { productionRate: 20 };

    it('updates machine and returns it', async () => {
      const machineMock = {
        ...machineDto,
        serialNumber,
      };

      prismaService.machine.update.mockReturnValueOnce(machineMock);

      const machine = await machinesService.patch(serialNumber, machineDto);

      expect(prismaService.machine.update).toBeCalledTimes(1);
      expect(machine).toStrictEqual(machineMock);
    });

    it('throws not found exception if machine not found', () => {
      prismaService.machine.update.mockImplementationOnce(() => {
        throw new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2025',
          clientVersion: '1.0',
        });
      });

      expect(() =>
        machinesService.patch(serialNumber, machineDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws internal server error if unexpected error occures', () => {
      prismaService.machine.update.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() =>
        machinesService.patch(serialNumber, machineDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('destroy machine', () => {
    const serialNumber = '123456';

    it('destroys machine and returns void', () => {
      prismaService.machine.delete.mockReturnValueOnce(null);

      machinesService.destroy(serialNumber);

      expect(prismaService.machine.delete).toBeCalledTimes(1);
    });

    it('throws not found exception, machine was not found', () => {
      prismaService.machine.delete.mockImplementationOnce(() => {
        throw new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2025',
          clientVersion: '1.0',
        });
      });

      expect(() => machinesService.destroy(serialNumber)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws internal server exception, unexpected error occured', () => {
      prismaService.machine.delete.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => machinesService.destroy(serialNumber)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
