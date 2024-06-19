import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layouts/admin/admin.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import LoginComponent from './demo/authentication/login/login.component';
import { GuestAuthGuardService } from './services/guest-auth-guard.service';
import { AdminAuthGuardService } from './services/admin-auth-guard.service';
import { NotFoundComponent } from './demo/default/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminAuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component')
      },
       //----------------timesheet route---------------------------------------

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
    canActivate: [GuestAuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component')
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
