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

  await client.type.create({
    data: {
      name: 'Grabers',
      producents: {
        connect: [
          {
            name: 'Fanuc',
          },
          {
            name: 'Yaskawa Motoman',
          },
          {
            name: 'ABB',
          },
          {
            name: 'Kawasaki',
          },
        ],
      },
    },
  });

  await client.type.create({
    data: {
      name: 'Multies',
      producents: {
        connect: [
          {
            name: 'Fanuc',
          },
          {
            name: 'Yaskawa Motoman',
          },
          {
            name: 'ABB',
          },
          {
            name: 'Kawasaki',
          },
        ],
      },
    },
  });

  await client.type.create({
    data: {
      name: 'Boxers',
      producents: {
        connect: [
          {
            name: 'ABB',
          },
          {
            name: 'Kawasaki',
          },
        ],
      },
    },
  });

  await client.model.create({
    data: {
      name: 'fanuc-oh-g-123',
      type: {
        connect: {
          name: 'Grabers',
        },
      },
      producent: {
        connect: {
          name: 'Fanuc',
        },
      },
    },
  });

  await client.model.create({
    data: {
      name: 'fanuc-oh-m-123',
      type: {
        connect: {
          name: 'Multies',
        },
      },
      producent: {
        connect: {
          name: 'Fanuc',
        },
      },
    },
  });

  await client.model.create({
    data: {
      name: 'yask-oh-g-123',
      type: {
        connect: {
          name: 'Grabers',
        },
      },
      producent: {
        connect: {
          name: 'Yaskawa Motoman',
        },
      },
    },
  });

  await client.model.create({
    data: {
      name: 'yask-oh-m-123',
      type: {
        connect: {
          name: 'Multies',
        },
      },
      producent: {
        connect: {
          name: 'Yaskawa Motoman',
        },
      },
    },
  });

  await client.model.create({
    data: {
      name: 'abb-oh-g-123',
      type: {
        connect: {
          name: 'Grabers',
        },
      },
      producent: {
        connect: {
          name: 'ABB',
        },
      },
    },
  });

  await client.model.create({
    data: {
      name: 'abb-oh-m-123',
      type: {
        connect: {
          name: 'Multies',
        },
      },
      producent: {
        connect: {
          name: 'ABB',
        },
      },
    },
  });

  await client.model.create({
    data: {
      name: 'abb-oh-b-123',
      type: {
        connect: {
          name: 'Boxers',
        },
      },
      producent: {
        connect: {
          name: 'ABB',
        },
      },
    },
  });

  await client.model.create({
    data: {
      name: 'kaw-oh-g-123',
      type: {
        connect: {
          name: 'Grabers',
        },
      },
      producent: {
        connect: {
          name: 'Kawasaki',
        },
      },
    },
  });

  await client.model.create({
    data: {
      name: 'kaw-oh-m-123',
      type: {
        connect: {
          name: 'Multies',
        },
      },
      producent: {
        connect: {
          name: 'Kawasaki',
        },
      },
    },
  });

  await client.model.create({
    data: {
      name: 'kaw-oh-b-123',
      type: {
        connect: {
          name: 'Boxers',
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
        serialNumber: '4c48d884-b055-11ed-afa1',
        imageUrl: 'machine.png',
        producent: 'Fanuc',
        type: 'Grabers',
        model: 'fanuc-oh-g-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: 'f03af55e-b055-11ed-afa1',
        imageUrl: 'machine.png',
        producent: 'Fanuc',
        type: 'Grabers',
        model: 'fanuc-oh-g-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '4c48e068-b055-11ed-afa1',
        imageUrl: 'machine1.png',
        producent: 'Fanuc',
        type: 'Multies',
        model: 'fanuc-oh-m-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '4c48e202-b055-11ed-afa1',
        imageUrl: 'machine1.png',
        producent: 'Fanuc',
        type: 'Multies',
        model: 'fanuc-oh-m-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: 'f03afd24-b055-11ed-afa1',
        imageUrl: 'machine.png',
        producent: 'Yaskawa Motoman',
        type: 'Grabers',
        model: 'yask-oh-g-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '4c48e360-b055-11ed-afa1',
        imageUrl: 'machine.png',
        producent: 'Yaskawa Motoman',
        type: 'Grabers',
        model: 'fanuc-oh-g-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '4c48e4c8-b055-11ed-afa1',
        imageUrl: 'machine1.png',
        producent: 'Yaskawa Motoman',
        type: 'Multies',
        model: 'fanuc-oh-m-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '4c48e626-b055-11ed-afa1',
        imageUrl: 'machine1.png',
        producent: 'Yaskawa Motoman',
        type: 'Multies',
        model: 'fanuc-oh-m-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '4c48e77a-b055-11ed-afa1',
        imageUrl: 'machine.png',
        producent: 'ABB',
        type: 'Grabers',
        model: 'abb-oh-g-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '4c48e8d8-b055-11ed-afa1',
        imageUrl: 'machine.png',
        producent: 'ABB',
        type: 'Grabers',
        model: 'abb-oh-g-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '4c48ec48-b055-11ed-afa1',
        imageUrl: 'machine1.png',
        producent: 'ABB',
        type: 'Multies',
        model: 'abb-oh-m-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '4c48edc4-b055-11ed-afa1',
        imageUrl: 'machine1.png',
        producent: 'ABB',
        type: 'Multies',
        model: 'abb-oh-m-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '4c48fb66-b055-11ed-afa1',
        imageUrl: 'machine2.png',
        producent: 'ABB',
        type: 'Boxers',
        model: 'abb-oh-b-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '4c48fa26-b055-11ed-afa1',
        imageUrl: 'machine2.png',
        producent: 'ABB',
        type: 'Boxers',
        model: 'abb-oh-b-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '4c48f8c8-b055-11ed-afa1',
        imageUrl: 'machine.png',
        producent: 'Kawasaki',
        type: 'Grabers',
        model: 'kaw-oh-g-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '4c48f774-b055-11ed-afa1',
        imageUrl: 'machine.png',
        producent: 'Kawasaki',
        type: 'Grabers',
        model: 'kaw-oh-g-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '87e6b0b2-b055-11ed-afa1',
        imageUrl: 'machine1.png',
        producent: 'Kawasaki',
        type: 'Multies',
        model: 'kaw-oh-m-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '87e6b378-b055-11ed-afa1',
        imageUrl: 'machine1.png',
        producent: 'Kawasaki',
        type: 'Multies',
        model: 'kaw-oh-m-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '87e6b6e8-b055-11ed-afa1',
        imageUrl: 'machine3.png',
        producent: 'Kawasaki',
        type: 'Boxers',
        model: 'kaw-oh-b-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
      {
        serialNumber: '87e6b7f6-b055-11ed-afa1',
        imageUrl: 'machine3.png',
        producent: 'Kawasaki',
        type: 'Boxers',
        model: 'kaw-oh-b-123',
        status: 'IDLE',
        productionRate: 10,
        version: 1,
      },
    ],
  });

  console.info('Machines database seeded');
};
