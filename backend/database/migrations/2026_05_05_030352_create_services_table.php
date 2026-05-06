<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title'); //ชื่อบริการ
            $table->text('description')->nullable(); //คำอธิบาย
            $table->string('icon')->default('fa-solid fa-star'); //คลาสไอคอนจาก FontAwesome
            $table->string('link_url')->default('#'); //ลิงก์บริการ
            $table->boolean('is_new_tab')->default(true); //เปิดในแท็บใหม่หรือไม่
            $table->string('status')->default('online'); //สถานะของบริการ online หรือ maintenance
            //เก็บสี Gradient
            $table->string('color_from')->default('#9CA3AF');
            $table->string('color_to')->default('#D1D5DB');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
