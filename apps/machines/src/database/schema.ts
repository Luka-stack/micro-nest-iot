import { relations } from 'drizzle-orm';
import {
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  uniqueIndex,
  varchar,
  text,
  index,
} from 'drizzle-orm/pg-core';

export const PGMachineStatus = pgEnum('status', [
  'IDLE',
  'WORKING',
  'MAINTENANCE',
  'BROKEN',
  'UNDER_MAINTENANCE',
]);

export const PGSchedulePiority = pgEnum('priority', ['HIGH', 'NORMAL', 'LOW']);

export const PGMaintenanceType = pgEnum('maintenance_type', [
  'MAINTENANCE',
  'REPAIR',
]);

export const PGMachine = pgTable(
  'machines',
  {
    id: serial('id').primaryKey(),
    serialNumber: varchar('serial_number', { length: 50 }),
    status: PGMachineStatus('status').default('IDLE'),
    lastStatusUpdate: timestamp('last_status_update', {
      withTimezone: true,
    }).defaultNow(),
    productionRate: integer('production_rate'),
    producent: varchar('producent', { length: 50 }),
    type: varchar('type', { length: 50 }),
    model: varchar('model', { length: 50 }),
    assignedEmployee: varchar('assigned_employee').default(null),
    assignedMaintainer: varchar('assigned_maintainer').default(null),
    version: integer('version'),
  },
  (machines) => ({
    serialNumberIndex: uniqueIndex('serial_number_idx').on(
      machines.serialNumber,
    ),
    employeeIndex: index('employee_idx').on(machines.assignedEmployee),
    maintainerIndex: index('maintainer_idx').on(machines.assignedMaintainer),
  }),
);

export const PGMachineMaintainInfo = pgTable('machine_maintain_info', {
  id: serial('id').primaryKey(),
  notes: text('notes'),
  machineId: integer('machine_id')
    .notNull()
    .references(() => PGMachine.id),
  maintenance: timestamp('next_maintenance', { withTimezone: true }),
  priority: PGSchedulePiority('priority').default('NORMAL'),
});

export const PGProducent = pgTable(
  'producents',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }),
  },
  (producents) => ({
    nameIndex: uniqueIndex('producents_name_idx').on(producents.name),
  }),
);

export const PGType = pgTable(
  'types',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }),
    imageUrl: varchar('image_url', { length: 255 }),
  },
  (types) => ({
    nameIndex: uniqueIndex('types_name_idx').on(types.name),
  }),
);

export const PGModel = pgTable(
  'models',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }),
    workBase: integer('work_base'),
    workRange: integer('work_range'),
    faultRate: doublePrecision('fault_rate'),
    defaultRate: integer('default_rate'),
    maxRate: integer('max_rate'),
    minRate: integer('min_rate'),
    typeId: integer('type_id'),
    producentId: integer('producent_id'),
  },
  (models) => ({
    modelNameIndex: uniqueIndex('model_name_idx').on(models.name),
  }),
);

export const PGMaintenanceHistory = pgTable('maintenanc_history', {
  id: serial('id').primaryKey(),
  machineId: integer('machine_id')
    .notNull()
    .references(() => PGMachine.id),
  maintainer: varchar('maintainer'),
  description: text('description'),
  date: timestamp('date', { withTimezone: true }).defaultNow(),
  type: varchar('type'),
  scheduled: timestamp('scheduled', {
    withTimezone: true,
  }),
  nextMaintenance: timestamp('next_maintenance', { withTimezone: true }),
});

export const PGProducentsToTypes = pgTable(
  'producents_to_types',
  {
    producentId: integer('producent_id')
      .notNull()
      .references(() => PGProducent.id),
    typeId: integer('type_id')
      .notNull()
      .references(() => PGType.id),
  },
  (table) => ({ pk: primaryKey(table.producentId, table.typeId) }),
);

export const PGRelationProducetnsToTypes = relations(
  PGProducentsToTypes,
  ({ one }) => ({
    producent: one(PGProducent, {
      fields: [PGProducentsToTypes.producentId],
      references: [PGProducent.id],
    }),
    type: one(PGType, {
      fields: [PGProducentsToTypes.typeId],
      references: [PGType.id],
    }),
  }),
);

export const PGModelsRelations = relations(PGModel, ({ one }) => ({
  type: one(PGType, {
    fields: [PGModel.typeId],
    references: [PGType.id],
  }),
  producent: one(PGProducent, {
    fields: [PGModel.producentId],
    references: [PGProducent.id],
  }),
}));

export const PGMachineRelations = relations(PGMachine, ({ one }) => ({
  type: one(PGType, {
    fields: [PGMachine.type],
    references: [PGType.name],
  }),
  model: one(PGModel, {
    fields: [PGMachine.model],
    references: [PGModel.name],
  }),
  maintainInfo: one(PGMachineMaintainInfo, {
    references: [PGMachineMaintainInfo.machineId],
    fields: [PGMachine.id],
  }),
  maintenances: one(PGMaintenanceHistory),
}));
