import { seedKepwareDB } from './kepware/seed';
import { seedMachinesDB } from './machines/seed';

export const seed = async () => {
  await Promise.all([
    // seedMachinesDB(),
    // seedKepwareDB(),
  ]);
};

// seed();
