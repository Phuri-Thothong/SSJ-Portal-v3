<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return response()->json([
                'success' => true,
                'message' => 'เข้าสู่ระบบสำเร็จ',
                'user' => Auth::user(),
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
        ], 400);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json([
            'success' => true,
            'message' => 'ออกจากระบบบเรียบร้อยแล้ว'
        ]);
    }

    public function me()
    {
        return response()->json([
            'user' => Auth::user()
        ]);
    }
}
