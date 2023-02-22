import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';

import { MachinesService } from '../../src/services/machines.service';
import { MachinesController } from '../../src/controllers/machines.controller';
import { TransformInterceptor } from '../../src/transfrom.interceptor';
import { MachineStatus } from '../../src/app.types';
import { ResponseMachineDto } from '../../src/dto/outcoming/response-machine.dto';
import { PaginationMetadataDto } from '../../src/dto/pagination-metadata.dto';
import { MachineDto } from '../../src/dto/machine.dto';
import { plainToInstance } from 'class-transformer';

const mockMachinesService = () => ({
  findOne: jest.fn(),
  store: jest.fn(),
  update: jest.fn(),
  findMany: jest.fn(),
  destroy: jest.fn(),
});

type MachinesServiceMock = ReturnType<typeof mockMachinesService>;

describe('Machines Controller', () => {
  let app: INestApplication;
  let machinesService: MachinesServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachinesController],
      providers: [
        {
          provide: MachinesService,
          useFactory: mockMachinesService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new TransformInterceptor());
    app.setGlobalPrefix('api');

    machinesService = module.get(MachinesService);

    await app.init();
  });

  describe('(GET) find one', () => {
    it('returns 200 and machine', async () => {
      // Arrange
      const machine = new MachineDto();
      machine.id = 1;
      machine.serialNumber = '1-2-3-4-5';

      const machineDto = {
        data: machine,
      } as ResponseMachineDto;

      machinesService.findOne.mockReturnValueOnce(machineDto);

      // Act
      const { body } = await request(app.getHttpServer())
        .get('/api/machines/1234')
        .expect(200);

      // Assert
      expect(body.data).toBeDefined();
      expect(body.data.id).toBeUndefined();
      expect(body.data.serialNumber).toBe(machineDto.data.serialNumber);
    });

    it('throws 404, machine not found', async () => {
      // Arrange
      machinesService.findOne.mockImplementationOnce(() => {
        throw new NotFoundException();
      });

      // Act & Assert
      await request(app.getHttpServer()).get('/api/machines/12345').expect(404);
    });
  });

  describe('(GET) query', () => {
    it('throws 400, wrong query', async () => {
      const query =
        '?status=wrong&rate=wrong&rateFilter=wrong&startedAt=123&startedAtFilter=wrong';

      const { body } = await request(app.getHttpServer()).get(
        `/api/machines${query}`,
      );

      expect(body).toBeDefined();
      expect(body.message.length).toEqual(5);
    });

    it('return 200 with list of machines', async () => {
      const query = '?status=IDLE';

      const machineOne = plainToInstance(MachineDto, {
        id: 1,
        serialNumber: '12345',
      });

      const machineTwo = plainToInstance(MachineDto, {
        id: 2,
        serialNumber: '9999',
      });

      const meta: PaginationMetadataDto = {
        count: 10,
        limit: 10,
        offset: 10,
        total: 20,
      };

      machinesService.findMany.mockReturnValueOnce({
        data: [machineOne, machineTwo],
        meta,
      });

      const { body } = await request(app.getHttpServer())
        .get(`/api/machines${query}`)
        .expect(200);

      expect(body.data.length).toEqual(2);
      expect(body.data[0].id).toBeUndefined();
      expect(body.data[1].id).toBeUndefined();
      expect(body.data[0].serialNumber).toEqual(machineOne.serialNumber);
      expect(body.data[1].serialNumber).toEqual(machineTwo.serialNumber);

      expect(body.meta).toStrictEqual(meta);
    });
  });

  describe('(POST) create', () => {
    it('returns 201 and created machine', async () => {
      const dto = {
        serialNumber: '1-2-3-4',
        producent: 'Producent',
        type: 'Type',
        model: 'Model',
      };

      const createdMachine = plainToInstance(MachineDto, {
        id: 123,
        serialNumber: dto.serialNumber,
      });

      machinesService.store.mockReturnValueOnce({ data: createdMachine });

      const { body } = await request(app.getHttpServer())
        .post('/api/machines')
        .send(dto)
        .expect(201);

      expect(body.data).toBeDefined();
      expect(body.data.id).toBeUndefined();
      expect(body.data.serialNumber).toEqual(createdMachine.serialNumber);
    });

    it('throws 400, bad reqeust body', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/api/machines')
        .expect(400);

      expect(body).toBeDefined();
      expect(body.message).toBeDefined();
      expect(body.message.length).toBeGreaterThan(0);
    });
  });

  describe('(PATCH) update', () => {
    it('returns 200 and updated machine', async () => {
      const dto = {
        status: 'IDLE',
      };

      const updated = plainToInstance(MachineDto, {
        id: 1,
        status: dto.status as MachineStatus,
      });

      machinesService.update.mockReturnValueOnce({ data: updated });

      const { body } = await request(app.getHttpServer())
        .patch('/api/machines/123')
        .send(dto)
        .expect(200);

      expect(body.data).toBeDefined();
      expect(body.data.id).toBeUndefined();
      expect(body.data.status).toEqual(updated.status);
    });

    it('throws 400, when provided status is wrong', async () => {
      const dto = {
        status: 'makaron',
        productionRate: 'asdad',
      };

      const { body } = await request(app.getHttpServer())
        .patch('/api/machines/123')
        .send(dto)
        .expect(400);

      expect(body).toBeDefined();
      expect(body.message.length).toEqual(2);
    });

    it('throws 404, machine not found', async () => {
      const dto = {
        status: 'IDLE',
      };

      machinesService.update.mockImplementationOnce(() => {
        throw new NotFoundException('Machine not found');
      });

      const { body } = await request(app.getHttpServer())
        .patch('/api/machines/123')
        .send(dto)
        .expect(404);

      expect(body).toBeDefined();
      expect(body.message).toEqual('Machine not found');
    });
  });

  describe('(DELETE) destroy', () => {
    it('returns 204, no content', async () => {
      await request(app.getHttpServer())
        .delete('/api/machines/123')
        .expect(204);

      expect(machinesService.destroy).toBeCalledTimes(1);
    });

    it('return 404, machine not found', async () => {
      machinesService.destroy.mockImplementationOnce(() => {
        throw new NotFoundException('Machine not found');
      });

      await request(app.getHttpServer())
        .delete('/api/machines/123')
        .expect(404);
    });
  });
});
