<?php

use App\Models\Service;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('trash:clear', function(){
    Service::onlyTrashed()->forceDelete();
    $this->info('ถังขยะถูกทิ้งเรียบร้อยแล้ว');
})->purpose('เพื่อทิ้งข้อมูลที่อยู่ในถังขยะทั้งหมด');

Schedule::call(function(){
    Service::onlyTrashed()
        ->where('deleted_at', '<', now()->subDays(30))
        ->forceDelete();
})->daily();
