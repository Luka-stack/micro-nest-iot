import { BadRequestException } from '@nestjs/common';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Test } from '@nestjs/testing';

import { MachinesService } from '../../src/services/machines.service';
import { MachinesRepository } from '../../src/repositories/machines.repository';
import { KepwareService } from '../../src/services/kepware.service';
import { instanceToPlain } from 'class-transformer';

const machinesRepositoryMock = () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getTotalCount: jest.fn(),
});

const kepwareServiceMock = () => ({
  emitMachineCreated: jest.fn(),
  emitMachineUpdated: jest.fn(),
  emitMachineDeleted: jest.fn(),
});

type RepositoryMockType = ReturnType<typeof machinesRepositoryMock>;
type KepwareServiceMockType = ReturnType<typeof kepwareServiceMock>;

describe('MachinesService', () => {
  let machinesService: MachinesService;
  let machinesRepository: RepositoryMockType;
  let kepwareService: KepwareServiceMockType;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MachinesService,
        {
          provide: MachinesRepository,
          useFactory: machinesRepositoryMock,
        },
        {
          provide: KepwareService,
          useFactory: kepwareServiceMock,
        },
      ],
    }).compile();

    machinesService = module.get(MachinesService);
    machinesRepository = module.get(MachinesRepository);
    kepwareService = module.get(KepwareService);
  });

  it('MachinesService defined', () => {
    expect(machinesService).toBeDefined();
  });

  describe('create new device', () => {
    const machineDto = {
      serialNumber: '123',
      producent: 'Producent',
      type: 'Type',
      model: 'Model',
    };

    it('throws bad request when repository throws bad request', async () => {
      machinesRepository.create.mockImplementationOnce(() => {
        throw new BadRequestException();
      });

      expect(() => machinesService.store(machineDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws internal error, unexpected error occurred', async () => {
      machinesRepository.create.mockImplementationOnce(() => {
        throw new InternalServerErrorException('Unexpected');
      });

      expect(() => machinesService.store(machineDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('creates new machine and sends it to the kepware queue', async () => {
      machinesRepository.create.mockImplementationOnce((data) => data);

      const { data } = await machinesService.store(machineDto);

      expect(data.serialNumber).toBe(machineDto.serialNumber);
      expect(data.producent).toBe(machineDto.producent);
      expect(data.type).toBe(machineDto.type);
      expect(data.model).toBe(machineDto.model);

      expect(kepwareService.emitMachineCreated).toBeCalledTimes(1);
      expect(kepwareService.emitMachineCreated).toBeCalledWith({
        serialNumber: data.serialNumber,
        productionRate: data.productionRate,
        status: data.status,
        version: data.version,
      });

      expect(machinesRepository.create).toBeCalledTimes(1);
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
      machinesRepository.findOne.mockReturnValueOnce(machineMock);

      const { data } = await machinesService.findOne(serialNumber);

      expect(data.serialNumber).toBe(machineMock.serialNumber);
      expect(data.producent).toBe(machineMock.producent);
      expect(machinesRepository.findOne).toBeCalledTimes(1);
    });

    it('throws bad request if device not found', async () => {
      machinesRepository.findOne.mockImplementation(() => {
        throw new BadRequestException();
      });

      expect(() => machinesService.findOne(serialNumber)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('find many', () => {
    const totalNumberOfRecords = 50;

    it('returns empty list of machines', async () => {
      machinesRepository.findMany.mockReturnValueOnce([]);
      machinesRepository.getTotalCount.mockReturnValueOnce(
        totalNumberOfRecords,
      );

      const { data, meta } = await machinesService.findMany({});

      expect(data.length).toEqual(0);
      expect(meta).toStrictEqual({
        count: 0,
        offset: 0,
        limit: 0,
        total: totalNumberOfRecords,
      });

      expect(machinesRepository.getTotalCount).toBeCalledTimes(1);
      expect(machinesRepository.findMany).toBeCalledTimes(1);
    });

    it('returns a list of machines', async () => {
      const machine1 = { id: 1, serialNumber: '123' };
      const machine2 = { id: 2, serialNumber: '099' };

      machinesRepository.findMany.mockReturnValueOnce([machine1, machine2]);
      machinesRepository.getTotalCount.mockReturnValueOnce(
        totalNumberOfRecords,
      );

      const { data, meta } = await machinesService.findMany({});

      expect(data.length).toEqual(2);
      expect(instanceToPlain(data[0])).toStrictEqual({
        serialNumber: machine1.serialNumber,
      });
      expect(instanceToPlain(data[1])).toStrictEqual({
        serialNumber: machine2.serialNumber,
      });

      expect(meta).toStrictEqual({
        count: 2,
        offset: 0,
        limit: 2,
        total: totalNumberOfRecords,
      });

      expect(machinesRepository.getTotalCount).toBeCalledTimes(1);
      expect(machinesRepository.findMany).toBeCalledTimes(1);
    });

    it('returns correct pagination meta data', async () => {
      const limit = 10;
      const offset = 20;

      const machine1 = { id: 1, serialNumber: '123' };
      const machine2 = { id: 2, serialNumber: '099' };

      machinesRepository.findMany.mockReturnValueOnce([machine1, machine2]);
      machinesRepository.getTotalCount.mockReturnValueOnce(
        totalNumberOfRecords,
      );

      const { data, meta } = await machinesService.findMany({
        limit: limit + '',
        offset: offset + '',
      });

      expect(data.length).toEqual(2);
      expect(instanceToPlain(data[0])).toStrictEqual({
        serialNumber: machine1.serialNumber,
      });
      expect(instanceToPlain(data[1])).toStrictEqual({
        serialNumber: machine2.serialNumber,
      });

      expect(meta).toStrictEqual({
        count: 2,
        offset,
        limit,
        total: totalNumberOfRecords,
      });

      expect(machinesRepository.getTotalCount).toBeCalledTimes(1);
      expect(machinesRepository.findMany).toBeCalledTimes(1);
    });
  });

  describe('update machine', () => {
    const serialNumber = '123456';
    const machineDto = { productionRate: 20 };

    it('updates machine, sends updated machine to kepware and returns machine', async () => {
      const machineMock = {
        ...machineDto,
        serialNumber,
      };

      machinesRepository.update.mockReturnValueOnce(machineMock);

      const { data } = await machinesService.update(serialNumber, machineDto);

      expect(machinesRepository.update).toBeCalledTimes(1);
      expect(instanceToPlain(data)).toStrictEqual(machineMock);
      expect(kepwareService.emitMachineUpdated).toBeCalledTimes(1);
      expect(kepwareService.emitMachineUpdated).toBeCalledWith({
        serialNumber: machineMock.serialNumber,
        productionRate: machineMock.productionRate,
      });
    });

    it('throws not found exception if machine not found', () => {
      machinesRepository.update.mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      expect(() =>
        machinesService.update(serialNumber, machineDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws internal server error if unexpected error occures', () => {
      machinesRepository.update.mockImplementationOnce(() => {
        throw new InternalServerErrorException();
      });

      expect(() =>
        machinesService.update(serialNumber, machineDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('destroy machine', () => {
    const serialNumber = '123456';

    it('destroys machine, sends information to kepware and returns void', async () => {
      machinesRepository.delete.mockReturnValueOnce({});

      await machinesService.destroy(serialNumber);

      expect(machinesRepository.delete).toBeCalledTimes(1);
      expect(kepwareService.emitMachineDeleted).toBeCalledTimes(1);
      expect(kepwareService.emitMachineDeleted).toBeCalledWith({
        serialNumber,
      });
    });

    it('throws not found exception, machine was not found', () => {
      machinesRepository.delete.mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      expect(() => machinesService.destroy(serialNumber)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws internal server exception, unexpected error occured', () => {
      machinesRepository.delete.mockImplementationOnce(() => {
        throw new InternalServerErrorException();
      });

      expect(() => machinesService.destroy(serialNumber)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
