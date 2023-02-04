import { Test } from '@nestjs/testing';

import { PrismaService } from '../../src/database/prisma.service';
import { MiscService } from '../../src/services/misc.service';

const prismaServiceMock = () => ({
  producent: {
    findMany: jest.fn(),
  },
  type: {
    findMany: jest.fn(),
  },
  model: {
    findMany: jest.fn(),
  },
});

type PrismaMock = ReturnType<typeof prismaServiceMock>;

describe('MiscService', () => {
  let miscService: MiscService;
  let prismaService: PrismaMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MiscService,
        {
          provide: PrismaService,
          useFactory: prismaServiceMock,
        },
      ],
    }).compile();

    miscService = module.get(MiscService);
    prismaService = module.get(PrismaService);
  });

  it('MiscService defined', () => {
    expect(miscService).toBeDefined();
  });

  describe('find machine lables', () => {
    it('returns object with producents, types and modules', async () => {
      const producentMock = [
        { id: 1, name: 'Prod #1' },
        { id: 1, name: 'Prod #2' },
      ];

      const typesMock = [
        { id: 1, name: 'Type #1' },
        { id: 2, name: 'Type #2' },
      ];

      const modelsMock = [
        { id: 1, name: 'Model #1' },
        { id: 2, name: 'Model #2' },
      ];

      prismaService.producent.findMany.mockReturnValue(producentMock);
      prismaService.type.findMany.mockReturnValue(typesMock);
      prismaService.model.findMany.mockReturnValue(modelsMock);

      const labels = await miscService.findMachineLabels();

      expect(labels.producents).toStrictEqual(producentMock);
      expect(labels.types).toStrictEqual(typesMock);
      expect(labels.models).toStrictEqual(modelsMock);
    });
  });
});
