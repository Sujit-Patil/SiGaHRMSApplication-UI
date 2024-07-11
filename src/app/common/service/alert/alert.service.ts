import { Injectable } from '@angular/core';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { LeaveRequest, leaveTypeOptions } from '../../datatypes/DataTypes';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(
    public readonly swalTargets: SwalPortalTargets,
    private datePipe: DatePipe
  ) {}

  leaveRequestAlert = (leaveRequest: LeaveRequest) => {
    return Swal.fire({
      title: 'Leave Request Details',
      html: `
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="LeaveType">Leave Type</label>
              <select
                class="form-control"
                id="LeaveType"
                placeholder="Select Leave Type">
                ${leaveTypeOptions
                  .map(
                    (option) =>
                      `<option value="${option.value}" ${option.value === leaveRequest.LeaveType ? 'selected' : ''}>${
                        option.label
                      }</option>`
                  )
                  .join('')}
              </select>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="FromDate">From Date</label>
              <input
                type="date"
                class="form-control"
                id="FromDate"
                value="${leaveRequest.FromDate}"
                min="${this.datePipe.transform(new Date(), 'yyyy-MM-dd')}"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="ToDate">To Date</label>
              <input
                type="date"
                class="form-control"
                id="ToDate"
                value="${leaveRequest.ToDate}"
                min="${leaveRequest.FromDate}" 
              />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label class="form-label" for="IsHalfDay">Half Day</label>
              <select
                class="form-control"
                id="IsHalfDay"
                placeholder="Select Half Day">
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
              <textarea
                class="form-control"
                id="Reason"
                placeholder="${leaveRequest.Reason != undefined ? leaveRequest.Reason : 'Type Reason here'}">${
                  leaveRequest.Reason != undefined ? leaveRequest.Reason : ''
                }</textarea>
            </div>
          </div>
        </div>
      `,
      focusConfirm: true,
      preConfirm: () => {
        leaveRequest.LeaveType = (document.getElementById('LeaveType') as HTMLSelectElement).value;
        leaveRequest.FromDate = (document.getElementById('FromDate') as HTMLInputElement).value;
        leaveRequest.ToDate = (document.getElementById('ToDate') as HTMLInputElement).value;
        leaveRequest.IsHalfDay = (document.getElementById('IsHalfDay') as HTMLSelectElement).value === 'true';
        leaveRequest.Reason = (document.getElementById('Reason') as HTMLTextAreaElement).value;
  
        if (!leaveRequest.LeaveType) {
          Swal.showValidationMessage('Please select a leave type');
          return false;
        }
        if (!leaveRequest.FromDate) {
          Swal.showValidationMessage('Please select a from date');
          return false;
        }
  
        const fromDate = new Date(leaveRequest.FromDate);
        if (fromDate.getUTCDay() === 0 || fromDate.getUTCDay() === 6) {
          Swal.showValidationMessage("Sorry, From Date falls on a weekend!");
          return false;
        }
  
        if (!leaveRequest.ToDate) {
          Swal.showValidationMessage('Please select a to date');
          return false;
        }
  
        const toDate = new Date(leaveRequest.ToDate);
        if (toDate.getUTCDay() === 0 || toDate.getUTCDay() === 6) {
          Swal.showValidationMessage("Sorry, To Date falls on a weekend!");
          return false;
        }
  
        if (toDate < fromDate) {
          Swal.showValidationMessage('To date cannot be earlier than from date');
          return false;
        }
        
        if (!leaveRequest.Reason.trim()) {
          Swal.showValidationMessage('Please enter a reason');
          return false;
        }
        
        return leaveRequest;
      }
    });
  };
  


 Show=(Reason)=> Swal.fire({
    input: 'textarea',
    inputLabel: 'Message',
    inputValue: Reason
  })


  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success m-3',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

   Toast =()=> Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  DeleteAlert=()=>Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  })

  Task=async ()=>Swal.fire({
    input: "textarea",
    inputLabel: "Message",
    inputPlaceholder: "Type your message here...",
    inputAttributes: {
      "aria-label": "Type your message here"
    },
    showCancelButton: true
  })

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
