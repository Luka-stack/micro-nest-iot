import { Test } from '@nestjs/testing';

import { MiscRepository } from '../../src/repositories/misc.repository';
import { MiscService } from '../../src/services/misc.service';

const miscRepositoryMock = () => ({
  findProducents: jest.fn(),
  findTypes: jest.fn(),
  findModels: jest.fn(),
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

      miscRepository.findProducents.mockReturnValue(producentMock);
      miscRepository.findTypes.mockReturnValue(typesMock);
      miscRepository.findModels.mockReturnValue(modelsMock);

      const labels = await miscService.findMachinesLabels();

      expect(labels.machineProducents).toStrictEqual(producentMock);
      expect(labels.machineTypes).toStrictEqual(typesMock);
      expect(labels.machineModels).toStrictEqual(modelsMock);
    });
  });
});
