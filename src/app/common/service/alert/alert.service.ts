import { Injectable } from '@angular/core';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import {
  Client,
  clientStatusOptions,
  Employee,
  Holiday,
  Incentive,
  IncentivePurpose,
  LeaveBalance,
  LeaveRequest,
  leaveTypeOptions,
  Project,
  TaskName
} from '../../datatypes/DataTypes';
import { DatePipe } from '@angular/common';
import { LeaveType } from '../../enum/enum';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(
    public readonly swalTargets: SwalPortalTargets,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) {}

  leaveRequestAlert = (leaveRequest, leaveBalance, leaves) => {
    const checkLeaveAvailability = (type, balance) => {
      if (balance <= 0) {
        Swal.showValidationMessage(`${type} Not Available`);
        return false;
      }
      return true;
    };

    const validateDate = (date, label) => {
      const parsedDate = new Date(date);
      if (!date) {
        Swal.showValidationMessage(`Please select a ${label} date`);
        return false;
      }
      if (parsedDate.getUTCDay() === 0 || parsedDate.getUTCDay() === 6) {
        Swal.showValidationMessage(`Sorry, ${label} Date falls on a weekend!`);
        return false;
      }
      return parsedDate;
    };

    const leaveTypeOptionsHtml = leaveTypeOptions
      .map(
        (option) => `<option value="${option.value}" ${option.value === leaveRequest.LeaveType ? 'selected' : ''}>${option.label}</option>`
      )
      .join('');

    return Swal.fire({
      title: 'Leave Request Details',
      html: `
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="LeaveType">Leave Type</label>
              <select class="form-control" id="LeaveType">${leaveTypeOptionsHtml}</select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="FromDate">From Date</label>
              <input type="date" class="form-control" id="FromDate" value="${leaveRequest.FromDate}" min="${this.datePipe.transform(
                new Date(),
                'yyyy-MM-dd'
              )}" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="ToDate">To Date</label>
              <input type="date" class="form-control" id="ToDate" value="${leaveRequest.ToDate}" min="${this.datePipe.transform(
                new Date(),
                'yyyy-MM-dd'
              )}" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="IsHalfDay">Half Day</label>
              <select class="form-control" id="IsHalfDay">
                <option value="true" ${leaveRequest.IsHalfDay ? 'selected' : ''}>Yes</option>
                <option value="false" ${!leaveRequest.IsHalfDay ? 'selected' : ''}>No</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label class="form-label" for="Reason">Reason</label>
              <textarea class="form-control" id="Reason" placeholder="Type Reason here">${leaveRequest.Reason || ''}</textarea>
            </div>
          </div>
        </div>
      `,
      focusConfirm: true,
      preConfirm: () => {
        leaveRequest.LeaveType = (document.getElementById('LeaveType') as HTMLInputElement).value;
        leaveRequest.FromDate = (document.getElementById('FromDate') as HTMLInputElement).value;
        leaveRequest.ToDate = (document.getElementById('ToDate') as HTMLInputElement).value;
        leaveRequest.IsHalfDay = (document.getElementById('IsHalfDay') as HTMLInputElement).value === 'true';
        leaveRequest.Reason = (document.getElementById('Reason') as HTMLInputElement).value.trim();

        if (!leaveRequest.LeaveType) {
          Swal.showValidationMessage('Please select a leave type');
          return false;
        }

        const leaveTypeCheck = {
          BereavementLeave: leaveBalance.BereavementLeaves,
          CasualLeave: leaveBalance.CasualLeaves,
          CompensatoryOff: leaveBalance.CompensatoryOffs,
          EarnedLeave: leaveBalance.EarnedLeaves,
          MarriageLeave: leaveBalance.MarriageLeaves,
          MaternityLeave: leaveBalance.MaternityLeaves,
          PaternityLeave: leaveBalance.PaternityLeaves,
          SickLeave: leaveBalance.SickLeaves
        };

        if (!checkLeaveAvailability(leaveRequest.LeaveType, leaveTypeCheck[leaveRequest.LeaveType])) {
          return false;
        }

        const fromDate = validateDate(leaveRequest.FromDate, 'From');
        if (!fromDate) return false;

        const toDate = validateDate(leaveRequest.ToDate, 'To');
        if (!toDate) return false;

        if (toDate < fromDate) {
          Swal.showValidationMessage('To date cannot be earlier than from date');
          return false;
        }

        if (!leaveRequest.Reason) {
          Swal.showValidationMessage('Please enter a reason');
          return false;
        }

        const overlappingLeaves = leaves.some((leave) => {
          const leaveFrom = new Date(leave.FromDate);
          const leaveTo = new Date(leave.ToDate);
          return fromDate <= leaveTo && toDate >= leaveFrom;
        });

        if (overlappingLeaves) {
          Swal.showValidationMessage('Leave already exists');
          return false;
        }

        return leaveRequest;
      }
    });
  };

  clientRequestAlert = (clientRequest: Client) => {
    return Swal.fire({
      title: 'Leave Request Details',
      html: `
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="LeaveType">Client Status</label>
              <select
                class="form-control"
                id="Status"
                placeholder="Client Status">
                ${clientStatusOptions
                  .map(
                    (option) =>
                      `<option value="${option.value}" ${option.value === clientRequest.Status ? 'selected' : ''}>${option.label}</option>`
                  )
                  .join('')}
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="Name">Name</label>
              <input
                type="text"
                class="form-control"
                id="Name"
                value="${clientRequest.Name}"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="CompanyName">CompanyName</label>
              <input
                type="text"
                class="form-control"
                id="CompanyName"
                value="${clientRequest.CompanyName}"
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="ContactPersonName">Contact Person Name</label>
             <input
                type="text"
                class="form-control"
                id="ContactPersonName"
                value="${clientRequest.ContactPersonName}"
              />
            </div>
          </div>
        </div>
      `,
      focusConfirm: true,
      preConfirm: () => {
        clientRequest.CompanyName = (document.getElementById('CompanyName') as HTMLSelectElement).value;
        clientRequest.Name = (document.getElementById('Name') as HTMLInputElement).value;
        clientRequest.ContactPersonName = (document.getElementById('ContactPersonName') as HTMLInputElement).value;
        clientRequest.Status = (document.getElementById('Status') as HTMLSelectElement).value;

        if (!clientRequest.CompanyName) {
          Swal.showValidationMessage('Company Name Requried');
          return false;
        }
        if (!clientRequest.Name) {
          Swal.showValidationMessage('Client Name Requried');
          return false;
        }
        if (!clientRequest.ContactPersonName) {
          Swal.showValidationMessage('Contact Person Name Required');
          return false;
        }

        if (!clientRequest.Status) {
          Swal.showValidationMessage('Please Select Client Status');
          return false;
        }

        return clientRequest;
      }
    });
  };

  incentiveRequestAlert = (incentiveRequest: Incentive, incentivePurposes: IncentivePurpose[], employees: Employee[]) => {
    return Swal.fire({
      title: 'Incentive Request Details',
      html: `

      <div class="row">
            <div class="form-group">
              <label class="form-label" for="Employee">Employee</label>
              <select
                class="form-control"
                id="EmployeeId"
                placeholder="Select Employee">
                ${employees
                  .map(
                    (option) =>
                      `<option value="${option.EmployeeId}" ${option.EmployeeId === incentiveRequest.EmployeeId ? 'selected' : ''}>${
                        option.FirstName + ' ' + option.LastName
                      }</option>`
                  )
                  .join('')}
              </select>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="IncentivePurpose">Incentive Purpose</label>
              <select
                class="form-control"
                id="IncentivePurposeId"
                placeholder="Select Incentive Purpose">
                ${incentivePurposes
                  .map(
                    (option) =>
                      `<option value="${option.IncentivePurposeId}" ${
                        option.IncentivePurposeId === incentiveRequest.IncentivePurposeId ? 'selected' : ''
                      }>${option.Purpose}</option>`
                  )
                  .join('')}
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="Amount">Amount</label>
              <input
                type="number"
                class="form-control"
                id="Amount"
                value="${incentiveRequest.Amount}"
              />
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label class="form-label" for="Description">Description</label>
              <textarea
                class="form-control"
                id="Description"
                placeholder="${incentiveRequest.Description != undefined ? incentiveRequest.Description : 'Type Description here'}">${
                  incentiveRequest.Description != undefined ? incentiveRequest.Description : ''
                }</textarea>
            </div>
          </div>
        </div>
      `,
      focusConfirm: true,
      preConfirm: () => {
        incentiveRequest.Amount = Number((document.getElementById('Amount') as HTMLSelectElement).value);
        incentiveRequest.IncentivePurposeId = Number((document.getElementById('IncentivePurposeId') as HTMLInputElement).value);
        incentiveRequest.Description = (document.getElementById('Description') as HTMLInputElement).value;
        incentiveRequest.EmployeeId = Number((document.getElementById('EmployeeId') as HTMLSelectElement).value);

        if (!incentiveRequest.Amount) {
          Swal.showValidationMessage('Please Enter Amount');
          return false;
        }
        if (!incentiveRequest.IncentivePurposeId) {
          Swal.showValidationMessage('Please Select Incentive Purpose');
          return false;
        }

        if (!incentiveRequest.Description.trim()) {
          Swal.showValidationMessage('Please Add The Description');
          return false;
        }

        return incentiveRequest;
      }
    });
  };

  HolidayFromAlert = (holiday: Holiday) =>
    Swal.fire({
      title: 'Holiday',
      html: ` <div class="row">
    <div class="form-group">
        <label class="form-label" for="holidayDate">Holiday date</label>
        <input
          type="date"
          class="form-control"
          id="holidayDate"
          value="${holiday.Date}"
        />
    </div>
    <div class="form-group">
        <label class="form-label" for="description">Description</label>
        <textarea
          class="form-control"
          id="description"
          placeholder="Enter Holiday Description"
        >${!holiday.Description ? '' : holiday.Description}</textarea> <!-- Corrected: Added closing tag for <textarea> -->
    </div>
</div>
`,
      focusConfirm: true,
      preConfirm: () => {
        holiday.Date = (document.getElementById('holidayDate') as HTMLSelectElement).value;
        holiday.Description = (document.getElementById('description') as HTMLInputElement).value;

        return holiday;
      }
    });

  Show = (Reason) =>
    Swal.fire({
      html: `<div><h5>Message</h5><br>
    ${Reason}
    </div>`
    });

  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success m-3',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

  Toast = () =>
    Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

  DeleteAlert = () =>
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

  taskRequestAlert = (taskNameRequest: TaskName, client: Client[], project: Project[]) => {
    return Swal.fire({
      title: 'Task Request Details',
      html: `
  
        <div class="row">
              <div class="form-group">
                <label class="form-label" for="Client">Client</label>
                    <select
                      class="form-control"
                      id="ClientId"
                      placeholder="Select Client">
                      ${client
                        .map(
                          (option) =>
                            `<option value="${option.ClientId}" ${option.ClientId === taskNameRequest.ClientId ? 'selected' : ''}>${
                              option.Name
                            }</option>`
                        )
                        .join('')}
                    </select>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="Project">Project</label>
                <select
                  class="form-control"
                  id="ProjectId"
                  placeholder="Select Project">
                  ${project
                    .map(
                      (option) =>
                        `<option value="${option.ProjectId}" ${option.ProjectId === taskNameRequest.ProjectId ? 'selected' : ''}>${
                          option.Title
                        }</option>`
                    )
                    .join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="Description">Task Details</label>
                <textarea
                  class="form-control"
                  id="TaskDetails"
                  placeholder="${taskNameRequest.TaskDetails != undefined ? taskNameRequest.TaskDetails : 'Type Description here'}">${
                    taskNameRequest.TaskDetails != undefined ? taskNameRequest.TaskDetails : ''
                  }</textarea>
              </div>
          </div>
        `,
      focusConfirm: true,
      preConfirm: () => {
        taskNameRequest.ClientId = Number((document.getElementById('ClientId') as HTMLSelectElement).value);
        taskNameRequest.ProjectId = Number((document.getElementById('ProjectId') as HTMLInputElement).value);
        taskNameRequest.TaskDetails = (document.getElementById('TaskDetails') as HTMLInputElement).value;

        if (!taskNameRequest.ClientId) {
          Swal.showValidationMessage('Please Select Client');
          return false;
        }
        if (!taskNameRequest.ProjectId) {
          Swal.showValidationMessage('Please Select Project');
          return false;
        }

        if (!taskNameRequest.TaskDetails.trim()) {
          Swal.showValidationMessage('Please Add Task Details');
          return false;
        }

        return taskNameRequest;
      }
    });
  };

  Task = async () =>
    Swal.fire({
      input: 'textarea',
      inputLabel: 'Message',
      inputPlaceholder: 'Type your message here...',
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true
    });

  SendOtp = (email) =>
    Swal.fire({
      title: 'You Want Send Otp To Email',
      input: 'text',
      inputLabel: 'Email',
      inputPlaceholder: `${email}`,
      inputValue: `${email}`,
      inputAttributes: {
        maxlength: '10',
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      confirmButtonText: 'Send Otp'
    });

  Invalid = (title, text, icon) =>
    Swal.fire({
      title: title,
      text: text,
      icon: icon
    });
}
