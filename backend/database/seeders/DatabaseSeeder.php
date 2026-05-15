<?php

namespace Database\Seeders;

use App\Models\User;
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
            'username' => 'admin_nst',
            'password' => Hash::make('12345678'),
            'workgroup' => 'กลุ่มงานสุขภาพดิจิทัล',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'เจ้าหน้าที่ทั่วไป',
            'username' => 'user_test',
            'password' => Hash::make('12345678'),
            'workgroup' => 'กลุ่มงานพัฒนายุทธศาสตร์',
            'role' => 'user',
        ]);

        //ลงทะเบียน ServiceSeeder
        $this->call([
            ServiceSeeder::class
        ]);
    }
}
