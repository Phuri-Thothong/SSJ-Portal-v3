import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // สั่งให้ทุก Request แนบ Credentials หรือ Cookie ไปด้วยอัตโนมัติ
    const authReq = req.clone({
        withCredentials: true,
    });
    return next(authReq);
}
