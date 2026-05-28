<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'คุณไม่มีสิทธิ์ในการเข้าถึงข้อมูลส่วนนี้'
            ], 403);
        }
        try {
            $users = User::select([
                'id',
                'name',
                'username',
                'email',
                'profile_image',
                'national_id',
                'workgroup',
                'role',
                'google2fa_enabled',
            ])->orderBy('updated_at', 'desc')->get();
            return response()->json($users, 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'เกิดข้อผิดพลาดภายในระบบเซิร์ฟเวอร์ ไม่สามารถเรียกดูรายชื่อได้'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        //
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
