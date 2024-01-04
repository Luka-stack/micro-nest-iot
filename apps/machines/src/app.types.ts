export const NOT_ASSIGNED = 'Unassigned' as const;

export const MACHINE_STATUS = {
  IDLE: 'IDLE',
  WORKING: 'WORKING',
  MAINTENANCE: 'MAINTENANCE',
  BROKEN: 'BROKEN',
  UNDER_MAINTENANCE: 'UNDER_MAINTENANCE',
} as const;

export type MachineStatus = keyof typeof MACHINE_STATUS;
