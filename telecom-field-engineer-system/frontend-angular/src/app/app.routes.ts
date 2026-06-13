import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./components/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/user-dashboard/user-dashboard').then(m => m.UserDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['USER'] }
  },
  {
    path: 'raise-ticket',
    loadComponent: () => import('./components/raise-ticket/raise-ticket').then(m => m.RaiseTicketComponent),
    canActivate: [authGuard],
    data: { roles: ['USER'] }
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    data: { roles: ['USER', 'ADMIN', 'ENGINEER'] }
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'engineer',
    loadComponent: () => import('./components/engineer-dashboard/engineer-dashboard').then(m => m.EngineerDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['ENGINEER'] }
  },
  {
    path: 'hazards',
    loadComponent: () => import('./components/hazard-management/hazard-management').then(m => m.HazardManagementComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'ENGINEER'] }
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
