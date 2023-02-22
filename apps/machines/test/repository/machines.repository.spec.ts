import { BadRequestException } from '@nestjs/common';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { Machine as MachineModel } from '@prisma/db-machines';

import { PrismaService } from '../../src/repositories/prisma.service';
import { MachinesRepository } from '../../src/repositories/machines.repository';
import { QueryMachineDto } from '../../src/dto/incoming/query-machine.dto';

const prismaServiceMock = () => ({
  machine: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

type PrismaMock = ReturnType<typeof prismaServiceMock>;

describe('MachinesRepository', () => {
  let machinesRepository: MachinesRepository;
  let prismaService: PrismaMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MachinesRepository,
        {
          provide: PrismaService,
          useFactory: prismaServiceMock,
        },
      ],
    }).compile();

    machinesRepository = module.get(MachinesRepository);
    prismaService = module.get(PrismaService);
  });

  it('MachinesRepository defined', () => {
    expect(machinesRepository).toBeDefined();
  });

  describe('create new device', () => {
    const machineDto = {
      serialNumber: '123',
      producent: 'Producent',
      type: 'Type',
      model: 'Model',
    };

    it('throws bad request because machine with provided serial number exists', async () => {
      prismaService.machine.create.mockImplementationOnce(() => {
        throw new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2002',
          clientVersion: '1.0',
        });
      });

      expect(() => machinesRepository.create(machineDto)).rejects.toThrow(
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

      expect(() => machinesRepository.create(machineDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws internal error, unexpected error occurred', async () => {
      prismaService.machine.create.mockImplementationOnce(() => {
        throw new Error('Unexpected');
      });

      expect(() => machinesRepository.create(machineDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('creates new machine', async () => {
      prismaService.machine.create.mockImplementationOnce((data) => data.data);

      const machine = await machinesRepository.create(machineDto);

      expect(machine.serialNumber).toBe(machineDto.serialNumber);
      expect(machine.producent).toBe(machineDto.producent);
      expect(machine.type).toBe(machineDto.type);
      expect(machine.model).toBe(machineDto.model);
      expect(prismaService.machine.create).toBeCalledTimes(1);
    });

    it('creates new machine with default version, startedAt, status, productionRate', async () => {
      const defProductionRate = 10;
      const defStatus = 'IDLE';
      const defVersion = 1;

      prismaService.machine.create.mockImplementationOnce((data) => data.data);

      const machine = await machinesRepository.create(machineDto);

      expect(machine.productionRate).toBe(defProductionRate);
      expect(machine.status).toBe(defStatus);
      expect(machine.version).toBe(defVersion);
    });
  });

  describe('get one device', () => {
    const serialNumber = '123456';

    const machineMock = {
      serialNumber,
      producent: 'Prod 1',
      status: 'IDLE',
    };

    it('returns a machine', async () => {
      prismaService.machine.findUnique.mockReturnValueOnce(machineMock);

      const machine = await machinesRepository.findOne(serialNumber);

      expect(machine.serialNumber).toBe(machineMock.serialNumber);
      expect(machine.producent).toBe(machineMock.producent);
      expect(prismaService.machine.findUnique).toBeCalledTimes(1);
    });

    it('throw bad request if device not found', async () => {
      prismaService.machine.findUnique.mockReturnValueOnce(null);

      expect(() => machinesRepository.findOne(serialNumber)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('query builder', () => {
    it('returns correctly build query for serialNumber', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.serialNumber = 'xxx-xxx-xxx';
      const query = machinesRepository.queryBuilder(machineQuery);

      expect(query.length).toBe(1);
      expect(query[0]).toStrictEqual({
        serialNumber: {
          contains: machineQuery.serialNumber,
        },
      });
    });

    it('returns correctly build query for producent', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.producents = 'Producent';
      const query = machinesRepository.queryBuilder(machineQuery);

      const machineQuery2 = new QueryMachineDto();
      machineQuery2.producents = 'Prod 1, Prod 2';
      const query2 = machinesRepository.queryBuilder(machineQuery2);

      expect(query.length).toBe(1);
      expect(query[0]).toStrictEqual({
        producent: {
          in: machineQuery.producents.split(','),
        },
      });

      expect(query2.length).toBe(1);
      expect(query2[0]).toStrictEqual({
        producent: {
          in: machineQuery2.producents.split(','),
        },
      });
    });

    it('returns correctly build query for type', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.types = 'Type';
      const query = machinesRepository.queryBuilder(machineQuery);

      const machineQuery2 = new QueryMachineDto();
      machineQuery2.types = 'Type 1, Type 2';
      const query2 = machinesRepository.queryBuilder(machineQuery2);

      expect(query.length).toBe(1);
      expect(query[0]).toStrictEqual({
        type: {
          in: machineQuery.types.split(','),
        },
      });

      expect(query2.length).toBe(1);
      expect(query2[0]).toStrictEqual({
        type: {
          in: machineQuery2.types.split(','),
        },
      });
    });

    it('returns correctly build query for model', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.models = 'Model';
      const query = machinesRepository.queryBuilder(machineQuery);

      const machineQuery2 = new QueryMachineDto();
      machineQuery2.models = 'Model 1, Model 2';
      const query2 = machinesRepository.queryBuilder(machineQuery2);

      expect(query.length).toBe(1);
      expect(query[0]).toStrictEqual({
        model: { in: machineQuery.models.split(',') },
      });

      expect(query2.length).toBe(1);
      expect(query2[0]).toStrictEqual({
        model: { in: machineQuery2.models.split(',') },
      });
    });

    it('returns correctly build query for status', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.status = 'IDLE';
      const query = machinesRepository.queryBuilder(machineQuery);

      const machineQuery2 = new QueryMachineDto();
      machineQuery2.status = 'idle,BroKen';
      const query2 = machinesRepository.queryBuilder(machineQuery2);

      expect(query.length).toBe(1);
      expect(query[0]).toStrictEqual({
        status: {
          in: machineQuery.status
            .split(',')
            .map((status) => status.toUpperCase()),
        },
      });

      expect(query2.length).toBe(1);
      expect(query2[0]).toStrictEqual({
        status: {
          in: machineQuery2.status
            .split(',')
            .map((status) => status.toUpperCase()),
        },
      });
    });

    it('returns correctly build query for productionRate', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.rate = '20';
      machineQuery.rateFilter = 'lt';
      const query = machinesRepository.queryBuilder(machineQuery);

      expect(query.length).toBe(1);
      expect(query[0]).toStrictEqual({ productionRate: { lt: 20 } });
    });

    it('returns correctly build query for productionRate with default filter', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.rate = '20';
      const query = machinesRepository.queryBuilder(machineQuery);

      expect(query.length).toBe(1);
      expect(query[0]).toStrictEqual({ productionRate: { equals: 20 } });
    });

    it('returns correctly build query for startedAt', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.startedAt = '2023-02-04';
      machineQuery.startedAtFilter = 'gt';
      const query = machinesRepository.queryBuilder(machineQuery);

      expect(query.length).toBe(1);
      expect(query[0]).toStrictEqual({
        startedAt: {
          gt: new Date(machineQuery.startedAt),
        },
      });
    });

    it('returns correctly build query for startedAt with default filter', async () => {
      const machineQuery = new QueryMachineDto();
      machineQuery.startedAt = '2023-02-04';
      const query = machinesRepository.queryBuilder(machineQuery);

      expect(query.length).toBe(1);
      expect(query[0]).toStrictEqual({
        startedAt: {
          equals: new Date(machineQuery.startedAt),
        },
      });
    });

    it('returns empty list if no query passed', () => {
      const machineQuery = new QueryMachineDto();
      const query = machinesRepository.queryBuilder(machineQuery);

      expect(query.length).toBe(0);
    });
  });

  describe('find many', () => {
    it('it returns empty list of machines', async () => {
      prismaService.machine.findMany.mockReturnValueOnce([]);

      const result = await machinesRepository.findMany({});

      expect(result.length).toEqual(0);
      expect(prismaService.machine.findMany).toBeCalledTimes(1);
    });

    it('it returns a list of machines', async () => {
      const machine1 = { id: 1, serialNumber: '123' };
      const machine2 = { id: 2, serialNumber: '099' };

      prismaService.machine.findMany.mockReturnValueOnce([machine1, machine2]);

      const result = await machinesRepository.findMany({});

      expect(result.length).toEqual(2);
      expect(result[0].id).toStrictEqual(machine1.id);
      expect(result[0].serialNumber).toStrictEqual(machine1.serialNumber);
      expect(result[1].id).toStrictEqual(machine2.id);
      expect(result[1].serialNumber).toStrictEqual(machine2.serialNumber);
      expect(prismaService.machine.findMany).toBeCalledTimes(1);
    });
  });

  describe('update machine', () => {
    const serialNumber = '123456';
    const machineDto = {
      productionRate: 20,
      status: 'WORKING' as MachineModel['status'],
    };

    it('updates machine and returns it', async () => {
      const machineMock = {
        version: 1,
        status: 'IDLE',
        productionRate: 10,
      };

      prismaService.machine.findUnique.mockReturnValueOnce(machineMock);
      prismaService.machine.update.mockImplementation((data) => data.data);

      const machine = await machinesRepository.update(serialNumber, machineDto);

      expect(prismaService.machine.update).toBeCalledTimes(1);
      expect(machine.version).toEqual(machineMock.version + 1);
      expect(machine.startedAt).toBeDefined();
      expect(machine.status).toEqual(machineDto.status);
      expect(machine.productionRate).toEqual(machineDto.productionRate);
    });

    it('throws not found exception if machine not found', () => {
      prismaService.machine.findUnique.mockReturnValueOnce(null);

      expect(() =>
        machinesRepository.update(serialNumber, machineDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws internal server error if unexpected error occures', () => {
      prismaService.machine.findUnique.mockReturnValueOnce({});
      prismaService.machine.update.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() =>
        machinesRepository.update(serialNumber, machineDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('destroy machine', () => {
    const serialNumber = '123456';

    it('destroys machine and returns void', () => {
      prismaService.machine.delete.mockReturnValueOnce(null);

      machinesRepository.delete(serialNumber);

      expect(prismaService.machine.delete).toBeCalledTimes(1);
    });

    it('throws not found exception, machine was not found', () => {
      prismaService.machine.delete.mockImplementationOnce(() => {
        throw new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2025',
          clientVersion: '1.0',
        });
      });

      expect(() => machinesRepository.delete(serialNumber)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws internal server exception, unexpected error occured', () => {
      prismaService.machine.delete.mockImplementationOnce(() => {
        throw new Error();
      });

      expect(() => machinesRepository.delete(serialNumber)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
