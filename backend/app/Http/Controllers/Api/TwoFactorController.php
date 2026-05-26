<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserRememberDevice;
use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    public function setup2FA(Request $request)
    {
        $user = $request->user();
        $google2fa = new Google2FA();

        if (!$user->google2fa_secret) {
            $user->google2fa_secret = $google2fa->generateSecretKey();
            $user->save();
        }

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            'NST SSJ Portal',
            $user->username,
            $user->google2fa_secret,
        );

        return response()->json([
            'success' => true,
            'secret' => $user->google2fa_secret,
            'qr_code_url' => $qrCodeUrl,
        ]);
    }

    public function verify2FA(Request $request)
    {
        $request->validate([
            'otp' => 'required|digits:6',
        ], [
            'otp.required' => 'กรุณากรอกรหัส OTP',
            'otp.digits' => 'รหัส OTP ต้องมี 6 หลัก',
        ]);

        $user = $request->user();
        $google2fa = new Google2FA();
        $isValid = $google2fa->verifyKey($user->google2fa_secret, $request->otp);

        if ($isValid) {
            if (!$user->google2fa_enabled) {
                $user->google2fa_enabled = true;
                $user->save();
            }
            return response()->json([
                'success' => true,
                'message' => 'ยืนยันรหัสความปลอดภัยสำเร็จ',
            ]);
        }
        return response()->json([
            'success' => false,
            'message' => 'รหัส OTP ไม่ถูกต้อง หรือหมดเวลา กรุณาลองใหม่',
        ], 400);
    }

    public function reset2FA(Request $request, int $userId)
    {
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'ปฏิเสธการเข้าถึง คุณไม่มีสิทธิ์ดำเนินการในส่วนนี้',
            ], 403);
        }
        $targetUser = User::find($userId);
        if (!$targetUser) {
            return response()->json([
                'success' => false,
                'message' => 'ไม่พบข้อมูลผู้ใช้งานที่ระบุในระบบ',
            ], 404);
        }
        try {
            $targetUser->google2fa_secret = null;
            $targetUser->google2fa_enabled = 0;
            $targetUser->save();
            UserRememberDevice::where('user_id', $targetUser->id)->delete();
            return response()->json([
                'success' => true,
                'message' => "ทำการรีเซ็ตระบบความปลอดภัย 2FA ของคุณ {$targetUser->username} เรียบร้อยแล้ว",
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'เกิดข้อผิดพลาดในการรีเซ็ตข้อมูลความปลอดภัย',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
