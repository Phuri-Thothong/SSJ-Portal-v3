<?php

use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// === Public Routes ===
Route::post('/login', [AuthController::class, 'login'])
    ->name('login');
// === Protected Routes ===
Route::middleware('auth:sanctum')->group(function () {
    // --- Auth Management ---
    Route::get('/me', [AuthController::class, 'me'])
        ->name('me');
    Route::post('/logout', [AuthController::class, 'logout'])
        ->name('logout');
    
    Route::prefix('services')->group(function () {
        // --- Standard CRUD ---
        //แสดงข้อมูลบริการทั้งหมด
        Route::get('/', [ServiceController::class, 'index'])
            ->name('api.services.index');
        //บันทึกข้อมูลบริการใหม่
        Route::post('/', [ServiceController::class, 'store'])
            ->name('api.services.store');
        //แสดงข้อมูลบริการเฉพาะไอดี
        Route::get('/{service}', [ServiceController::class, 'show'])
            ->name('api.services.show')
            ->whereNumber('service');
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


