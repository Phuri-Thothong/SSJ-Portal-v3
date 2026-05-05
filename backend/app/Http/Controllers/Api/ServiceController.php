<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    function index(){
        //ดึงข้อมูลจากตาราง services
        $services=Service::all();
        return response()->json($services);
    }
}
