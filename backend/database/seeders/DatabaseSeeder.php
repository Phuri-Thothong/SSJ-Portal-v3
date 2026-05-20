<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin สสจ.นครศรีฯ',
            'national_id' => '1809999999991',
            'username' => 'admin_nst',
            'password' => Hash::make('12345678'),
            'email' => 'admin@nst.go.th',
            'phone' => '0812345678',
            'workgroup' => 'กลุ่มงานสุขภาพดิจิทัล',
            'role' => 'admin',
            'is_activated' => true,
            'activated_at' => Carbon::now(),
        ]);

        User::create([
            'name' => 'เจ้าหน้าที่ทั่วไป',
            'national_id' => '1809999999992',
            'username' => 'user_test',
            'password' => Hash::make('12345678'),
            'email' => 'user_test@nst.go.th',
            'phone' => '0898765432',
            'workgroup' => 'กลุ่มงานพัฒนายุทธศาสตร์',
            'role' => 'user',
            'is_activated' => true,
            'activated_at' => Carbon::now(),
        ]);

        //ลงทะเบียน ServiceSeeder
        $this->call([
            ServiceSeeder::class
        ]);
    }
}
