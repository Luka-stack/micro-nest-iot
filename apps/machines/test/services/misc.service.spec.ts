import { Test } from '@nestjs/testing';

import { MiscRepository } from '../../src/repositories/misc.repository';
import { MiscService } from '../../src/services/misc.service';

const miscRepositoryMock = () => ({
  findProducents: jest.fn(),
  findTypesIncludeProducent: jest.fn(),
  findModelsIncludeRelations: jest.fn(),
});

type MiscRepositoryMock = ReturnType<typeof miscRepositoryMock>;

describe('MiscService', () => {
  let miscService: MiscService;
  let miscRepository: MiscRepositoryMock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MiscService,
        {
          provide: MiscRepository,
          useFactory: miscRepositoryMock,
        },
      ],
    }).compile();

    miscService = module.get(MiscService);
    miscRepository = module.get(MiscRepository);
  });

  it('MiscService defined', () => {
    expect(miscService).toBeDefined();
  });

  describe('find machine lables', () => {
    it('returns object with producents, types and modules', async () => {
      const producentMock = [
        { id: 1, name: 'Prod #1' },
        { id: 2, name: 'Prod #2' },
      ];

      const typesMock = [
        { id: 1, name: 'Type #1', producents: [{ id: 1, name: 'Prod #1' }] },
        { id: 2, name: 'Type #2', producents: [{ id: 1, name: 'Prod #2' }] },
      ];

      const modelsMock = [
        {
          id: 1,
          name: 'Model #1',
          producent: { name: 'Prod #1' },
          type: { name: 'Type #1' },
        },
        {
          id: 2,
          name: 'Model #2',
          producent: { name: 'Prod #2' },
          type: { name: 'Type #2' },
        },
      ];

      miscRepository.findProducents.mockReturnValue(producentMock);
      miscRepository.findTypesIncludeProducent.mockReturnValue(typesMock);
      miscRepository.findModelsIncludeRelations.mockReturnValue(modelsMock);

      const { data } = await miscService.getAllFilters();

      expect(data.producents.length).toBe(2);
      expect(data.producents[0].name).toEqual(producentMock[0].name);
      expect(data.producents[1].name).toEqual(producentMock[1].name);

      expect(data.types.length).toBe(2);
      expect(data.types[0].name).toStrictEqual(typesMock[0].name);
      expect(data.types[0].producents).toStrictEqual(
        typesMock[0].producents.map((p) => p.name),
      );

      expect(data.models.length).toBe(2);
      expect(data.models[0].name).toStrictEqual(modelsMock[0].name);
      expect(data.models[0].producent).toStrictEqual(
        modelsMock[0].producent.name,
      );
      expect(data.models[0].type).toStrictEqual(modelsMock[0].type.name);
    });
  });
});
