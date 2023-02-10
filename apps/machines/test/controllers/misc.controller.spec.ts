import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MachineLabelsBo } from '../../src/bos/machine-labels.bo';
import { MiscController } from '../../src/controllers/misc.controller';
import { MiscService } from '../../src/services/misc.service';
import { TransformInterceptor } from '../../src/transfrom.interceptor';

const mockMiscService = () => ({
  findMachinesLabels: jest.fn(),
});

type MiscServiceMock = ReturnType<typeof mockMiscService>;

describe('MiscController', () => {
  let app: INestApplication;
  let miscService: MiscServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MiscController],
      providers: [
        {
          provide: MiscService,
          useFactory: mockMiscService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalInterceptors(new TransformInterceptor());
    app.setGlobalPrefix('api');

    miscService = module.get(MiscService);

    await app.init();
  });

  describe('(GET) find machines labels', () => {
    it('return machine producents, types and models in one object', async () => {
      const machineLabels = new MachineLabelsBo();
      machineLabels.machineProducents = [{ id: 1, name: 'Prod' }];
      machineLabels.machineTypes = [{ id: 1, name: 'Type', producentId: 1 }];
      machineLabels.machineModels = [{ id: 1, name: 'Model', typeId: 1 }];

      miscService.findMachinesLabels.mockReturnValue(machineLabels);

      const { body } = await request(app.getHttpServer())
        .get('/api/misc/machine-labels')
        .expect(200);

      expect(body.machineProducents).toBeDefined();
      expect(body.machineTypes).toBeDefined();
      expect(body.machineModels).toBeDefined();
    });
  });
});
