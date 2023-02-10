import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';

import { MachinesService } from '../../src/services/machines.service';
import { MachinesController } from '../../src/controllers/machines.controller';
import {
  BadRequestException,
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { TransformInterceptor } from '../../src/transfrom.interceptor';
import { MachineBo } from '../../src/bos/machine.bo';
import { MachineStatus } from '../../src/app.types';

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
      const machineBo = new MachineBo();
      machineBo.id = 1;
      machineBo.serialNumber = '1-2-3-4-5';

      machinesService.findOne.mockReturnValueOnce(machineBo);

      // Act
      const { body } = await request(app.getHttpServer())
        .get('/api/machines/1234')
        .expect(200);

      // Assert
      expect(body).toBeDefined();
      expect(body.id).toBeUndefined();
      expect(body.serialNumber).toBe(machineBo.serialNumber);
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

      const machineOne = new MachineBo();
      machineOne.id = 1;
      machineOne.serialNumber = '12345';

      const machineTwo = new MachineBo();
      machineTwo.id = 2;
      machineTwo.serialNumber = '9999';

      machinesService.findMany.mockReturnValueOnce([machineOne, machineTwo]);

      const { body } = await request(app.getHttpServer())
        .get(`/api/machines${query}`)
        .expect(200);

      expect(body).toBeDefined();
      expect(body.length).toEqual(2);
      expect(body[0].id).toBeUndefined();
      expect(body[1].id).toBeUndefined();
      expect(body[0].serialNumber).toEqual(machineOne.serialNumber);
      expect(body[1].serialNumber).toEqual(machineTwo.serialNumber);
    });
  });

  describe('(POST) create', () => {
    it('returns 201 and created machine', async () => {
      const dto = {
        serialNumber: '1-2-3-4',
        producent: 'Producent',
        type: 'Type',
        modelId: 1,
      };

      const createdMachine = new MachineBo();
      createdMachine.id = 123;
      createdMachine.serialNumber = dto.serialNumber;

      machinesService.store.mockReturnValueOnce(createdMachine);

      const { body } = await request(app.getHttpServer())
        .post('/api/machines')
        .send(dto)
        .expect(201);

      expect(body).toBeDefined();
      expect(body.id).toBeUndefined();
      expect(body.serialNumber).toEqual(createdMachine.serialNumber);
    });

    it('thorws 400 when service throw Bad Reqeust', async () => {
      const dto = {
        serialNumber: '1-2-3-4',
        producent: 'Producent',
        type: 'Type',
        modelId: 1,
      };

      machinesService.store.mockImplementationOnce(() => {
        throw new BadRequestException('Wrong modelId');
      });

      const { body } = await request(app.getHttpServer())
        .post('/api/machines')
        .send(dto)
        .expect(400);

      expect(body).toBeDefined();
      expect(body.message).toEqual('Wrong modelId');
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

      const updated = new MachineBo();
      updated.id = 1;
      updated.status = dto.status as MachineStatus;

      machinesService.update.mockReturnValueOnce(updated);

      const { body } = await request(app.getHttpServer())
        .patch('/api/machines/123')
        .send(dto)
        .expect(200);

      expect(body).toBeDefined();
      expect(body.id).toBeUndefined();
      expect(body.status).toEqual(updated.status);
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
