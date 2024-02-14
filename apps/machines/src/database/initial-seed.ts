import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import {
  PGMachine,
  PGMachineMaintainInfo,
  PGModel,
  PGProducent,
  PGProducentsToTypes,
  PGType,
} from './schema';

const seedClient = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(seedClient);

async function seedMachineDB() {
  console.log('🌱 Seeding... 🌱');

  // Create Producents
  const [fanuc, yaskawa, abb, kawasaki] = await db
    .insert(PGProducent)
    .values([
      { name: 'Fanuc' },
      { name: 'Yaskawa Motoman' },
      { name: 'ABB' },
      { name: 'Kawasaki' },
    ])
    .returning();

  // Create Types
  const [grabers, multies, boxers] = await db
    .insert(PGType)
    .values([
      {
        name: 'Grabers',
        imageUrl: 'machine.png',
      },
      {
        name: 'Multies',
        imageUrl: 'machine1.png',
      },
      {
        name: 'Boxers',
        imageUrl: 'machine2.png',
      },
    ])
    .returning();

  // Create Connection Between Producetn and Types
  await db.insert(PGProducentsToTypes).values([
    {
      producentId: fanuc.id,
      typeId: grabers.id,
    },
    {
      producentId: abb.id,
      typeId: grabers.id,
    },
    {
      producentId: fanuc.id,
      typeId: multies.id,
    },
    {
      producentId: yaskawa.id,
      typeId: multies.id,
    },
    {
      typeId: boxers.id,
      producentId: fanuc.id,
    },
    {
      typeId: boxers.id,
      producentId: kawasaki.id,
    },
  ]);

  // Create Models
  const fanucXGX = await db
    .insert(PGModel)
    .values({
      name: 'fnc-XGX',
      workBase: 10000,
      workRange: 200,
      faultRate: 0.1,
      minRate: 420,
      maxRate: 240,
      defaultRate: 360,
      producentId: fanuc.id,
      typeId: grabers.id,
    })
    .returning();

  const fanucXGY = await db
    .insert(PGModel)
    .values({
      name: 'fnc-XGY',
      workBase: 10000,
      workRange: 200,
      faultRate: 0.1,
      minRate: 420,
      maxRate: 240,
      defaultRate: 360,
      producentId: fanuc.id,
      typeId: grabers.id,
    })
    .returning();

  const fanucMMM = await db
    .insert(PGModel)
    .values({
      name: 'fnc-MMM',
      workBase: 7000,
      workRange: 100,
      faultRate: 0.1,
      minRate: 420,
      maxRate: 240,
      defaultRate: 360,
      producentId: fanuc.id,
      typeId: multies.id,
    })
    .returning();

  const fanucNMN = await db
    .insert(PGModel)
    .values({
      name: 'fnc-NMN',
      workBase: 7000,
      workRange: 100,
      faultRate: 0.1,
      minRate: 420,
      maxRate: 240,
      defaultRate: 360,
      producentId: fanuc.id,
      typeId: multies.id,
    })
    .returning();

  const fanucXBOX = await db
    .insert(PGModel)
    .values({
      name: 'fnc-XBOX',
      workBase: 20000,
      workRange: 500,
      faultRate: 0.1,
      minRate: 420,
      maxRate: 240,
      defaultRate: 360,
      producentId: fanuc.id,
      typeId: boxers.id,
    })
    .returning();

  const fanucYBOX = await db
    .insert(PGModel)
    .values({
      name: 'fnc-YBOX',
      workBase: 20000,
      workRange: 500,
      faultRate: 0.1,
      minRate: 420,
      maxRate: 240,
      defaultRate: 360,
      producentId: fanuc.id,
      typeId: boxers.id,
    })
    .returning();

  const yaskawaAlle = await db
    .insert(PGModel)
    .values({
      name: 'yaska-alle',
      workBase: 7500,
      workRange: 10,
      faultRate: 0.3,
      minRate: 420,
      maxRate: 180,
      defaultRate: 360,
      producentId: yaskawa.id,
      typeId: multies.id,
    })
    .returning();

  const abbG10 = await db
    .insert(PGModel)
    .values({
      name: 'abb-G10',
      workBase: 12500,
      workRange: 100,
      faultRate: 0.2,
      minRate: 360,
      maxRate: 120,
      defaultRate: 300,
      producentId: abb.id,
      typeId: grabers.id,
    })
    .returning();

  const abbG12 = await db
    .insert(PGModel)
    .values({
      name: 'abb-G12',
      workBase: 12500,
      workRange: 100,
      faultRate: 0.2,
      minRate: 360,
      maxRate: 120,
      defaultRate: 300,
      producentId: abb.id,
      typeId: grabers.id,
    })
    .returning();

  const kawaSashi = await db
    .insert(PGModel)
    .values({
      name: 'kawa-sashi',
      workBase: 30000,
      workRange: 1000,
      faultRate: 0.25,
      minRate: 360,
      maxRate: 300,
      defaultRate: 360,
      producentId: kawasaki.id,
      typeId: boxers.id,
    })
    .returning();

  const kawaHarro = await db
    .insert(PGModel)
    .values({
      name: 'kawa-harro',
      workBase: 30000,
      workRange: 1000,
      faultRate: 0.25,
      minRate: 360,
      maxRate: 300,
      defaultRate: 360,
      producentId: kawasaki.id,
      typeId: boxers.id,
    })
    .returning();

  // Create Machines
  await db.insert(PGMachine).values([
    {
      serialNumber: '4c48d884-b055',
      producent: 'Fanuc',
      type: grabers.name,
      model: fanucXGX[0].name,
      productionRate: fanucXGX[0].defaultRate,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: 'f03af55e-b055',
      producent: 'Fanuc',
      productionRate: fanucXGX[0].defaultRate,
      type: grabers.name,
      model: fanucXGX[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4c48e068-b055',
      producent: 'Fanuc',
      productionRate: fanucXGX[0].defaultRate,
      type: grabers.name,
      model: fanucXGX[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4c48e202-b055',
      producent: 'Fanuc',
      productionRate: fanucXGX[0].defaultRate,
      type: grabers.name,
      model: fanucXGX[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: 'f03afd24-b055',
      producent: 'Fanuc',
      productionRate: fanucXGY[0].defaultRate,
      type: grabers.name,
      model: fanucXGY[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4c48e360-b055',
      producent: 'Fanuc',
      productionRate: fanucXGY[0].defaultRate,
      type: grabers.name,
      model: fanucXGY[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4c48e4c8-b055',
      producent: 'Fanuc',
      productionRate: fanucMMM[0].defaultRate,
      type: multies.name,
      model: fanucMMM[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4c48e626-b055',
      producent: 'Fanuc',
      productionRate: fanucMMM[0].defaultRate,
      type: multies.name,
      model: fanucMMM[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4c48e77a-b055',
      producent: 'Fanuc',
      productionRate: fanucNMN[0].defaultRate,
      type: multies.name,
      model: fanucNMN[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4c48e8d8-b055',
      producent: 'Fanuc',
      productionRate: fanucNMN[0].defaultRate,
      type: multies.name,
      model: fanucNMN[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4c48ec48-b055',
      producent: 'Fanuc',
      productionRate: fanucXBOX[0].defaultRate,
      type: boxers.name,
      model: fanucXBOX[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4c48edc4-b055',
      producent: 'Fanuc',
      productionRate: fanucXBOX[0].defaultRate,
      type: boxers.name,
      model: fanucXBOX[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4c48fb66-b055',
      producent: 'Fanuc',
      productionRate: fanucYBOX[0].defaultRate,
      type: boxers.name,
      model: fanucYBOX[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4c48fa26-b055',
      producent: 'Fanuc',
      productionRate: fanucYBOX[0].defaultRate,
      type: boxers.name,
      model: fanucYBOX[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4c48f8c8-b055',
      producent: 'Yaskawa Motoman',
      productionRate: yaskawaAlle[0].defaultRate,
      type: multies.name,
      model: yaskawaAlle[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4c48f774-b055',
      producent: 'Yaskawa Motoman',
      productionRate: yaskawaAlle[0].defaultRate,
      type: multies.name,
      model: yaskawaAlle[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '87e6b0b2-b055',
      producent: 'ABB',
      status: 'IDLE',
      productionRate: abbG10[0].defaultRate,
      type: grabers.name,
      model: abbG10[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '87e6b378-b055',
      producent: 'ABB',
      productionRate: abbG10[0].defaultRate,
      type: grabers.name,
      model: abbG10[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '87e6b6e8-b055',
      producent: 'ABB',
      productionRate: abbG12[0].defaultRate,
      type: grabers.name,
      model: abbG12[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '87e6b7f6-b055',
      producent: 'ABB',
      productionRate: abbG12[0].defaultRate,
      type: grabers.name,
      model: abbG12[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '20beb7c2-cffa',
      producent: 'Kawasaki',
      productionRate: kawaSashi[0].defaultRate,
      type: boxers.name,
      model: kawaSashi[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: 'ac829b22-2df5',
      producent: 'Kawasaki',
      productionRate: kawaSashi[0].defaultRate,
      type: boxers.name,
      model: kawaSashi[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '4d152653-1c00',
      producent: 'Kawasaki',
      productionRate: kawaHarro[0].defaultRate,
      type: boxers.name,
      model: kawaHarro[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
    {
      serialNumber: '93fc2e47-2994',
      producent: 'Kawasaki',
      productionRate: kawaHarro[0].defaultRate,
      type: boxers.name,
      model: kawaHarro[0].name,
      accessVersion: 1,
      statusVersion: 1,
    },
  ]);

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  // Create Schedules
  await db.insert(PGMachineMaintainInfo).values([
    {
      machineId: 1,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 2,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 3,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 4,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 5,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 6,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 7,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 8,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 9,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 10,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 11,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 12,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 13,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 14,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 15,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 16,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 17,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 18,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 19,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 20,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 21,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 22,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 23,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
    {
      machineId: 24,
      defects: [],
      priority: 'NORMAL',
      maintenance: nextMonth,
    },
  ]);

  console.log('🌱 Seeding Finished 🌱');
  process.exit(0);
}

seedMachineDB();
