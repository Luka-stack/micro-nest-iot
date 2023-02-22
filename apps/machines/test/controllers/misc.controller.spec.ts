import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { MiscController } from '../../src/controllers/misc.controller';
import { MiscService } from '../../src/services/misc.service';
import { TransformInterceptor } from '../../src/transfrom.interceptor';
import { ResponseFiltersDto } from 'apps/machines/src/dto/outcoming/response-filters.dto';

const mockMiscService = () => ({
  getAllFilters: jest.fn(),
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
      const filters: ResponseFiltersDto = {
        data: {
          producents: [{ id: 1, name: 'prod #1' }],
          types: [{ name: 'type #1', producents: ['prod #1'] }],
          models: [{ name: 'model #1', producent: 'prod #1', type: 'type #1' }],
        },
      };

      miscService.getAllFilters.mockReturnValue(filters);

      const { body } = await request(app.getHttpServer())
        .get('/api/misc/filters')
        .expect(200);

      expect(body.data.producents).toBeDefined();
      expect(body.data.types).toBeDefined();
      expect(body.data.models).toBeDefined();
    });
  });
});
