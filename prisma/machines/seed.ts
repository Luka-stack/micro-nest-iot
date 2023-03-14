import { PrismaClient } from '@prisma/db-machines';

export const seedMachinesDB = async () => {
  const client = new PrismaClient();

  await client.producent.createMany({
    data: [
      { name: 'Fanuc' },
      { name: 'Yaskawa Motoman' },
      { name: 'ABB' },
      { name: 'Kawasaki' },
    ],
  });

  const grabber = await client.type.create({
    data: {
      name: 'Grabers',
      imageUrl: 'machine.png',
      producents: {
        connect: [
          {
            name: 'Fanuc',
          },
          {
            name: 'ABB',
          },
        ],
      },
    },
  });

  const multi = await client.type.create({
    data: {
      name: 'Multies',
      imageUrl: 'machine1.png',
      producents: {
        connect: [
          {
            name: 'Fanuc',
          },
          {
            name: 'Yaskawa Motoman',
          },
        ],
      },
    },
  });

  const boxer = await client.type.create({
    data: {
      name: 'Boxers',
      imageUrl: 'machine2.png',
      producents: {
        connect: [
          {
            name: 'Fanuc',
          },
          {
            name: 'Kawasaki',
          },
        ],
      },
    },
  });

  const fanucXGX = await client.model.create({
    data: {
      name: 'fnc-XGX',
      workBase: 1000,
      workRange: 50,
      faultRate: 0.1,
      defaultRate: 60,
      type: {
        connect: {
          id: grabber.id,
        },
      },
      producent: {
        connect: {
          name: 'Fanuc',
        },
      },
    },
  });

  const fanucXGY = await client.model.create({
    data: {
      name: 'fnc-XGY',
      workBase: 1200,
      workRange: 200,
      faultRate: 0.1,
      defaultRate: 50,
      type: {
        connect: {
          id: grabber.id,
        },
      },
      producent: {
        connect: {
          name: 'Fanuc',
        },
      },
    },
  });

  const fanucMMM = await client.model.create({
    data: {
      name: 'fnc-MMM',
      workBase: 500,
      workRange: 100,
      faultRate: 0.1,
      defaultRate: 60,
      type: {
        connect: {
          id: multi.id,
        },
      },
      producent: {
        connect: {
          name: 'Fanuc',
        },
      },
    },
  });

  const fanucNMN = await client.model.create({
    data: {
      name: 'fnc-NMN',
      workBase: 400,
      workRange: 30,
      faultRate: 0.1,
      defaultRate: 30,
      type: {
        connect: {
          id: multi.id,
        },
      },
      producent: {
        connect: {
          name: 'Fanuc',
        },
      },
    },
  });

  const fanucXBOX = await client.model.create({
    data: {
      name: 'fnc-XBOX',
      workBase: 800,
      workRange: 30,
      faultRate: 0.1,
      defaultRate: 30,
      type: {
        connect: {
          id: boxer.id,
        },
      },
      producent: {
        connect: {
          name: 'Fanuc',
        },
      },
    },
  });

  const fanucYBOX = await client.model.create({
    data: {
      name: 'fnc-YBOX',
      workBase: 1000,
      workRange: 200,
      faultRate: 0.1,
      defaultRate: 60,
      type: {
        connect: {
          id: boxer.id,
        },
      },
      producent: {
        connect: {
          name: 'Fanuc',
        },
      },
    },
  });

  const yaskawaAlle = await client.model.create({
    data: {
      name: 'yaska-alle',
      workBase: 1000,
      workRange: 50,
      faultRate: 0.1,
      defaultRate: 20,
      type: {
        connect: {
          id: multi.id,
        },
      },
      producent: {
        connect: {
          name: 'Yaskawa Motoman',
        },
      },
    },
  });

  const abbG10 = await client.model.create({
    data: {
      name: 'abb-G10',
      workBase: 800,
      workRange: 10,
      faultRate: 0.1,
      defaultRate: 20,
      type: {
        connect: {
          id: grabber.id,
        },
      },
      producent: {
        connect: {
          name: 'ABB',
        },
      },
    },
  });

  const abbG12 = await client.model.create({
    data: {
      name: 'abb-G12',
      workBase: 1000,
      workRange: 10,
      faultRate: 0.1,
      defaultRate: 20,
      type: {
        connect: {
          id: grabber.id,
        },
      },
      producent: {
        connect: {
          name: 'ABB',
        },
      },
    },
  });

  const kawaSashi = await client.model.create({
    data: {
      name: 'kawa-sashi',
      workBase: 800,
      workRange: 100,
      faultRate: 0.1,
      defaultRate: 60,
      type: {
        connect: {
          id: boxer.id,
        },
      },
      producent: {
        connect: {
          name: 'Kawasaki',
        },
      },
    },
  });

  const kawaHarro = await client.model.create({
    data: {
      name: 'kawa-harro',
      workBase: 1000,
      workRange: 100,
      faultRate: 0.1,
      defaultRate: 60,
      type: {
        connect: {
          id: boxer.id,
        },
      },
      producent: {
        connect: {
          name: 'Kawasaki',
        },
      },
    },
  });

  await client.machine.createMany({
    data: [
      {
        serialNumber: '4c48d884-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucXGX.defaultRate,
        typeId: grabber.id,
        modelId: fanucXGX.id,
        version: 1,
      },
      {
        serialNumber: 'f03af55e-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucXGX.defaultRate,
        typeId: grabber.id,
        modelId: fanucXGX.id,
        version: 1,
      },
      {
        serialNumber: '4c48e068-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucXGX.defaultRate,
        typeId: grabber.id,
        modelId: fanucXGX.id,
        version: 1,
      },
      {
        serialNumber: '4c48e202-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucXGX.defaultRate,
        typeId: grabber.id,
        modelId: fanucXGX.id,
        version: 1,
      },
      {
        serialNumber: 'f03afd24-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucXGY.defaultRate,
        typeId: grabber.id,
        modelId: fanucXGY.id,
        version: 1,
      },
      {
        serialNumber: '4c48e360-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucXGY.defaultRate,
        typeId: grabber.id,
        modelId: fanucXGY.id,
        version: 1,
      },
      {
        serialNumber: '4c48e4c8-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucMMM.defaultRate,
        typeId: multi.id,
        modelId: fanucMMM.id,
        version: 1,
      },
      {
        serialNumber: '4c48e626-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucMMM.defaultRate,
        typeId: multi.id,
        modelId: fanucMMM.id,
        version: 1,
      },
      {
        serialNumber: '4c48e77a-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucNMN.defaultRate,
        typeId: multi.id,
        modelId: fanucNMN.id,
        version: 1,
      },
      {
        serialNumber: '4c48e8d8-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucNMN.defaultRate,
        typeId: multi.id,
        modelId: fanucNMN.id,
        version: 1,
      },
      {
        serialNumber: '4c48ec48-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucXBOX.defaultRate,
        typeId: boxer.id,
        modelId: fanucXBOX.id,
        version: 1,
      },
      {
        serialNumber: '4c48edc4-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucXBOX.defaultRate,
        typeId: boxer.id,
        modelId: fanucXBOX.id,
        version: 1,
      },
      {
        serialNumber: '4c48fb66-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucYBOX.defaultRate,
        typeId: boxer.id,
        modelId: fanucYBOX.id,
        version: 1,
      },
      {
        serialNumber: '4c48fa26-b055',
        producent: 'Fanuc',
        status: 'IDLE',
        productionRate: fanucYBOX.defaultRate,
        typeId: boxer.id,
        modelId: fanucYBOX.id,
        version: 1,
      },
      {
        serialNumber: '4c48f8c8-b055',
        producent: 'Yaskawa Motoman',
        status: 'IDLE',
        productionRate: yaskawaAlle.defaultRate,
        typeId: multi.id,
        modelId: yaskawaAlle.id,
        version: 1,
      },
      {
        serialNumber: '4c48f774-b055',
        producent: 'Yaskawa Motoman',
        status: 'IDLE',
        productionRate: yaskawaAlle.defaultRate,
        typeId: multi.id,
        modelId: yaskawaAlle.id,
        version: 1,
      },
      {
        serialNumber: '87e6b0b2-b055',
        producent: 'ABB',
        status: 'IDLE',
        productionRate: abbG10.defaultRate,
        typeId: grabber.id,
        modelId: abbG10.id,
        version: 1,
      },
      {
        serialNumber: '87e6b378-b055',
        producent: 'ABB',
        status: 'IDLE',
        productionRate: abbG10.defaultRate,
        typeId: grabber.id,
        modelId: abbG10.id,
        version: 1,
      },
      {
        serialNumber: '87e6b6e8-b055',
        producent: 'ABB',
        status: 'IDLE',
        productionRate: abbG12.defaultRate,
        typeId: grabber.id,
        modelId: abbG12.id,
        version: 1,
      },
      {
        serialNumber: '87e6b7f6-b055',
        producent: 'ABB',
        status: 'IDLE',
        productionRate: abbG12.defaultRate,
        typeId: grabber.id,
        modelId: abbG12.id,
        version: 1,
      },
      {
        serialNumber: '20beb7c2-cffa',
        producent: 'Kawasaki',
        status: 'IDLE',
        productionRate: kawaSashi.defaultRate,
        typeId: boxer.id,
        modelId: kawaSashi.id,
        version: 1,
      },
      {
        serialNumber: 'ac829b22-2df5',
        producent: 'Kawasaki',
        status: 'IDLE',
        productionRate: kawaSashi.defaultRate,
        typeId: boxer.id,
        modelId: kawaSashi.id,
        version: 1,
      },
      {
        serialNumber: '4d152653-1c00',
        producent: 'Kawasaki',
        status: 'IDLE',
        productionRate: kawaHarro.defaultRate,
        typeId: boxer.id,
        modelId: kawaHarro.id,
        version: 1,
      },
      {
        serialNumber: '93fc2e47-2994',
        producent: 'Kawasaki',
        status: 'IDLE',
        productionRate: kawaHarro.defaultRate,
        typeId: boxer.id,
        modelId: kawaHarro.id,
        version: 1,
      },
    ],
  });

  console.info('Machines database seeded');
};
