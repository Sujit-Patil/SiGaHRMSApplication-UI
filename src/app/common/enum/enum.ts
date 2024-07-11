export enum TimeSheetStatus {
  All = 'All',
  Open = 'Open',
  Submitted = 'Submitted',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export enum TimeSheetType {
  Weekly = 'Weekly',
  Daily = 'Daily'
}

export enum LeaveBalanceStatus {
  Applicable = 'Applicable',
  NotApplicable = 'NotApplicable'
}

export enum LeaveType {
  EarnedLeave = 'EarnedLeave',
  CasualLeave = 'CasualLeave',
  SickLeave = 'SickLeave',
  MaternityLeave = 'MaternityLeave',
  CompensatoryOff = 'CompensatoryOff',
  MarriageLeave = 'MarriageLeave',
  PaternityLeave = 'PaternityLeave',
  BereavementLeave = 'BereavementLeave',
  LossOfPay = 'LossOfPay'
}

export enum TaskType {
  Development = 'Development',
  Design = 'Design',
  Testing = 'Testing',
  Review = 'Review',
  Support = 'Support',
  Learning = 'Learning',
  Meeting = 'Meeting',
  Management = 'Management',
  SocialTime = 'SocialTime'
}

export enum Api {
  Client = 'Client',
  Employee = 'Employee',
  EmployeeSalary = 'EmployeeSalary',
  EmployeeSalaryStructure = 'EmployeeSalaryStructure',
  Project = 'Project',
  Applicant = 'Applicant',
  Attendance = 'Attendance',
  Holiday = 'Holiday',
  LeaveRequest = 'LeaveRequest',
  LeaveBalance = 'LeaveBalance',
  Job = 'Job',
  Event = 'Event',
  Bank = 'Bank',
  OfficeFest = 'OfficeFest',
  TimeSheet = 'TimeSheet',
  TimesheetDetail = 'TimesheetDetail',
  TaskName = 'TaskName'
}
