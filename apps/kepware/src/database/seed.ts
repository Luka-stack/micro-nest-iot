import { PrismaClient } from '@prisma/db-kepware';

async function main() {
  console.log('🌱 Seeding... 🌱');

  const client = new PrismaClient();

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await Promise.all([
    client.machine.create({
      data: {
        serialNumber: '4c48d884-b055',
        status: 'IDLE',
        workBase: 10000,
        workRange: 200,
        faultRate: 0.1,
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
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
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e068-b055',
        status: 'IDLE',
        workBase: 10000,
        workRange: 200,
        faultRate: 0.1,
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e202-b055',
        status: 'IDLE',
        workBase: 10000,
        workRange: 200,
        faultRate: 0.1,
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: 'f03afd24-b055',
        status: 'IDLE',
        workBase: 10000,
        workRange: 200,
        faultRate: 0.1,
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e360-b055',
        status: 'IDLE',
        workBase: 10000,
        workRange: 200,
        faultRate: 0.1,
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e4c8-b055',
        status: 'IDLE',
        workBase: 7000,
        workRange: 100,
        faultRate: 0.1,
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e626-b055',
        status: 'IDLE',
        workBase: 7000,
        workRange: 100,
        faultRate: 0.1,
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e77a-b055',
        status: 'IDLE',
        workBase: 7000,
        workRange: 100,
        faultRate: 0.1,
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48e8d8-b055',
        status: 'IDLE',
        workBase: 7000,
        workRange: 100,
        faultRate: 0.1,
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48ec48-b055',
        status: 'IDLE',
        workBase: 20000,
        workRange: 500,
        faultRate: 0.1,
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48edc4-b055',
        status: 'IDLE',
        workBase: 20000,
        workRange: 500,
        faultRate: 0.1,
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48fb66-b055',
        status: 'IDLE',
        workBase: 20000,
        workRange: 500,
        faultRate: 0.1,
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48fa26-b055',
        status: 'IDLE',
        workBase: 20000,
        workRange: 500,
        faultRate: 0.1,
        minRate: 420,
        maxRate: 240,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48f8c8-b055',
        status: 'IDLE',
        workBase: 7500,
        workRange: 10,
        faultRate: 0.3,
        minRate: 420,
        maxRate: 180,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4c48f774-b055',
        status: 'IDLE',
        workBase: 7500,
        workRange: 10,
        faultRate: 0.3,
        minRate: 420,
        maxRate: 180,
        defaultRate: 360,
        productionRate: 360,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '87e6b0b2-b055',
        status: 'IDLE',
        workBase: 12500,
        workRange: 100,
        faultRate: 0.25,
        minRate: 360,
        maxRate: 300,
        defaultRate: 120,
        productionRate: 120,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '87e6b378-b055',
        status: 'IDLE',
        workBase: 12500,
        workRange: 100,
        faultRate: 0.25,
        minRate: 360,
        maxRate: 300,
        defaultRate: 120,
        productionRate: 120,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '87e6b6e8-b055',
        status: 'IDLE',
        workBase: 12500,
        workRange: 100,
        faultRate: 0.25,
        minRate: 360,
        maxRate: 300,
        defaultRate: 120,
        productionRate: 120,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '87e6b7f6-b055',
        status: 'IDLE',
        workBase: 12500,
        workRange: 100,
        faultRate: 0.25,
        minRate: 360,
        maxRate: 300,
        defaultRate: 120,
        productionRate: 120,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '20beb7c2-cffa',
        status: 'IDLE',
        workBase: 30000,
        workRange: 1000,
        faultRate: 0.25,
        minRate: 360,
        maxRate: 300,
        defaultRate: 120,
        productionRate: 120,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: 'ac829b22-2df5',
        status: 'IDLE',
        workBase: 30000,
        workRange: 1000,
        faultRate: 0.25,
        minRate: 360,
        maxRate: 300,
        defaultRate: 120,
        productionRate: 120,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '4d152653-1c00',
        status: 'IDLE',
        workBase: 30000,
        workRange: 1000,
        faultRate: 0.25,
        minRate: 360,
        maxRate: 300,
        defaultRate: 120,
        productionRate: 120,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),

    client.machine.create({
      data: {
        serialNumber: '93fc2e47-2994',
        status: 'IDLE',
        workBase: 30000,
        workRange: 1000,
        faultRate: 0.25,
        minRate: 360,
        maxRate: 300,
        defaultRate: 120,
        productionRate: 120,
        nextMaintenance: nextMonth,
        version: 1,
      },
    }),
  ]);

  console.log('🌱 Finished Seeding 🌱');
  process.exit(0);
}

main();
