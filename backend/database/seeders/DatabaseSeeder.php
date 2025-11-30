<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\DoctorSchedule;
use App\Models\Appointment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@eyeclinic.com'],
            [
                'name' => 'Admin Account',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '+1 (555) 100-0001',
                'address' => '123 Admin Boulevard, Suite 100',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create Doctors
        $doctor1 = User::firstOrCreate(
            ['email' => 'doctor@eyeclinic.com'],
            [
                'name' => 'Doctor Account',
                'password' => Hash::make('password'),
                'role' => 'doctor',
                'phone' => '+1 (555) 200-0001',
                'address' => '456 Medical Plaza, Floor 3',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $doctor2 = User::firstOrCreate(
            ['email' => 'doctor2@eyeclinic.com'],
            [
                'name' => 'Doctor Account 2',
                'password' => Hash::make('password'),
                'role' => 'doctor',
                'phone' => '+1 (555) 200-0002',
                'address' => '789 Healthcare Center, Suite 205',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Create Doctor Schedules
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        foreach ($days as $day) {
            DoctorSchedule::firstOrCreate(
                ['doctor_id' => $doctor1->id, 'day_of_week' => $day],
                [
                    'start_time' => '09:00',
                    'end_time' => '17:00',
                    'is_available' => true,
                ]
            );

            DoctorSchedule::firstOrCreate(
                ['doctor_id' => $doctor2->id, 'day_of_week' => $day],
                [
                    'start_time' => '10:00',
                    'end_time' => '18:00',
                    'is_available' => true,
                ]
            );
        }

        // Create Client Users
        $clients = [
            [
                'name' => 'Client Account',
                'email' => 'client@eyeclinic.com',
                'phone' => '+1 (555) 300-0001',
                'address' => '123 Maple Street, Apt 4B',
                'date_of_birth' => '1992-05-15',
            ],
            [
                'name' => 'Client Account 2',
                'email' => 'client2@eyeclinic.com',
                'phone' => '+1 (555) 300-0002',
                'address' => '456 Oak Avenue, Unit 12',
                'date_of_birth' => '1988-09-22',
            ],
            [
                'name' => 'Client Account 3',
                'email' => 'client3@eyeclinic.com',
                'phone' => '+1 (555) 300-0003',
                'address' => '789 Pine Drive, House 24',
                'date_of_birth' => '1995-03-10',
            ],
        ];

        foreach ($clients as $clientData) {
            User::firstOrCreate(
                ['email' => $clientData['email']],
                array_merge($clientData, [
                    'password' => Hash::make('password'),
                    'role' => 'client',
                    'is_active' => true,
                    'email_verified_at' => now(),
                ])
            );
        }

        // Create Products
        $products = [
            [
                'name' => 'Classic Aviator Sunglasses',
                'description' => 'Timeless aviator style with UV protection',
                'sku' => 'SUN-AVI-001',
                'category' => 'sunglasses',
                'price' => 2500.00,
                'stock_quantity' => 50,
                'brand' => 'Ray-Ban',
                'color' => 'Gold',
                'material' => 'Metal',
            ],
            [
                'name' => 'Modern Rectangle Frames',
                'description' => 'Contemporary rectangle eyeglasses for everyday wear',
                'sku' => 'EYE-REC-001',
                'category' => 'eyeglasses',
                'price' => 3500.00,
                'stock_quantity' => 30,
                'brand' => 'Oakley',
                'color' => 'Black',
                'material' => 'Acetate',
            ],
            [
                'name' => 'Round Vintage Frames',
                'description' => 'Retro-inspired round eyeglasses',
                'sku' => 'EYE-RND-001',
                'category' => 'eyeglasses',
                'price' => 2800.00,
                'stock_quantity' => 25,
                'brand' => 'Warby Parker',
                'color' => 'Tortoise',
                'material' => 'Acetate',
            ],
            [
                'name' => 'Sports Performance Sunglasses',
                'description' => 'High-performance sunglasses for active lifestyle',
                'sku' => 'SUN-SPT-001',
                'category' => 'sunglasses',
                'price' => 4200.00,
                'stock_quantity' => 40,
                'brand' => 'Oakley',
                'color' => 'Matte Black',
                'material' => 'Plastic',
            ],
            [
                'name' => 'Daily Contact Lenses (30 pack)',
                'description' => 'Comfortable daily disposable contact lenses',
                'sku' => 'CON-DAI-030',
                'category' => 'contact_lenses',
                'price' => 1500.00,
                'stock_quantity' => 100,
                'brand' => 'Acuvue',
            ],
            [
                'name' => 'Blue Light Blocking Glasses',
                'description' => 'Protect your eyes from digital screen strain',
                'sku' => 'EYE-BLU-001',
                'category' => 'eyeglasses',
                'price' => 1800.00,
                'stock_quantity' => 60,
                'brand' => 'Felix Gray',
                'color' => 'Clear',
                'material' => 'Plastic',
            ],
            [
                'name' => 'Eyeglass Cleaning Kit',
                'description' => 'Complete cleaning solution for eyewear',
                'sku' => 'ACC-CLN-001',
                'category' => 'accessories',
                'price' => 450.00,
                'stock_quantity' => 150,
                'brand' => 'Zeiss',
            ],
            [
                'name' => 'Hard Shell Eyeglass Case',
                'description' => 'Protective case for your eyewear',
                'sku' => 'ACC-CAS-001',
                'category' => 'accessories',
                'price' => 350.00,
                'stock_quantity' => 80,
                'color' => 'Black',
            ],
        ];

        foreach ($products as $productData) {
            Product::firstOrCreate(
                ['sku' => $productData['sku']],
                array_merge($productData, ['is_active' => true])
            );
        }

        $this->command->info('Database seeding completed successfully!');
        $this->command->info('');
        $this->command->info('Login Credentials:');
        $this->command->info('Admin: admin@eyeclinic.com / password');
        $this->command->info('Doctor: doctor@eyeclinic.com / password');
        $this->command->info('Client: client@eyeclinic.com / password');
    }
}
