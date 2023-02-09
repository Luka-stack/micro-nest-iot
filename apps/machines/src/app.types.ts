export const MACHINE_STATUS = {
  IDLE: 'IDLE',
  WORKING: 'WORKING',
  MAINTENANCE: 'MAINTENANCE',
  BROKEN: 'BROKEN',
} as const;

export type MachineStatus = keyof typeof MACHINE_STATUS;
