import { Test } from '@nestjs/testing';

import { PrismaService } from '../../src/repositories/prisma.service';
import { MiscRepository } from '../../src/repositories/misc.repository';

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

describe('MiscRepository', () => {
  let miscRepository: MiscRepository;
  let prismaService: PrismaMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MiscRepository,
        {
          provide: PrismaService,
          useFactory: prismaServiceMock,
        },
      ],
    }).compile();

    miscRepository = module.get(MiscRepository);
    prismaService = module.get(PrismaService);
  });

  it('MiscRepository defined', () => {
    expect(miscRepository).toBeDefined();
  });

  describe('find producetns', () => {
    it('returns list of producers', async () => {
      const prodOne = {
        id: 1,
        name: 'Prod #1',
      };

      const prodTwo = {
        id: 2,
        name: 'Prod #2',
      };

      prismaService.producent.findMany.mockReturnValue([prodOne, prodTwo]);

      const producents = await miscRepository.findProducents();

      expect(producents.length).toEqual(2);
      expect(producents[0].id).toEqual(prodOne.id);
      expect(producents[1].name).toEqual(prodTwo.name);
    });
  });

  describe('find types', () => {
    it('returns list of types', async () => {
      const typeOne = {
        id: 1,
        name: 'Type #1',
        producents: [{ name: 'Prod #1' }],
      };

      const typeTwo = {
        id: 2,
        name: 'Type #2',
        producents: [{ name: 'Prod #2' }],
      };

      prismaService.type.findMany.mockReturnValue([typeOne, typeTwo]);

      const types = await miscRepository.findTypesIncludeProducent();

      expect(types.length).toEqual(2);
      expect(types[0].id).toEqual(typeOne.id);
      expect(types[0].producents.length).toBe(1);
      expect(types[1].name).toEqual(typeTwo.name);
    });
  });

  describe('find models', () => {
    it('returns list of models', async () => {
      const modelOne = {
        id: 1,
        name: 'Model #1',
        type: 'Type #1',
        producent: 'Prod #1',
      };

      const modelTwo = {
        id: 2,
        name: 'Model #2',
        type: 'Type #2',
        producent: 'Prod #3',
      };

      prismaService.model.findMany.mockReturnValue([modelOne, modelTwo]);

      const models = await miscRepository.findModelsIncludeRelations();

      expect(models.length).toEqual(2);
      expect(models[0].id).toEqual(modelOne.id);
      expect(models[0].type).toEqual(modelOne.type);
      expect(models[1].name).toEqual(modelTwo.name);
      expect(models[1].producent).toEqual(modelTwo.producent);
    });
  });
});
