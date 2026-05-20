import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ServicePortalComponent } from './components/service-portal/service-portal.component';
import { authGuard } from './core/guards/auth.guard';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
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
        title: 'ลืมรหัสผ่าน | NST SSJ Portal',
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
        title: 'ตั้งรหัสผ่านใหม่ | NST SSJ Portal',
    },
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: '**', redirectTo: 'login'},
];
