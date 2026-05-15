import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ServicePortalComponent } from './components/service-portal/service-portal.component';
import { authGuard } from './core/guards/auth.guard';

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
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: '**', redirectTo: 'login'},
];
