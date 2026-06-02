<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'national_id' => 'required|digits:13',
            'name' => 'required|string|max:255',
            'workgroup' => 'required|string',
            'role' => 'required|in:user,admin',
        ];
    }

    public function messages(): array
    {
        return [
            'national_id.required' => 'กรุณาระบุเลขประจำตัวประชาชน 13 หลัก',
            'national_id.digits'   => 'เลขประจำตัวประชาชนต้องเป็นตัวเลขความยาว 13 หลักเท่านั้น',
            'name.required'        => 'กรุณาระบุชื่อ-นามสกุลจริงของเจ้าหน้าที่',
            'name.string'          => 'รูปแบบชื่อ-นามสกุลไม่ถูกต้อง',
            'name.max'             => 'ชื่อ-นามสกุลต้องมีความยาวไม่เกิน 255 ตัวอักษร',
            'workgroup.required'   => 'กรุณาเลือกหรือระบุสังกัดกลุ่มงาน',
            'role.required'        => 'กรุณาเลือกสิทธิ์การเข้าใช้งานระบบ',
            'role.in'              => 'ระดับสิทธิ์ไม่ถูกต้อง (ต้องเป็นผู้ดูแลระบบหรือเจ้าหน้าที่ทั่วไปเท่านั้น)',
        ];
    }
}
