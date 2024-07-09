import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import LoginComponent from './common/component/login/login.component';
import { AdminAuthGuardService } from './common/service/authguard/admin-auth-guard.service';
import { NotFoundComponent } from './common/unauthorized/not-found/not-found.component';
import { AdminComponent } from './common/component/layouts/admin/admin.component';
import { GuestComponent } from './common/component/layouts/guest/guest.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminAuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./common/component/dashboard/dashboard.component')
      },
       //----------------Employees route---------------------------------------
       {
        path: 'employees',
        loadComponent: () => import('./hrms/admin/employe/employee.component')
      },
      //----------------Leave route---------------------------------------
      {
        path: 'leaves',
        loadComponent: () => import('./hrms/admin/leave/leave.component')
      },
      //----------------Leave route---------------------------------------
      {
        path: 'attendances',
        loadComponent: () => import('./hrms/admin/attendance/attendance.component')
      },
       //----------------Salary route---------------------------------------
       {
        path: 'salarys',
        loadComponent: () => import('./hrms/admin/employee-salary/employee-salary.component')
      },
      //----------------Salary route---------------------------------------
      {
        path: 'timesheets',
        loadComponent: () => import('./hrms/admin/timesheet/timesheet.component')
      },
       //----------------Salary route---------------------------------------
       {
        path: 'holidays',
        loadComponent: () => import('./common/component/holiday/holiday.component')
      },
      //----------------Salary route---------------------------------------
      {
        path: 'birthdays',
        loadComponent: () => import('./common/component/birthdays/birthdays.component')
      },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  },
  {
    path: 'guest',
    component: GuestComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./common/component/dashboard/dashboard.component')
      },

      //----------------timesheet route---------------------------------------

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
