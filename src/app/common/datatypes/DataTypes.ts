import { LeaveBalanceStatus, LeaveType, TaskType, TimeSheetStatus, TimeSheetType } from '../enum/enum';

export class EmailDto {
  toEmail: string;
  subject: string;
  body: string;
}

export class TaskName {
  TaskId: number;
  TaskDetails: string;
}
export class Employee {
  EmployeeId: number;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Gender: string;
  DateOfBirth: Date;
  ContactNumber: string;
  AltContactNumber: string;
  PersonalEmail: string;
  CompanyEmail: string;
  DateOfJoining: Date;
  CurrentDesignation: string;
  CurrentGrossSalary: number;
  ProfileImgUrl?: string = null;
  ProfileImg?: File = null;
  DateOfRelieving: Date;
  EmployeeStatus: string;
  TeamLeadId?: number = null;
  ReportingManagerId?: number = null;
  IsDeleted: boolean = false;
  CreatedBy?: number = null;
  CreatedDateTime: any;
  LastModifiedBy?: number = null;
  LastModifiedDateTime?: any = null;
  DeletedBy?: number = null;
  DeletedDateTime?: any = null;
}

export class Fest {
  name: string = null;
  date: any = null;
  photos: any[] = [];
}

export class Event {
  eventID: number = 0;
  name: string;
  date: any;
  details: string;
  imgUrl: string = '';
  email: string = '';
}

export class Holiday {
  holidayId: number = 0;
  title: string;
  type: string;
  startDate: string = '';
  details: number;
  imgUrl: string = '';
}

// Array of options for the dropdown
export const leaveTypeOptions = [
  { value: LeaveType.EarnedLeave, label: 'Earned Leave' },
  { value: LeaveType.CasualLeave, label: 'Casual Leave' },
  { value: LeaveType.SickLeave, label: 'Sick Leave' },
  { value: LeaveType.MaternityLeave, label: 'Maternity Leave' },
  { value: LeaveType.CompensatoryOff, label: 'Compensatory Off' },
  { value: LeaveType.MarriageLeave, label: 'Marriage Leave' },
  { value: LeaveType.PaternityLeave, label: 'Paternity Leave' },
  { value: LeaveType.BereavementLeave, label: 'Bereavement Leave' },
  { value: LeaveType.LossOfPay, label: 'Loss Of Pay' }
];

// Array of options for the dropdown
export const taskTypeOptions = [
  { value: TaskType.Development, label: 'Development' },
  { value: TaskType.Design, label: 'Design' },
  { value: TaskType.Testing, label: 'Testing' },
  { value: TaskType.Review, label: 'Review' },
  { value: TaskType.Support, label: 'Support' },
  { value: TaskType.Learning, label: 'Learning' },
  { value: TaskType.Meeting, label: 'Meeting' },
  { value: TaskType.Management, label: 'Management' },
  { value: TaskType.SocialTime, label: 'Social Time' }
];

// Array of options for the dropdown
export const timeSheetStatusOptions = [
  { value: TimeSheetStatus.Open, label: 'Open' },
  { value: TimeSheetStatus.Submitted, label: 'Submitted' },
  { value: TimeSheetStatus.Approved, label: 'Approved' },
  { value: TimeSheetStatus.Rejected, label: 'Rejected' }
];

export const timeSheetTypeOptions = [
  { value: TimeSheetType.Daily, label: 'Daily' },
  { value: TimeSheetType.Weekly, label: 'Weekly' }
];

export const LeaveBalanceStatusOptions = [
  { value: LeaveBalanceStatus.Applicable, label: 'Applicable' },
  { value: LeaveBalanceStatus.NotApplicable, label: 'NotApplicable' }
];

export class RequestDto {
  EmployeeId: number = null;
  FormDate: any = null;
  ToDate: any = null;
  constructor(EmployeeId: number = null, FormDate: any = null, ToDate: any = null) {
    this.EmployeeId = EmployeeId;
    this.FormDate = FormDate;
    this.ToDate = ToDate;
  }
}

export class Attendance {
  AttendanceId: number;
  AttendanceDate: any;
  InTime: any;
  OutTime: any | null = null;
  EmployeeId: number;
  WorkTime: any = null;
  Employee: Employee | null = null;
  IsDeleted: boolean;
  CreatedBy: number | null = null;
  CreatedDateTime: any;
  LastModifiedBy: number | null = null;
  LastModifiedDateTime: any | null = null;
  DeletedBy: number | null = null;
  DeletedDateTime: Date | null = null;
}

export class LeaveRequest {
  LeaveRequestId: number;
  LeaveType: string;
  FromDate: any;
  ToDate: any;
  IsHalfDay: boolean | null = null;
  Reason: string;
  LeaveRequestStatus: string = 'Open';
  ApproverComment: string | null = ' ';
  Approver: number | null = null;
  EmployeeId: number;
  Employee: Employee | null = null;
  IsDeleted: boolean;
  CreatedBy: number | null = null;
  CreatedDateTime: any;
  LastModifiedBy: number | null = null;
  LastModifiedDateTime: any | null = null;
  DeletedBy: number | null = null;
  DeletedDateTime: any | null = null;
}

export class CalendarDto {
  date: Date;
  eventName: string;
}

export class TimeSheet {
  TimesheetId: number;
  TimesheetDate: any;
  ToTimesheetDate: any = null;
  TimesheetStatus: any;
  Approver?: number | null;
  WorkingHours: any = null;
  ApproverEmployee?: Employee | null;
  EmployeeId: number;
  Employee?: Employee | null;
  IsDeleted: boolean;
  CreatedBy?: number | null;
  CreatedDateTime: Date;
  LastModifiedBy?: number | null;
  LastModifiedDateTime?: any | null;
  DeletedBy?: number | null;
  DeletedDateTime?: Date | null;
}

export class TimeSheetDetail {
  TimeSheetDetailId: number;
  TaskId: number;
  Task: TaskName;
  HoursSpent: number;
  IsBillable: boolean;
  TimeSheetDate = null;
  TaskType: any;
  ProjectId?: number | null = null;
  Project?: any | null = null;
  TimesheetId: number;
  Timesheet?: TimeSheet | null = null;
  ClientId?: number | null = null;
  Client?: any | null = null;
  IsDeleted: boolean = false;
  CreatedBy?: number | null = null;
  CreatedDateTime: any = null;
  LastModifiedBy?: number | null = null;
  LastModifiedDateTime?: any | null = null;
  DeletedBy?: number | null = null;
  DeletedDateTime?: any | null = null;
}

export class EmployeeSalary {
  EmployeeSalaryStructureId: number;
  FromDate: any = null;
  ToDate: any = null;
  EmployeeSalaryId: number;
  SalaryForAMonth: Date;
  Basic: number;
  HRA: number;
  DA: number;
  Conveyance: number;
  MedicalAllowance: number;
  SpecialAllowance: number;
  PT: number;
  TDS: number;
  LeaveDeduction: number;
  OtherDeduction: number;
  DaysInAMonth?: number = null;
  PresentDays?: number = null;
  Leaves?: number = null;
  GrossSalary: number;
  NetSalary: number;
  EmployeeId: number;
  Employee?: Employee = null;
  IsDeleted: boolean = false;
  CreatedBy?: number | null = null;
  CreatedDateTime: any = null;
  LastModifiedBy?: number | null = null;
  LastModifiedDateTime?: any | null = null;
  DeletedBy?: number | null = null;
  DeletedDateTime?: any | null = null;
}

export class LeaveBalance {
  LeaveBalanceId: number;
  Year: number;
  EarnedLeaves: number;
  CasualLeaves: number;
  SickLeaves: number;
  MaternityLeaves: number;
  CompensatoryOffs: number;
  MarriageLeaves: number;
  PaternityLeaves: number;
  BereavementLeaves: number;
  LossofPayLeaves: number;
  EarnedLeavesAvailaed: number | null = null;
  CasualLeavesAvailaed: number | null = null;
  SickLeavesAvailaed: number | null = null;
  MaternityLeavesAvailaed: number | null = null;
  CompensatoryOffsAvailaed: number | null = null;
  MarriageLeavesAvailaed: number | null = null;
  PaternityLeavesAvailaed: number | null = null;
  BereavementLeavesAvailaed: number | null = null;
  LossofPayLeavesAvailaed: number | null = null;
  LeaveBalanceStatus: any;
  EmployeeId: number;
  Employee: Employee | null = null;
  IsDeleted: boolean = false;
  CreatedBy: number | null = null;
  CreatedDateTime: Date | null = null;
  LastModifiedBy: number | null = null;
  LastModifiedDateTime: any = null;
  DeletedBy: number | null = null;
  DeletedDateTime: Date | null = null;
}

export class NotificationDto {
  Name: string;
  Link: string;
  Time: string;
  Icon: string;
  color: string;
}
