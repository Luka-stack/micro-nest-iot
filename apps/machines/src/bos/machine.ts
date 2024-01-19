import { InferSelectModel } from 'drizzle-orm';

import { PGMachine, PGMachineMaintainInfo } from '../database/schema';

export type Machine = InferSelectModel<typeof PGMachine>;
export type MaintainInfo = InferSelectModel<typeof PGMachineMaintainInfo>;
export type MachineColumns = {
  model?: true;
  type?: true;
  maintenances?: true;
  maintainInfo?: true;
};
