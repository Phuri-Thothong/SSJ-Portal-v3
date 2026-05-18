import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ServicePortalComponent } from './components/service-portal/service-portal.component';
import { authGuard } from './core/guards/auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login | SSJ Portal',
    },
    {
        path: 'portal',
        component: ServicePortalComponent,
        canActivate: [authGuard],
        title: 'Dashboard | SSJ Portal'
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
    },
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: '**', redirectTo: 'login'},
];
