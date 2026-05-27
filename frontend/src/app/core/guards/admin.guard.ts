import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ToastService } from "../../services/toast.service";


export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router =inject(Router);
    const toastService = inject(ToastService);

    if (authService.currentUser() && authService.currentUser()?.role === 'admin') {
        return true;
    }
    toastService.showToast('คุณไม่มีสิทธิ์ในการเข้าถึงระบบบริหารจัดการผู้ใช้งาน', 'danger');
    return router.parseUrl('/portal');
}