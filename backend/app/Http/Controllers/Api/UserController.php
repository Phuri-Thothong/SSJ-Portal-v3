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
        $validated = $request->validate([
            'national_id' => 'required|digits:13',
            'name' => 'required|string|max:255',
            'workgroup' => 'required|string',
            'role' => 'required|in:user,admin',
        ]);
        $users = User::firstOrCreate(
            ['national_id' => $validated['national_id']],
            [
                'name' => $validated['name'],
                'workgroup' => $validated['workgroup'],
                'role' => $validated['role'],
                'is_activated' => false,
                'password' => null,
            ]
        );
        if ($users->wasRecentlyCreated) {
            return response()->json([
                'success' => true,
                'message' => 'เตรียมข้อมูลพนักงานใหม่สำเร็จ',
            ], 200);
        }
        return response()->json([
                'success' => false,
                'message' => 'ไม่สามารถเพิ่มได้ เนื่องจากมีเลขบัตรประชาชนนี้ในระบบแล้ว',
            ], 422);
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
