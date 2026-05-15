<?php

use App\Http\Controllers\Api\ServiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// === Soft Delete ===
//แสดงข้อมูลที่อยู่ในถังขยะทุกตัว
Route::get('services/trashed', [ServiceController::class, 'trashed'])
    ->name('api.services.trashed');
//แสดงข้อมูลที่อยู่ในถังขยะเฉพาะไอดี
Route::get('services/trashed/{service}', [ServiceController::class, 'showTrashed'])
    ->name('api.services.showTrashed')
    ->whereNumber('service')
    ->withTrashed();
//กู้คืนข้อมูลที่อยู่ในถังขยะ
Route::post('services/trashed/{service}/restore', [ServiceController::class, 'restore'])
    ->name('api.services.restore')
    ->whereNumber('service')
    ->withTrashed();
//ลบข้อมูลออกจากถังขยะถาวร
Route::delete('services/trashed/{service}/force-delete', [ServiceController::class, 'forceDelete'])
    ->name('api.services.force-delete')
    ->whereNumber('service')
    ->withTrashed();

// === Standard CRUD ===
//แสดงข้อมูลบริการทั้งหมด
Route::get('/services', [ServiceController::class, 'index'])
    ->name('api.services.index');
//บันทึกข้อมูลบริการใหม่
Route::post('/services', [ServiceController::class, 'store'])
    ->name('api.services.store');
//แสดงข้อมูลบริการเฉพาะไอดี
Route::get('services/{service}', [ServiceController::class, 'show'])
    ->name('api.services.show')
    ->whereNumber('service');
//อัปเดตข้อมูลบริการ
Route::put('services/{service}', [ServiceController::class, 'update'])
    ->name('api.services.update')
    ->whereNumber('service');
//ย้ายข้อมูลบริการไปยังถังขยะ
Route::delete('services/{service}', [ServiceController::class, 'destroy'])
    ->name('api.services.delete')
    ->whereNumber('service');
