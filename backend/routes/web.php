<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Doctor;
use App\Http\Controllers\Client;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Redirect to appropriate dashboard based on role
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->isDoctor()) {
            return redirect()->route('doctor.dashboard');
        } else {
            return redirect()->route('client.dashboard');
        }
    })->name('dashboard');
});

// Admin Routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');
    
    // User Management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [Admin\UserManagementController::class, 'index'])->name('index');
        Route::post('/', [Admin\UserManagementController::class, 'store'])->name('store');
        Route::put('/{user}', [Admin\UserManagementController::class, 'update'])->name('update');
        Route::delete('/{user}', [Admin\UserManagementController::class, 'destroy'])->name('destroy');
    });
    
    // Product Management
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [Admin\ProductController::class, 'index'])->name('index');
        Route::post('/', [Admin\ProductController::class, 'store'])->name('store');
        Route::put('/{product}', [Admin\ProductController::class, 'update'])->name('update');
        Route::delete('/{product}', [Admin\ProductController::class, 'destroy'])->name('destroy');
    });
    
    // Order Management
    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/', [Admin\OrderController::class, 'index'])->name('index');
        Route::get('/{order}', [Admin\OrderController::class, 'show'])->name('show');
        Route::patch('/{order}/status', [Admin\OrderController::class, 'updateStatus'])->name('update-status');
        Route::patch('/{order}/payment', [Admin\OrderController::class, 'updatePaymentStatus'])->name('update-payment');
    });
    
    // Appointment Overview
    Route::get('/appointments', [Admin\AppointmentController::class, 'index'])->name('appointments.index');
    
    // Reports & Analytics
    Route::get('/reports', [Admin\ReportController::class, 'index'])->name('reports.index');
});

// Doctor Routes
Route::middleware(['auth', 'verified', 'doctor'])->prefix('doctor')->name('doctor.')->group(function () {
    Route::get('/dashboard', [Doctor\DashboardController::class, 'index'])->name('dashboard');
    
    // Appointments
    Route::prefix('appointments')->name('appointments.')->group(function () {
        Route::get('/', [Doctor\AppointmentController::class, 'index'])->name('index');
        Route::get('/{appointment}', [Doctor\AppointmentController::class, 'show'])->name('show');
        Route::patch('/{appointment}/status', [Doctor\AppointmentController::class, 'updateStatus'])->name('update-status');
        Route::patch('/{appointment}/reschedule', [Doctor\AppointmentController::class, 'reschedule'])->name('reschedule');
    });
    
    // Patient Records
    Route::prefix('patients')->name('patients.')->group(function () {
        Route::get('/', [Doctor\PatientController::class, 'index'])->name('index');
        Route::get('/{patient}', [Doctor\PatientController::class, 'show'])->name('show');
    });
    
    // Prescriptions
    Route::prefix('prescriptions')->name('prescriptions.')->group(function () {
        Route::get('/', [Doctor\PrescriptionController::class, 'index'])->name('index');
        Route::post('/', [Doctor\PrescriptionController::class, 'store'])->name('store');
        Route::put('/{prescription}', [Doctor\PrescriptionController::class, 'update'])->name('update');
        Route::delete('/{prescription}', [Doctor\PrescriptionController::class, 'destroy'])->name('destroy');
    });
    
    // Schedule Management
    Route::prefix('schedule')->name('schedule.')->group(function () {
        Route::get('/', [Doctor\ScheduleController::class, 'index'])->name('index');
        Route::post('/', [Doctor\ScheduleController::class, 'store'])->name('store');
        Route::put('/{schedule}', [Doctor\ScheduleController::class, 'update'])->name('update');
        Route::delete('/{schedule}', [Doctor\ScheduleController::class, 'destroy'])->name('destroy');
    });
});

// Client Routes
Route::middleware(['auth', 'verified', 'client'])->prefix('client')->name('client.')->group(function () {
    Route::get('/dashboard', [Client\DashboardController::class, 'index'])->name('dashboard');
    
    // Appointments
    Route::prefix('appointments')->name('appointments.')->group(function () {
        Route::get('/', [Client\AppointmentController::class, 'index'])->name('index');
        Route::get('/create', [Client\AppointmentController::class, 'create'])->name('create');
        Route::post('/', [Client\AppointmentController::class, 'store'])->name('store');
        Route::get('/doctor/{doctor}/schedule', [Client\AppointmentController::class, 'getDoctorSchedule'])->name('doctor-schedule');
        Route::patch('/{appointment}/cancel', [Client\AppointmentController::class, 'cancel'])->name('cancel');
    });
    
    // Shop
    Route::prefix('shop')->name('shop.')->group(function () {
        Route::get('/', [Client\ShopController::class, 'index'])->name('index');
        Route::get('/{product}', [Client\ShopController::class, 'show'])->name('show');
    });
    
    // Cart
    Route::prefix('cart')->name('cart.')->group(function () {
        Route::get('/', [Client\CartController::class, 'index'])->name('index');
        Route::post('/add', [Client\CartController::class, 'add'])->name('add');
        Route::put('/{cartItem}', [Client\CartController::class, 'update'])->name('update');
        Route::delete('/{cartItem}', [Client\CartController::class, 'remove'])->name('remove');
        Route::delete('/', [Client\CartController::class, 'clear'])->name('clear');
    });
    
    // Orders
    Route::prefix('orders')->name('orders.')->group(function () {
        Route::get('/', [Client\OrderController::class, 'index'])->name('index');
        Route::get('/checkout', [Client\OrderController::class, 'checkout'])->name('checkout');
        Route::post('/', [Client\OrderController::class, 'store'])->name('store');
        Route::get('/{order}', [Client\OrderController::class, 'show'])->name('show');
    });
    
    // Prescriptions
    Route::prefix('prescriptions')->name('prescriptions.')->group(function () {
        Route::get('/', [Client\PrescriptionController::class, 'index'])->name('index');
        Route::get('/{prescription}', [Client\PrescriptionController::class, 'show'])->name('show');
    });
    
    // Profile
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/edit', [Client\ProfileController::class, 'edit'])->name('edit');
        Route::put('/', [Client\ProfileController::class, 'update'])->name('update');
        Route::put('/password', [Client\ProfileController::class, 'updatePassword'])->name('update-password');
    });
});

require __DIR__.'/settings.php';
