import { PrismaClient } from '@prisma/db-machines';

export const seedMachinesDB = async () => {
  const client = new PrismaClient();

  await client.producent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Producent #1',
    },
  });

  await client.producent.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Producent #2',
    },
  });

  await client.type.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Type #1',
      producent: {
        connect: {
          id: 1,
        },
      },
    },
  });

  await client.type.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Type #1',
      producent: {
        connect: {
          id: 2,
        },
      },
    },
  });

  await client.type.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Type #2',
      producent: {
        connect: {
          id: 1,
        },
      },
    },
  });

  await client.model.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Model X',
      type: {
        connect: {
          id: 1,
        },
      },
    },
  });

  await client.model.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Model X',
      type: {
        connect: {
          id: 1,
        },
      },
    },
  });

  await client.model.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Model Y',
      type: {
        connect: {
          id: 3,
        },
      },
    },
  });

  console.info('Machines database seeded');
};
