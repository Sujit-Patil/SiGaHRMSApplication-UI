import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/common/component/module/shared.module';
import { RequestDto, TaskName, TimeSheetDetail, taskTypeOptions } from 'src/app/common/datatypes/DataTypes';
import { Api, TimeSheetStatus } from 'src/app/common/enum/enum';
import { AlertService } from 'src/app/common/service/alert/alert.service';
import { ApiService } from 'src/app/common/service/api/api-service.service';
import { AuthService } from 'src/app/common/service/authitication/auth.service';
import Swal from 'sweetalert2';

class DaySheet {
  Task: TaskName;
  Time: number = 0;
  Date: any;
  TimeSheetDetail: TimeSheetDetail[] = [];
  TimeSheetId: number = null;
}
@Component({
  selector: 'app-timesheet-detail',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './timesheet-detail.component.html',
  styleUrls: ['./timesheet-detail.component.scss']
})
export class TimesheetDetailComponent {
  @Input() actionEmployeeId: number;
  taskTypeOptions = taskTypeOptions;
  timeSheetDetails: TimeSheetDetail[] = [];
  timeSheetDetail: TimeSheetDetail = new TimeSheetDetail();
  TimeSheetStatus = TimeSheetStatus;
  update = false;
  employeeId: number;
  taskArray: any[] = [];
  extendedlength = 3;
  date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  dates = [];
  authUser = false;

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private alertService: AlertService,
    private authService: AuthService
  ) {}
  async ngOnInit() {
    this.actionEmployeeId == 0 ? await this.getEmployee() : (this.employeeId = this.actionEmployeeId);
    this.authUser = this.employeeId === Number((await this.authService.decodeObjectFromBase64(localStorage.getItem('jwt'))).employeeId);
    await this.getTimesheetDetail();
  }

  async getEmployee() {
    const { employeeId: currentEmployeeId } = await this.authService.decodeObjectFromBase64(localStorage.getItem('jwt'));
    this.employeeId = Number(currentEmployeeId);
  }
  async getTimesheetDetail() {
    const { startOfWeek, endOfWeek } = this.getWeekRange(new Date(this.date));
    this.dates = this.getMiddleDates(new Date(startOfWeek), new Date(endOfWeek));
    await this.fetchTimeSheetDetails(this.employeeId, startOfWeek, endOfWeek);
  }

  async fetchTimeSheetDetails(employeeId: number, startDate: string, endDate: string) {
    this.apiService.getByDate(Api.TimesheetDetail, new RequestDto(employeeId, startDate, endDate)).subscribe((data: TimeSheetDetail[]) => {
      const taskMap: { [key: string]: TimeSheetDetail[] } = {};

      data.forEach((item) => {
        if (!taskMap[item.Task.TaskDetails]) {
          taskMap[item.Task.TaskDetails] = [];
        }
        taskMap[item.Task.TaskDetails].push(item);
      });

      const daySheetMap: { [key: string]: DaySheet[] } = {};

      for (let taskDetails in taskMap) {
        this.dates.forEach((date) => {
          if (!daySheetMap[taskDetails]) {
            daySheetMap[taskDetails] = [];
          }
          const daySheet = new DaySheet();
          daySheet.Task = taskMap[taskDetails][0].Task;
          daySheet.Date = date;
          daySheetMap[taskDetails].push(daySheet);
        });
      }

      for (let taskDetails in taskMap) {
        taskMap[taskDetails].forEach((detail) => {
          daySheetMap[taskDetails].forEach((daySheet) => {
            if (daySheet.Task.TaskId === detail.TaskId && daySheet.Date === detail.Timesheet.TimesheetDate) {
              daySheet.TimeSheetId = detail.TimesheetId;
              daySheet.Time += detail.HoursSpent;
              daySheet.TimeSheetDetail.push(detail);
            }
          });
        });
      }
      this.taskArray = Object.values(daySheetMap);

      console.log(this.taskArray);
    });
  }

  getTaskWeekHours(TaskId) {
    const taskArrayMap = new Map();
    this.taskArray.forEach((taskDetailsArray) => {
      taskDetailsArray.forEach((data) => {
        const id = data.Task.TaskId;
        const currentHours = taskArrayMap.get(id) || 0;
        taskArrayMap.set(id, currentHours + data.Time);
      });
    });
    return taskArrayMap.get(TaskId) || 0;
  }

  viewTask(daySheet: DaySheet) {
    Swal.fire({
      inputLabel: 'Message',
      html: this.getTaskHtml(daySheet),
      didOpen: () => this.setupTaskInputs(daySheet)
    });
  }
  async task(daySheet: DaySheet) {
    const { value: text } = await Swal.fire({
      inputLabel: 'Message',
      html: this.getTaskHtml(daySheet),
      showCancelButton: true,
      confirmButtonText: this.authUser ? 'Save' : 'OK',
      didOpen: () => this.setupTaskInputs(daySheet)
    });

    if (text) {
      await this.saveTaskDetails(daySheet);
    }
  }

  getTaskHtml(daySheet: DaySheet) {
    return `

    <style>
        .borderless-input {
          border: none;
          outline: none;
          box-shadow: none;
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
          background-color: transparent;
        }
        .borderless-input:focus {
          border: none;
          outline: none;
          box-shadow: none;
        }
        .borderless-select {
         
          margin: 0;
        }
          .appearance{
          appearance: none;
          }
          #taskDetailsBody select{
          background:none}

        .error-message {
    color: red;
    font-size: 0.875em;
    margin-top: 0.25rem;
  }

    </style>
      <div>
        <h3>Add Time</h3>
        <h6 class="text-start"> Task : ${daySheet.Task.TaskId} - ${daySheet.Task.TaskDetails}</h6>
        <h6 class="text-start"> Date : ${this.datePipe.transform(daySheet.Date, 'EEEE, MMMM d, y')}</h6>
      </div>
      <div class="table-responsive">
        <table class="table table-hover  mb-0">
          <thead>
            <tr class="text-center">
              <th>TaskType</th>
              <th>Hours</th>
              <th>Billable</th>
              ${this.authUser ? `<th>Action</th>` : ``}
            </tr>
          </thead>
          <tbody id="taskDetailsBody">
          </tbody>
        </table>
      </div>
      <div class="mt-2"> Total : ${daySheet.Time}</div>
    `;
  }

  async setupTaskInputs(daySheet: DaySheet) {
    const taskDetailsBody = document.getElementById('taskDetailsBody');

    daySheet.TimeSheetDetail.forEach((data, index) => {
      const row = document.createElement('tr');
      row.className = 'text-center';
      row.innerHTML = `
        <td class="border">
          <select class=" form-control borderless-input borderless-select" id="taskType-${index}">
            ${taskTypeOptions
              .map(
                (option) => `<option value="${option.value}" ${option.value === data.TaskType ? 'selected' : ''}>${option.label}</option>`
              )
              .join('')}
          </select>
          <div id="taskTypeError-${index}" class="error-message"></div>
        </td>
        <td class="border">
          <input type="number" min="-32768" max="32767" class="form-control borderless-input" id="hoursSpent-${index}" value="${
            data.HoursSpent
          }" />
          <div id="hoursSpentError-${index}" class="error-message"></div>
        </td>
        <td class="border">
          <select class="form-control borderless-input borderless-select" id="isBillable-${index}">
            <option value="true" ${data.IsBillable ? 'selected' : ''}>Billable</option>
            <option value="false" ${!data.IsBillable ? 'selected' : ''}>Not Billable</option>
          </select>
        </td>
        ${
          this.authUser
            ? ` <td class="border">
         <a class="btn btn-outline-danger" id="deleteButton-${index}" ><i class="ti ti-trash"></i></a>
        </td>`
            : ``
        }
      `;
      taskDetailsBody.appendChild(row);

      document.getElementById(`taskType-${index}`).addEventListener('change', () => {
        this.validateTaskType(index);
      });
      document.getElementById(`hoursSpent-${index}`).addEventListener('input', () => {
        this.validateHoursSpent(index);
      });
      this.authUser
        ? document.getElementById(`deleteButton-${index}`).addEventListener('click', () => {
            this.deleteTimeSheetDetail(data);
          })
        : '';
    });

    if (this.authUser) {
      const newIndex = daySheet.TimeSheetDetail.length;
      const newRow = document.createElement('tr');
      newRow.className = 'text-center';
      newRow.innerHTML = `
      <td class="border">
        <select class="form-control  borderless-select" id="taskType-${newIndex}">
        <option ></option>
          ${taskTypeOptions.map((option) => `<option value="${option.value}">${option.label}</option>`).join('')}
        </select>
        <div id="taskTypeError-${newIndex}" class="error-message"></div>
      </td>
      <td class="border">
        <input type="number" min="-32768" max="32767" class="form-control " id="hoursSpent-${newIndex}" />
        <div id="hoursSpentError-${newIndex}" class="error-message"></div>
      </td>
      <td class="border">
        <select style="" class="form-control  borderless-select" id="isBillable-${newIndex}">
         <option ></option>
          <option value="true">Billable</option>
          <option value="false">Not Billable</option>
        </select>
      </td>
    `;
      taskDetailsBody.appendChild(newRow);

      document.getElementById(`taskType-${newIndex}`).addEventListener('change', () => {
        this.validateTaskType(newIndex);
      });
      document.getElementById(`hoursSpent-${newIndex}`).addEventListener('input', () => {
        this.validateHoursSpent(newIndex);
      });
    }
  }

  validateTaskType(index: number) {
    const taskTypeElement = document.getElementById(`taskType-${index}`) as HTMLSelectElement;
    const taskTypeErrorElement = document.getElementById(`taskTypeError-${index}`);
    const isValid = taskTypeElement.value.trim() !== '';

    this.updateValidationState(taskTypeElement, taskTypeErrorElement, isValid, 'Task type cannot be empty.');
  }

  validateHoursSpent(index: number) {
    const hoursSpentElement = document.getElementById(`hoursSpent-${index}`) as HTMLInputElement;
    const hoursSpentErrorElement = document.getElementById(`hoursSpentError-${index}`);
    const isValid = +hoursSpentElement.value > 0;

    this.updateValidationState(hoursSpentElement, hoursSpentErrorElement, isValid, 'Hours spent cannot be less than or equal to 0.');
  }

  private updateValidationState(element: HTMLElement, errorElement: HTMLElement, isValid: boolean, errorMessage: string) {
    if (!isValid) {
      element.classList.add('is-invalid');
      errorElement.textContent = errorMessage;
    } else {
      element.classList.remove('is-invalid');
      errorElement.textContent = '';
    }
  }

  deleteTimeSheetDetail(data: TimeSheetDetail) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        data.IsDeleted = true;
        this.apiService.update(Api.TimesheetDetail, data).subscribe(async (data) => {
          if (data.IsValid) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              icon: 'success'
            }).then(async () => {
              await this.getTimesheetDetail();
            });
          } else {
            this.alertService.Toast().fire({ icon: 'error', title: data.Errors });
          }
        });
      }
    });
  }

  async saveTaskDetails(daySheet: DaySheet) {
    let isValid = true;

    const validateAndAssignValues = (data: TimeSheetDetail, index: number) => {
      this.validateTaskType(index);
      this.validateHoursSpent(index);

      const taskTypeElement = document.getElementById(`taskType-${index}`) as HTMLSelectElement;
      const hoursSpentElement = document.getElementById(`hoursSpent-${index}`) as HTMLInputElement;

      if (!taskTypeElement.value || +hoursSpentElement.value <= 0) {
        isValid = false;
      } else {
        data.TaskType = taskTypeElement.value;
        data.HoursSpent = +hoursSpentElement.value;
        data.IsBillable = (document.getElementById(`isBillable-${index}`) as HTMLSelectElement).value === 'true';
      }
    };

    daySheet.TimeSheetDetail.forEach((data, index) => {
      validateAndAssignValues(data, index);
    });

    const newIndex = daySheet.TimeSheetDetail.length;
    this.validateTaskType(newIndex);
    this.validateHoursSpent(newIndex);

    const newTaskTypeElement = document.getElementById(`taskType-${newIndex}`) as HTMLSelectElement;
    const newHoursSpentElement = document.getElementById(`hoursSpent-${newIndex}`) as HTMLInputElement;

    if (newTaskTypeElement.value || newHoursSpentElement.value) {
      if (!newTaskTypeElement.value || +newHoursSpentElement.value <= 0) {
        isValid = false;
      } else {
        const newTimeSheetDetail = new TimeSheetDetail();
        newTimeSheetDetail.TaskType = newTaskTypeElement.value;
        newTimeSheetDetail.HoursSpent = +newHoursSpentElement.value;
        newTimeSheetDetail.IsBillable = (document.getElementById(`isBillable-${newIndex}`) as HTMLSelectElement).value === 'true';
        newTimeSheetDetail.TaskId = daySheet.Task.TaskId;
        newTimeSheetDetail.TimesheetId = daySheet.TimeSheetId;
        daySheet.TimeSheetDetail.push(newTimeSheetDetail);
      }
    }

    if (isValid) {
      const promises = daySheet.TimeSheetDetail.map((data) => {
        if (!data.TimeSheetDetailId) {
          data.TimeSheetDate = daySheet.Date;
          return this.apiService.post(Api.TimesheetDetail, data).toPromise();
        } else {
          return this.apiService.update(Api.TimesheetDetail, data).toPromise();
        }
      });
      await Promise.all(promises);
      await this.getTimesheetDetail();
    }
  }

  getDayHours(date: any) {
    const dateHoursMap = new Map();
    this.taskArray.forEach((taskDetailsArray) => {
      taskDetailsArray.forEach((data) => {
        const taskDate = data.Date;
        const currentHours = dateHoursMap.get(taskDate) || 0;
        dateHoursMap.set(taskDate, currentHours + data.Time);
      });
    });
    return (dateHoursMap.get(date) || 0).toFixed(2);
  }

  getMiddleDates(start, end) {
    const middleDates = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      middleDates.push(this.datePipe.transform(currentDate, 'yyyy-MM-dd'));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return middleDates;
  }

  navigate(data) {
    const offset = data ? 7 : -7;
    const currentDate = new Date(this.date);
    currentDate.setDate(currentDate.getDate() + offset);
    this.date = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    this.taskArray = [];
    this.getTimesheetDetail();
  }

  getWeekRange(date: any) {
    date = new Date(date);
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return {
      startOfWeek: this.datePipe.transform(startOfWeek, 'yyyy-MM-dd'),
      endOfWeek: this.datePipe.transform(endOfWeek, 'yyyy-MM-dd')
    };
  }

  async addTask() {
    const clients = await this.loadCilents();
    const projects = await this.loadProjects();
    const task = new TaskName();
    const alertResult = await this.alertService.taskRequestAlert(task, clients, projects);

    if (alertResult.isConfirmed) {
      this.apiService.post(Api.TaskName, task).subscribe((data) => {
        if (data.IsValid) {
          this.alertService
            .Toast()
            .fire({ icon: 'success', title: 'Task Added Successfully' })
            .then(async (data) => {
              if (data.dismiss) {
                await this.getTimesheetDetail();
              }
            });
        }
      });
    }
  }

  async updateTask(task: TaskName) {
    const clients = await this.loadCilents();
    const projects = await this.loadProjects();
    const alertResult = await this.alertService.taskRequestAlert(task, clients, projects);

    if (alertResult.isConfirmed) {
      this.apiService.post(Api.TaskName, task).subscribe((data) => {
        if (data.IsValid) {
          this.alertService
            .Toast()
            .fire({ icon: 'success', title: 'Task Added Successfully' })
            .then(async (data) => {
              if (data.dismiss) {
                await this.getTimesheetDetail();
              }
            });
        }
      });
    }
  }

  loadCilents() {
    return this.apiService.getAll(Api.Client).toPromise();
  }

  loadProjects() {
    return this.apiService.getAll(Api.Project).toPromise();
  }
}
