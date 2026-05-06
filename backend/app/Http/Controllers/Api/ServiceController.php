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
        return response()->json($services);
    }

    public function store(StoreServiceRequest $request){
        try {
            $service=Service::create($request->validated());
            return response()->json([
                'success'=>true,
                'message'=>'เพิ่มบริการใหม่เรียบร้อยแล้ว',
                'data'=>$service,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Service Creation Error: '.$e->getMessage());
            return response()->json([
                'success'=>false,
                'message'=>'ไม่สามารถเพิ่มข้อมูลได้',
            ], 500);
        }
    } 

    public function show(Service $service){
        return response()->json([
            'success'=>true,
            'data'=>$service,
        ]);
    }

    public function update(UpdateServiceRequest $request, Service $service){
        //$service=ข้อมูลตัวเดิม, $request=ข้อมูลตัวใหม่
        $service->update($request->validated());
        return response()->json([
            'success'=>true,
            'message'=>'อัปเดตข้อมูลเรียบร้อยแล้ว',
            'data'=>$service,
        ]);
    }

    public function destroy(){
        
    }
}
