export enum MachineSubjects {
  MachineCreated = 'machine:created',
  MachineUpdated = 'machine:updated',
  MachineDeleted = 'machine:deleted',
  EmployeeAssigned = 'employee:assigned',
  EmployeeUnassigned = 'employee:unassigned',
}

export enum KepwareSubjects {
  RegisterWork = 'register:work',
  RegisterUtilization = 'register:utilization',
  RegisterStatusChange = 'register:status_change',

  MachineBroke = 'machine:broke',
}
