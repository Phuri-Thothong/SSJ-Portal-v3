import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ServicePortalComponent } from './components/service-portal/service-portal.component';
import { authGuard } from './core/guards/auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [noAuthGuard],
        title: 'เข้าสู่ระบบ | NST SSJ Portal',
    },
    {
        path: 'portal',
        component: ServicePortalComponent,
        canActivate: [authGuard],
        title: 'หน้าหลักระบบบริการ | NST SSJ Portal'
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [noAuthGuard],
        title: 'ลืมรหัสผ่าน | NST SSJ Portal',
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
        title: 'ตั้งรหัสผ่านใหม่ | NST SSJ Portal',
    },
    { 
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [noAuthGuard],
        component: LoginComponent,
    },
    { path: '**', redirectTo: 'login'},
];
