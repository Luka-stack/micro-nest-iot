import { seedMachinesDB } from './machines/seed';

export const seed = async () => {
  await Promise.all([seedMachinesDB()]);
};

// seed();
