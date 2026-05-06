<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ServiceController extends Controller
{
    public function index(){
        //ดึงข้อมูลจากตาราง services
        $services=Service::all();
        return response()->json([
            'success' => true,
            'data' => $services
        ], 200);
    }

    public function store(StoreServiceRequest $request){
        try {
            $service=Service::create($request->validated());
            return response()->json([
                'success'=>true,
                'message'=>'เพิ่มข้อมูลใหม่เรียบร้อยแล้ว',
                'data'=>$service,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Service Creation Error: '.$e->getMessage());
            return response()->json([
                'success'=>false,
                'message'=>'ไม่สามารถเพิ่มข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
            ], 500);
        }
    } 

    public function show(Service $service){
        return response()->json([
            'success'=>true,
            'data'=>$service,
        ], 200);
    }

    public function update(UpdateServiceRequest $request, Service $service){
        //$service=ข้อมูลตัวเดิมจากตาราง, $request=ข้อมูลตัวใหม่ที่แอดมินกรอก
        try {
            $service->update($request->validated());
            return response()->json([
                'success'=>true,
                'message'=>'อัปเดตข้อมูลเรียบร้อยแล้ว',
                'data'=>$service,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Update Service Error: '.$e->getMessage());
            return response()->json([
                'success'=>false,
                'message'=>'ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
            ], 500);
        }
    }

    public function destroy(Service $service){
        try {
            $service->delete();
            return response()->json([
                'success'=>true,
                'message'=>'ย้ายข้อมูลไปยังถังขยะเรียบร้อยแล้ว',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Service Deletion Error: '.$e->getMessage());
            return response()->json([
                'success'=>false,
                'message'=>'ไม่สามารถย้ายข้อมูลไปยังถังขยะได้ กรุณาลองใหม่อีกครั้ง'
            ], 500);
        }
    }

    public function trashed(){
        $services=Service::onlyTrashed()->get();
        return response()->json([
            'success'=>true,
            'data'=>$services,
        ], 200);
    }

    public function showTrashed(Service $service){
        return response()->json([
            'success'=>true,
            'data'=>$service,
        ], 200);
    }

    public function restore(Service $service){
        try {
            $service->restore();
            return response()->json([
                'success'=>true,
                'message'=>'กู้คืนข้อมูลจากถังขยะเรียบร้อยแล้ว',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Service Restoration Error: '.$e->getMessage());
            return response()->json([
                'success'=>false,
                'message'=>'ไม่สามารถกู้คืนข้อมูลจากถังขยะได้ กรุณาลองใหม่อีกครั้ง',
            ], 500);
        }
        
    }

    public function forceDelete(Service $service){
        try {
            $service->forceDelete();
            return response()->json([
                'success'=>true,
                'message'=>'ลบข้อมูลถาวรเรียบร้อยแล้ว',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Service Force Deletion Error: '.$e->getMessage());
            return response()->json([
                'success'=>false,
                'message'=>'ไม่สามารถลบข้อมูลถาวรได้ กรุณาลองใหม่อีกครั้ง',
            ], 500);
        }
    }
}
