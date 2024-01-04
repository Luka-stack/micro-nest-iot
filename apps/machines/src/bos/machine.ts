import { InferSelectModel } from 'drizzle-orm';

import { PGMachine } from '../database/schema';

export type Machine = InferSelectModel<typeof PGMachine>;
