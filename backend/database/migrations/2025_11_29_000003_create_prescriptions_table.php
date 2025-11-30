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
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('appointment_id')->constrained('appointments')->onDelete('cascade');
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('doctor_id')->constrained('users')->onDelete('cascade');
            
            // Right Eye
            $table->decimal('right_sphere', 5, 2)->nullable();
            $table->decimal('right_cylinder', 5, 2)->nullable();
            $table->integer('right_axis')->nullable();
            $table->decimal('right_add', 5, 2)->nullable();
            
            // Left Eye
            $table->decimal('left_sphere', 5, 2)->nullable();
            $table->decimal('left_cylinder', 5, 2)->nullable();
            $table->integer('left_axis')->nullable();
            $table->decimal('left_add', 5, 2)->nullable();
            
            // Pupillary Distance
            $table->decimal('pd', 5, 2)->nullable();
            
            $table->text('notes')->nullable();
            $table->date('prescription_date');
            $table->date('expiry_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
};
