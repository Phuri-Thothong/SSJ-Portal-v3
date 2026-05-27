import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { LoginComponent } from './components/login/login.component';
import { ServicePortalComponent } from './components/service-portal/service-portal.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DeviceManagementComponent } from './components/device-management/device-management.component';
import { UserManagementComponent } from './components/user-management/user-management.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [noAuthGuard],
        title: 'เข้าสู่ระบบ | NST SSJ Portal',
    },
    {
        path: 'portal',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: ServicePortalComponent,
                title: 'หน้าหลักระบบบริการ | NST SSJ Portal',
            },
            {
                path: 'devices',
                component: DeviceManagementComponent,
                title: 'จัดการอุปกรณ์ที่จดจำไว้ | NST SSJ Portal',
            },
            {
                path: 'users',
                component: UserManagementComponent,
                canActivate: [adminGuard],
                title: 'จัดการผู้ใช้งาน | NST SSJ Portal',
            },
        ]
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
