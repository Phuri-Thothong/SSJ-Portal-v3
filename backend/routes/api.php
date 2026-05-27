<?php

use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TwoFactorController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// =====================
// === Public Routes ===
// =====================
//ตรวจสอบชื่อผู้ใช้และรหัสผ่านด่านแรก
Route::post('/login', [AuthController::class, 'login'])
    ->name('api.login');
//การยืนยันสำหรับเปิดใช้งานบัญชีบุคลากร มี 3 ขั้นตอน
//(1) ตรวจสอบยืนยันข้อมูลขั้นแรก-ตรวจสอบหมายเลขประจำตัวประชาชน
Route::post('/verify-step1', [AuthController::class, 'verifyStep1'])
    ->name('api.verify-step1');
//(2) ตรวจสอบยืนยันข้อมูลขั้นที่สอง-ตรวจสอบชื่อผู้ใช้งาน, อีเมลติดต่อ และเบอร์โทรศัพท์
Route::post('/verify-step2', [AuthController::class, 'verifyStep2'])
    ->name('api.verify-step2');
//(3) ตรวจสอบยืนยันข้อมูลขั้นที่สาม-ตรวจสอบข้อมูลที่กรอกทั้งหมดอีกครั้ง และรหัสผ่านที่ตั้ง
Route::post('/activate-account', [AuthController::class, 'activateAccount'])
    ->name('api.activate-account');
//ส่งลิงก์คำขอรีเซ็ตรหัสผ่านเมื่อลืมรหัสผ่าน
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
    ->name('api.forgot-password');
//บันทึกเปลี่ยนรหัสผ่านใหม่ในระบบ
Route::post('/reset-password', [AuthController::class, 'resetPassword'])
    ->name('api.reset-password');
//ตรวจสอบความถูกต้องของ Token ที่ใช้ในลิงก์เปลี่ยนรหัสผ่าน
Route::post('/password/check-token', [AuthController::class, 'checkToken'])
    ->name('api.check-token');
//ตรวจสอบรหัส OTP เพื่อผูกบัญชี 2FA ครั้งแรกสุด
Route::post('/verify-setup-2fa', [AuthController::class, 'verifySetup2FA'])
    ->name('api.verify-setup-2fa');
//ตรวจสอบรหัส OTP รายวันเพื่อล็อกอินเข้าสู่ระบบปกติ
Route::post('/verify-daily-2fa', [AuthController::class, 'verifyDaily2FA'])
    ->name('api.verify-daily-2fa');

// ========================
// === Protected Routes ===
// ========================
Route::middleware('auth:sanctum')->group(function () {
    // --- Auth Management-จัดการเซสชันส่วนบุคคล ---
    //ดึงข้อมูลโปรไฟล์ของเจ้าหน้าที่ที่กำลังล็อกอินในปัจจุบัน
    Route::get('/me', [AuthController::class, 'me'])
        ->name('api.me');
    //ออกจากระบบและทำลาย Token ทิ้ง
    Route::post('/logout', [AuthController::class, 'logout'])
        ->name('api.logout');
    //เรียกขอคีย์ลับและ QR Code ไปเปิดระบบ 2FA
    Route::post('/2fa/setup', [TwoFactorController::class, 'setup2FA'])
        ->name('api.2fa.setup');
    //ตรวจสอบและกดยืนยันเปิดใช้งานระบบ 2FA
    Route::post('/2fa/verify', [TwoFactorController::class, 'verify2FA'])
        ->name('api.2fa.verify');
    //แสดงรายการคอมพิวเตอร์/เบราว์เซอร์ทั้งหมดที่ระบบจดจำสิทธิ์ไว้
    Route::get('/devices', [AuthController::class, 'getRememberedDevices'])
        ->name('api.devices.index');
    //สั่งถอนสิทธิ์การจดจำเครื่อง บังคับให้ต้องกรอก OTP
    Route::delete('/devices/{id}', [AuthController::class, 'revokeDevice'])
        ->name('api.devices.delete')
        ->whereNumber('id');

    // =======================
    // Services-จัดการข้อมูลบริการ
    // =======================
    Route::prefix('services')->group(function () {
        // --- [ทุกคนดูได้] ทั้งแอดมินและเจ้าหน้าที่ทั่วไป ---
        //แสดงข้อมูลบริการทั้งหมด
        Route::get('/', [ServiceController::class, 'index'])
            ->name('api.services.index');
        //แสดงข้อมูลบริการเฉพาะไอดี
        Route::get('/{service}', [ServiceController::class, 'show'])
            ->name('api.services.show')
            ->whereNumber('service');
        // --- [เฉพาะ ADMIN เท่านั้น] เขียน แก้ไข ลบ และจัดการถังขยะ ---
        Route::middleware('admin')->group(function () {
            //บันทึกข้อมูลบริการใหม่
            Route::post('/', [ServiceController::class, 'store'])
                ->name('api.services.store');
            //อัปเดตข้อมูลบริการ
            Route::put('/{service}', [ServiceController::class, 'update'])
                ->name('api.services.update')
                ->whereNumber('service');
            //ย้ายข้อมูลบริการไปยังถังขยะ
            Route::delete('/{service}', [ServiceController::class, 'destroy'])
                ->name('api.services.delete')
                ->whereNumber('service');
            
                Route::prefix('trashed')->group(function () {
                    // --- Soft Delete ---
                    //แสดงข้อมูลที่อยู่ในถังขยะทุกตัว
                    Route::get('/', [ServiceController::class, 'trashed'])
                        ->name('api.services.trashed');
                    //แสดงข้อมูลที่อยู่ในถังขยะเฉพาะไอดี
                    Route::get('/{service}', [ServiceController::class, 'showTrashed'])
                        ->name('api.services.showTrashed')
                        ->whereNumber('service')
                        ->withTrashed();
                    //กู้คืนข้อมูลที่อยู่ในถังขยะ
                    Route::post('/{service}/restore', [ServiceController::class, 'restore'])
                        ->name('api.services.restore')
                        ->whereNumber('service')
                        ->withTrashed();
                    //ลบข้อมูลออกจากถังขยะถาวร
                    Route::delete('/{service}/force-delete', [ServiceController::class, 'forceDelete'])
                        ->name('api.services.force-delete')
                        ->whereNumber('service')
                        ->withTrashed();
                });
        });
    });
    // ============================================
    // User Management-ระบบจัดการผู้ใช้งานสำหรับผู้ดูแลระบบ
    // ============================================
    //--- [เฉพาะ ADMIN เท่านั้น] จัดการความปลอดภัยบัญชีพนักงาน ---
    Route::middleware('admin')->group(function () {
        //แสดงข้อมูลผู้ใช้ทั้งหมด
        Route::get('/users', [UserController::class, 'index']);
        //รีเซ็ตระบบความปลอดภัย 2FA
        Route::post('/users/{userId}/reset-2fa', [TwoFactorController::class, 'reset2FA'])
            ->name('api.users.reset-2fa')
            ->whereNumber('userId');
            
    });
});
