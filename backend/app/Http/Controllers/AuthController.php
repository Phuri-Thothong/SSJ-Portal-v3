<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
        if (Auth::attempt($credentials)) {
            /** @var \App\Models\User $user */
            $user = Auth::user();
            $token = $user->createToken('ssj_portal_token')->plainTextToken;
            return response()->json([
                'success' => true,
                'token' => $token,
                'message' => 'เข้าสู่ระบบสำเร็จ',
                'user' => $user,
            ], 200);
        }
        return response()->json([
            'success' => false,
            'message' => 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
        ], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'success' => true,
            'message' => 'ออกจากระบบบเรียบร้อยแล้ว'
        ], 200);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ], 200);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ], [
            'email.required' => 'กรุณากรอกอีเมลเจ้าหน้าที่',
            'email.email' => 'รูปแบบอีเมลไม่ถูกต้อง',
            'email.exists' => 'ไม่พบอีเมลนี้ในระบบสำนักงาน',
        ]);
        $token = Str::random(60);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => Carbon::now(),
            ]
        );

        $link = "http://localhost:4200/reset-password?token={$token}&email={$request->email}";

        $botToken = env('TELEGRAM_BOT_TOKEN');
        $chatId = env('TELEGRAM_CHAT_ID');

        try {
            Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => "🔔 <b>[คำขอกู้รหัสผ่าน SSJ Portal]</b>\n\n" .
                    "📧 อีเมลเจ้าหน้าที่: {$request->email}\n" .
                    "⏰ เวลาที่ยื่นคำขอ: " . Carbon::now()->format('Y-m-d H:i:s') . "\n\n" .
                    "🔗 แอดมินสามารถคลิกลิงก์นี้ หรือคัดลอกส่งให้เจ้าหน้าที่ได้โดยตรง:\n" .
                    "<a href=\"{$link}\">{$link}</a>",
                'parse_mode' => 'HTML',
            ]);
        } catch (\Exception $e) {
            Log::error("Telegram Bot Error: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'ระบบได้ส่งสัญญาณแจ้งเตือนการกู้รหัสผ่านไปยังผู้ดูแลระบบเรียบร้อยแล้ว',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
        ]);

        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json(['success' => false, 'message' => 'โทเค็นไม่ถูกต้องหรือหมดอายุ'], 400);
        }

        if (Carbon::parse($record->created_at)->addHours(1)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['success' => false, 'message' => 'ลิงก์นี้หมดอายุการใช้งานแล้ว'], 400);
        }

        $request->validate([
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
                function ($attribute, $value, $fail) use ($request) {
                    $user = \App\Models\User::where('email', $request->email)->first();
                    if ($user && Hash::check($value, $user->password)) {
                        $fail('รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิมที่ใช้งานอยู่');
                    }
                },
            ],
        ], [
            'password.required' => 'กรุณากรอกรหัสผ่านใหม่',
            'password.min' => 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
            'password.letters' => 'รหัสผ่านต้องประกอบด้วยตัวอักษรภาษาอังกฤษ',
            'password.mixed_case' => 'รหัสผ่านต้องมีทั้งตัวพิมพ์เล็ก (a-z) และตัวพิมพ์ใหญ่ (A-Z) รวมกัน',
            'password.numbers' => 'รหัสผ่านต้องมีตัวเลขประกอบอยู่ด้วยอย่างน้อย 1 ตัว',
            'password.symbols' => 'รหัสผ่านต้องมีอักขระพิเศษประกอบอยู่ด้วยอย่างน้อย 1 ตัว (เช่น @, #, $, %)',
        ]);


        $user = \App\Models\User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['success' => true, 'message' => 'เปลี่ยนรหัสผ่านใหม่สำเร็จแล้ว']);
    }

    public function checkToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email'
        ]);
        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();
        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json([
                'success' => false, 
                'message' => 'ลิงก์กู้คืนรหัสผ่านไม่ถูกต้อง หรือถูกใช้งานไปแล้ว'
            ], 400);
        }
        if (Carbon::parse($record->created_at)->addHours(1)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            
            return response()->json([
                'success' => false, 
                'message' => 'ลิงก์กู้คืนรหัสผ่านหมดอายุความปลอดภัยแล้ว'
            ], 400);
        }
        return response()->json([
            'success' => true,
            'message' => 'โทเค็นถูกต้องและพร้อมใช้งาน'
        ], 200);
    }

    public function verifyStep1(Request $request)
    {
        $request->validate([
            'national_id' => 'required|digits:13|exists:users,national_id',
        ], [
            'national_id.required' => 'กรุณากรอกเลขประจำตัวประชาชน',
            'national_id.digits'   => 'เลขประจำตัวประชาชนต้องเป็นตัวเลข 13 หลัก',
            'national_id.exists'   => 'ไม่พบข้อมูลเลขประจำตัวประชาชนนี้ในระบบบุคลากร',
        ]);

        $user = User::where('national_id', $request->national_id)->first();
        if ($user->is_activated) {
            return response()->json([
                'success' => false,
                'message' => 'บัญชีนี้เคยถูกเปิดใช้งานในระบบไปเรียบร้อยแล้ว',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'ตรวจสอบสิทธิ์ผ่านเรียบร้อย'
        ], 200);
    }

    public function verifyStep2(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users,username',
            'email'    => 'required|email|unique:users,email',
        ], [
            'username.required' => 'กรุณาตั้งชื่อผู้ใช้งาน',
            'username.unique'   => 'ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว กรุณาตั้งชื่อใหม่',
            'email.required'    => 'กรุณากรอกอีเมลสำหรับติดต่อ',
            'email.email'       => 'รูปแบบอีเมลไม่ถูกต้อง',
            'email.unique'      => 'อีเมลนี้ถูกใช้ลงทะเบียนในระบบแล้ว',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'ชื่อผู้ใช้งานและอีเมลนี้สามารถใช้งานได้'
        ], 200);
    }

    public function activateAccount(Request $request)
    {
        $request->validate([
            'national_id' =>  'required|digits:13|exists:users,national_id',
            'username' => 'required|string|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|digits:10',
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
        ], [
            'national_id.required' => 'กรุณากรอกเลขประจำตัวประชาชน',
            'national_id.digits' => 'เลขประจำตัวประชาชนต้องเป็นตัวเลข 13 หลัก',
            'national_id.exists'   => 'เลขประจำตัวประชาชนไม่ถูกต้องหรือไม่พบในระบบ',
            'username.required' => 'กรุณาตั้งชื่อผู้ใช้งาน',
            'username.unique' => 'ชื่อผู้ใช้งานนี้ถูกใช้ไปแล้ว กรุณาตั้งชื่อใหม่',
            'email.required' => 'กรุณากรอกอีเมลสำหรับติดต่อ',
            'email.email' => 'รูปแบบอีเมลไม่ถูกต้อง',
            'email.unique' => 'อีเมลนี้ถูกใช้ลงทะเบียนในระบบแล้ว',
            'phone.digits' => 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักเท่านั้น',
            'password.required' => 'กรุณากรอกรหัสผ่านใหม่',
            'password.confirmed' => 'รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน',
            'password.min' => 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร',
            'password.letters' => 'รหัสผ่านต้องประกอบด้วยตัวอักษรภาษาอังกฤษ',
            'password.mixed_case' => 'รหัสผ่านต้องมีทั้งตัวพิมพ์เล็ก (a-z) และตัวพิมพ์ใหญ่ (A-Z) รวมกัน',
            'password.numbers' => 'รหัสผ่านต้องมีตัวเลขประกอบอยู่ด้วยอย่างน้อย 1 ตัว',
            'password.symbols' => 'รหัสผ่านต้องมีอักขระพิเศษประกอบอยู่ด้วยอย่างน้อย 1 ตัว (เช่น @, #, $, %)',
        ]);
    }
}
