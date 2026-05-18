<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role === 'admin'){
            return $next($request);
        }
        return response()->json([
            'status' => false,
            'message' => 'ปฏิเสธการเข้าถึง: สิทธิ์ของคุณไม่สามารถจัดการข้อมูลในส่วนนี้ได้'
        ], 403);
    }
}
