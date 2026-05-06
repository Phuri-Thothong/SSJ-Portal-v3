<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
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
            'title'=>'required|string|max:50', //ต้องมีข้อมูล และห้ามเกิน 50 ตัวอักษร
            'description'=>'nullable|string', //เป็นค่าว่างได้
            'icon'=>'sometimes|string', //ถ้ามีส่งมาค่อยตรวจ
            'link_url'=>'required|url',
            'is_new_tab'=>'boolean',
            'status'=>'required|in:online,maintenance', //ต้องเป็น online หรือ maintenance เท่านั้น
            'color_from'=>'nullable|string|hex_color',
            'color_to'=>'nullable|string|hex_color',
        ];
    }
}
