import { PrismaClient } from '@prisma/db-kepware';

export const seedKepwareDB = async () => {
  const client = new PrismaClient();

  await Promise.all([
    client.machine.create({
      data: {
        serialNumber: '4c48d884-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 1000,
        workRange: 50,
        faultRate: 0.1,
        defaultRate: 60,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: 'f03af55e-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 1000,
        workRange: 50,
        faultRate: 0.1,
        defaultRate: 60,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e068-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 1000,
        workRange: 50,
        faultRate: 0.1,
        defaultRate: 60,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e202-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 1000,
        workRange: 50,
        faultRate: 0.1,
        defaultRate: 60,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: 'f03afd24-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 1200,
        workRange: 200,
        faultRate: 0.1,
        defaultRate: 50,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e360-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 1200,
        workRange: 200,
        faultRate: 0.1,
        defaultRate: 50,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e4c8-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 500,
        workRange: 100,
        faultRate: 0.1,
        defaultRate: 60,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e626-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 500,
        workRange: 100,
        faultRate: 0.1,
        defaultRate: 60,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e77a-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 400,
        workRange: 30,
        faultRate: 0.1,
        defaultRate: 30,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e8d8-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 400,
        workRange: 30,
        faultRate: 0.1,
        defaultRate: 30,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48ec48-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 800,
        workRange: 30,
        faultRate: 0.1,
        defaultRate: 30,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48edc4-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 800,
        workRange: 30,
        faultRate: 0.1,
        defaultRate: 30,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48fb66-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 1000,
        workRange: 200,
        faultRate: 0.1,
        defaultRate: 60,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48fa26-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 1000,
        workRange: 200,
        faultRate: 0.1,
        defaultRate: 60,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48f8c8-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 1000,
        workRange: 50,
        faultRate: 0.1,
        defaultRate: 20,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48f774-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 1000,
        workRange: 50,
        faultRate: 0.1,
        defaultRate: 20,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '87e6b0b2-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 800,
        workRange: 10,
        faultRate: 0.1,
        defaultRate: 20,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '87e6b378-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 800,
        workRange: 10,
        faultRate: 0.1,
        defaultRate: 20,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '87e6b6e8-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 1000,
        workRange: 10,
        faultRate: 0.1,
        defaultRate: 20,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '87e6b7f6-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 1000,
        workRange: 10,
        faultRate: 0.1,
        defaultRate: 20,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '20beb7c2-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 800,
        workRange: 100,
        faultRate: 0.1,
        defaultRate: 60,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: 'ac829b22-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 800,
        workRange: 100,
        faultRate: 0.1,
        defaultRate: 60,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4d152653-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 1000,
        workRange: 100,
        faultRate: 0.1,
        defaultRate: 60,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '93fc2e47-b055',
        status: 'IDLE',
        productionRate: 60,
        workBase: 800,
        workRange: 100,
        faultRate: 0.1,
        defaultRate: 60,
        version: 1,
      },
    }),
  ]);

  console.info('Kepware database seeded');
};
