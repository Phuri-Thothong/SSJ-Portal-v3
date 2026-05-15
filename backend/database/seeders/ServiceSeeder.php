<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Service::create([
            'title' => 'Project Plan',
            'description' => 'จัดการแผนงานและติดตามสถานะโครงการต่าง ๆ ของหน่วยงาน',
            'icon' => 'fa-solid fa-diagram-project',
            'color_from' => '#FFD600',
            'color_to' => '#FF9900',
            'link_url' => 'https://example.com/project-plan',
        ]);
        Service::create([
            'title' => 'ระบบลาออนไลน์',
            'description' => 'ระบบสำหรับแจ้งลาพักผ่อนและลาป่วยของบุคลากร',
            'icon' => 'fa-solid fa-paper-plane',
            'color_from' => '#3b82f6',
            'color_to' => '#2dd4bf',
            'link_url' => 'https://example.com/leave',
        ]);
        Service::factory()->count(10)->create();
    }
}
