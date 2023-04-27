import { PrismaClient } from '@prisma/db-kepware';

export const seedKepwareDB = async () => {
  const client = new PrismaClient();

  await Promise.all([
    client.machine.create({
      data: {
        serialNumber: '4c48d884-b055',
        status: 'IDLE',
        workBase: 10000,
        workRange: 200,
        faultRate: 0.1,
        minRate: 300,
        maxRate: 180,
        defaultRate: 300,
        productionRate: 300,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: 'f03af55e-b055',
        status: 'IDLE',
        workBase: 10000,
        workRange: 200,
        faultRate: 0.1,
        minRate: 300,
        maxRate: 180,
        defaultRate: 300,
        productionRate: 300,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e068-b055',
        status: 'IDLE',
        productionRate: 300,
        workBase: 10000,
        workRange: 200,
        faultRate: 0.1,
        minRate: 300,
        maxRate: 180,
        defaultRate: 300,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e202-b055',
        status: 'IDLE',
        productionRate: 300,
        workBase: 10000,
        workRange: 200,
        faultRate: 0.1,
        minRate: 300,
        maxRate: 180,
        defaultRate: 300,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: 'f03afd24-b055',
        status: 'IDLE',
        productionRate: 180,
        workBase: 10000,
        workRange: 200,
        faultRate: 0.1,
        minRate: 240,
        maxRate: 180,
        defaultRate: 180,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e360-b055',
        status: 'IDLE',
        productionRate: 180,
        workBase: 10000,
        workRange: 200,
        faultRate: 0.1,
        minRate: 240,
        maxRate: 180,
        defaultRate: 180,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e4c8-b055',
        status: 'IDLE',
        productionRate: 300,
        workBase: 7000,
        workRange: 100,
        faultRate: 0.1,
        minRate: 300,
        maxRate: 180,
        defaultRate: 300,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e626-b055',
        status: 'IDLE',
        productionRate: 300,
        workBase: 7000,
        workRange: 100,
        faultRate: 0.1,
        minRate: 300,
        maxRate: 180,
        defaultRate: 300,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e77a-b055',
        status: 'IDLE',
        productionRate: 180,
        workBase: 7000,
        workRange: 100,
        faultRate: 0.1,
        minRate: 240,
        maxRate: 60,
        defaultRate: 180,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e8d8-b055',
        status: 'IDLE',
        productionRate: 180,
        workBase: 7000,
        workRange: 100,
        faultRate: 0.1,
        minRate: 240,
        maxRate: 60,
        defaultRate: 180,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48ec48-b055',
        status: 'IDLE',
        productionRate: 300,
        workBase: 20000,
        workRange: 500,
        faultRate: 0.1,
        minRate: 300,
        maxRate: 180,
        defaultRate: 300,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48edc4-b055',
        status: 'IDLE',
        productionRate: 300,
        workBase: 20000,
        workRange: 500,
        faultRate: 0.1,
        minRate: 300,
        maxRate: 180,
        defaultRate: 300,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48fb66-b055',
        status: 'IDLE',
        productionRate: 180,
        workBase: 20000,
        workRange: 500,
        faultRate: 0.1,
        minRate: 240,
        maxRate: 60,
        defaultRate: 180,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48fa26-b055',
        status: 'IDLE',
        productionRate: 180,
        workBase: 20000,
        workRange: 500,
        faultRate: 0.1,
        minRate: 240,
        maxRate: 60,
        defaultRate: 180,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48f8c8-b055',
        status: 'IDLE',
        productionRate: 240,
        workBase: 7500,
        workRange: 10,
        faultRate: 0.1,
        minRate: 300,
        maxRate: 240,
        defaultRate: 240,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48f774-b055',
        status: 'IDLE',
        productionRate: 240,
        workBase: 7500,
        workRange: 10,
        faultRate: 0.1,
        minRate: 300,
        maxRate: 240,
        defaultRate: 240,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '87e6b0b2-b055',
        status: 'IDLE',
        productionRate: 240,
        workBase: 12500,
        workRange: 100,
        faultRate: 0.1,
        minRate: 240,
        maxRate: 240,
        defaultRate: 240,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '87e6b378-b055',
        status: 'IDLE',
        productionRate: 240,
        workBase: 12500,
        workRange: 100,
        faultRate: 0.1,
        minRate: 240,
        maxRate: 240,
        defaultRate: 240,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '87e6b6e8-b055',
        status: 'IDLE',
        productionRate: 240,
        workBase: 12500,
        workRange: 100,
        faultRate: 0.1,
        minRate: 60,
        maxRate: 360,
        defaultRate: 240,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '87e6b7f6-b055',
        status: 'IDLE',
        productionRate: 240,
        workBase: 12500,
        workRange: 100,
        faultRate: 0.1,
        minRate: 60,
        maxRate: 360,
        defaultRate: 240,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '20beb7c2-cffa',
        status: 'IDLE',
        productionRate: 360,
        workBase: 30000,
        workRange: 1000,
        faultRate: 0.1,
        minRate: 360,
        maxRate: 360,
        defaultRate: 360,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: 'ac829b22-2df5',
        status: 'IDLE',
        productionRate: 360,
        workBase: 30000,
        workRange: 1000,
        faultRate: 0.1,
        minRate: 360,
        maxRate: 360,
        defaultRate: 360,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4d152653-1c00',
        status: 'IDLE',
        productionRate: 300,
        workBase: 30000,
        workRange: 1000,
        faultRate: 0.1,
        minRate: 360,
        maxRate: 180,
        defaultRate: 300,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '93fc2e47-2994',
        status: 'IDLE',
        productionRate: 300,
        workBase: 30000,
        workRange: 1000,
        faultRate: 0.1,
        minRate: 360,
        maxRate: 180,
        defaultRate: 300,
        version: 1,
      },
    }),
  ]);

  console.info('Kepware database seeded');
};
