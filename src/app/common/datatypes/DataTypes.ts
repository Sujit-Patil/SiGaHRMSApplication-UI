import { BillingType, ClientStatus, LeaveBalanceStatus, LeaveType, TaskType, TimeSheetStatus, TimeSheetType } from '../enum/enum';

export class EmailDto {
  toEmail: string;
  subject: string;
  body: string;
}

export class TaskName {
  TaskId: number;
  TaskDetails: string;
  ProjectId?: number;
  Project?: Project | null = null;
  ClientId?: number;
  Client?: any | null = null;
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
  HolidayId: number;
  Date: any;
  Description: any;
  IsDeleted: boolean;
  CreatedBy: number | null = null;
  CreatedDateTime: any;
  LastModifiedBy: number | null = null;
  LastModifiedDateTime: any | null = null;
  DeletedBy: number | null = null;
  DeletedDateTime: Date | null = null;
}

export class Project {
  ProjectId: number;
  Title: string;
  StartDate: any;
  EndDate: any | null = null;
  RateUSD: number;
  RateINR: number;
  WeeklyLimit: number;
  BillingType: BillingType;
  Status: string = null;
  ClientId: number;
  Client: Client = null;
  BillingPlatformId: number;
  BillingPlatform: BillingPlatform = null;
  IsDeleted: boolean = false;
  CreatedBy: number | null = null;
  CreatedDateTime: Date | null = null;
  LastModifiedBy: number | null = null;
  LastModifiedDateTime: Date | null = new Date();
  DeletedBy: number | null = null;
  DeletedDateTime: Date | null = null;
}

export class BillingPlatform {
  BillingPlatformId: number;
  Name: string;
  IsDeleted: boolean = false;
  CreatedBy: number | null = null;
  CreatedDateTime: Date | null = null;
  LastModifiedBy: number | null = null;
  LastModifiedDateTime: Date | null = new Date();
  DeletedBy: number | null = null;
  DeletedDateTime: Date | null = null;
}
export class Client {
  ClientId: number;
  Name: string = '';
  CompanyName: string | null = '';
  ContactPersonName: string | null = '';
  Status: any;
  IsDeleted: boolean = false;
  CreatedBy: number | null = null;
  CreatedDateTime: Date | null = null;
  LastModifiedBy: number | null = null;
  LastModifiedDateTime: Date | null = new Date();
  DeletedBy: number | null = null;
  DeletedDateTime: Date | null = null;
}
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
  TimesheetId: number;
  Timesheet?: TimeSheet | null = null;
  IsDeleted: boolean = false;
  CreatedBy?: number | null = null;
  CreatedDateTime: any = null;
  LastModifiedBy?: number | null = null;
  LastModifiedDateTime?: any | null = null;
  DeletedBy?: number | null = null;
  DeletedDateTime?: any | null = null;
}

export class IncentivePurpose {
  IncentivePurposeId: number;
  Purpose: any;
  IsDeleted: boolean;
  CreatedBy: number | null = null;
  CreatedDateTime: any | null = null;
  LastModifiedBy: number | null = null;
  LastModifiedDateTime: any = null;
  DeletedBy: number | null = null;
  DeletedDateTime: any | null = null;
}

export class Incentive {
  IncentiveId: number;
  IncentivePurposeId: number;
  IncentivePurpose: IncentivePurpose;
  Amount: number;
  Description: string | null = null;
  EmployeeId: number;
  Employee: any | null = null;
  IsDeleted: boolean;
  CreatedBy: number | null = null;
  CreatedDateTime: any | null = null;
  LastModifiedBy: number | null = null;
  LastModifiedDateTime: any = null;
  DeletedBy: number | null = null;
  DeletedDateTime: any | null = null;
}

export class EmployeeSalaryStructure {
  EmployeeSalaryStructureId: number;
  FromDate: string;
  ToDate: string | null = null;
  Basic: number;
  HRA: number;
  DA: number;
  Conveyance: number;
  MedicalAllowance: number;
  SpecialAllowance: number;
  TDS: number;
  EmployeeId: number;
  Employee: Employee | null = null;
  IsDeleted: boolean = false;
  CreatedBy: number | null = null;
  CreatedDateTime: any | null = null;
  LastModifiedBy: number | null = null;
  LastModifiedDateTime: any | null = null;
  DeletedBy: number | null = null;
  DeletedDateTime: any | null = null;
}
export class EmployeeSalary {
  EmployeeSalaryStructureId: number;
  FromDate: any = null;
  ToDate: any;
  EmployeeSalaryId: number;
  SalaryForAMonth: any;
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

export const leaveTypeArray=['Earned Leave','Casual Leave','Sick Leave','Maternity Leave','Compensatory Off','Marriage Leave','Paternity Leave','Bereavement Leave','Loss Of Pay']

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

export const billingTypeOptions = [
  { value: BillingType.Hourly, label: 'Hourly' },
  { value: BillingType.Weekly, label: 'Weekly' },
  { value: BillingType.Monthly, label: 'Monthly' },
  { value: BillingType.Fixed, label: 'Fixed' },
  { value: BillingType.NonBillable, label: 'Non-Billable' }
];

export const clientStatusOptions = [
  { value: ClientStatus.Active, label: 'Active' },
  { value: ClientStatus.Inactive, label: 'Inactive' }
];
