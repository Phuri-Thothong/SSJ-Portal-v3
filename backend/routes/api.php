<?php

use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TwoFactorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// === Public Routes ===
Route::post('/login', [AuthController::class, 'login'])
    ->name('api.login');
Route::post('/verify-national-id', [AuthController::class, 'verifyNationalId'])
    ->name('api.verify-national-id');
Route::post('/activate-account', [AuthController::class, 'activateAccount'])
    ->name('api.activate-account');
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
    ->name('api.forgot-password');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])
    ->name('api.reset-password');
Route::post('/password/check-token', [AuthController::class, 'checkToken'])
    ->name('api.check-token');
// === Protected Routes ===
Route::middleware('auth:sanctum')->group(function () {
    // --- Auth Management ---
    Route::get('/me', [AuthController::class, 'me'])
        ->name('api.me');
    Route::post('/logout', [AuthController::class, 'logout'])
        ->name('api.logout');
    Route::post('/2fa/setup', [TwoFactorController::class, 'setup2FA'])
        ->name('api.2fa.setup');
    Route::post('/2fa/verify', [TwoFactorController::class, 'verify2FA'])
        ->name('api.2fa.verify');

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
});
