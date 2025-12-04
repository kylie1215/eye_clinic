<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Doctor;
use App\Http\Controllers\Client;
use App\Http\Controllers\Auth\AuthController;

// Auth routes for React frontend (no CSRF required)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Authenticated user endpoint
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    
    // Profile routes
    Route::put('/profile', [App\Http\Controllers\ProfileController::class, 'update']);
    Route::post('/profile/picture', [App\Http\Controllers\ProfileController::class, 'updatePicture']);
    Route::delete('/profile/picture', [App\Http\Controllers\ProfileController::class, 'deletePicture']);
    
    Route::get('/notifications', function (Request $request) {
        return $request->user()->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate(15);
    });
    
    Route::patch('/notifications/{notification}/read', function (Request $request, $notification) {
        $notif = $request->user()->notifications()->findOrFail($notification);
        $notif->markAsRead();
        return response()->json(['success' => true]);
    });
    
    Route::delete('/notifications/{notification}', function (Request $request, $notification) {
        $notif = $request->user()->notifications()->findOrFail($notification);
        $notif->delete();
        return response()->json(['success' => true]);
    });
});

// Admin API Routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Dashboard stats
    Route::get('/dashboard/stats', [Admin\DashboardController::class, 'index']);
    
    // Users API
    Route::apiResource('users', Admin\UserManagementController::class);
    Route::post('users/{id}/restore', [Admin\UserManagementController::class, 'restore']);
    Route::delete('users/{id}/force', [Admin\UserManagementController::class, 'forceDelete']);
    
    // Products API
    Route::apiResource('products', Admin\ProductController::class);
    
    // Orders API
    Route::get('orders', [Admin\OrderController::class, 'index']);
    Route::get('orders/{order}', [Admin\OrderController::class, 'show']);
    Route::patch('orders/{order}/status', [Admin\OrderController::class, 'updateStatus']);
    Route::patch('orders/{order}/payment', [Admin\OrderController::class, 'updatePaymentStatus']);
    
    // Appointments API
    Route::get('appointments', [Admin\AppointmentController::class, 'index']);
    
    // Reports API
    Route::get('reports', [Admin\ReportController::class, 'index']);
});

// Doctor API Routes
Route::middleware(['auth:sanctum', 'doctor'])->prefix('doctor')->group(function () {
    // Dashboard stats
    Route::get('/dashboard/stats', [Doctor\DashboardController::class, 'index']);
    
    // Appointments API
    Route::get('appointments', [Doctor\AppointmentController::class, 'index']);
    Route::get('appointments/{appointment}', [Doctor\AppointmentController::class, 'show']);
    Route::patch('appointments/{appointment}/status', [Doctor\AppointmentController::class, 'updateStatus']);
    Route::patch('appointments/{appointment}/reschedule', [Doctor\AppointmentController::class, 'reschedule']);
    
    // Patients API
    Route::get('patients', [Doctor\PatientController::class, 'index']);
    Route::get('patients/{patient}', [Doctor\PatientController::class, 'show']);
    
    // Prescriptions API
    Route::apiResource('prescriptions', Doctor\PrescriptionController::class);
    
    // Schedule API
    Route::apiResource('schedule', Doctor\ScheduleController::class);
});

// Client API Routes
Route::middleware(['auth:sanctum', 'client'])->prefix('client')->group(function () {
    // Dashboard stats
    Route::get('/dashboard/stats', [Client\DashboardController::class, 'index']);
    
    // Appointments API
    Route::get('appointments', [Client\AppointmentController::class, 'index']);
    Route::get('appointments/create', [Client\AppointmentController::class, 'create']);
    Route::post('appointments', [Client\AppointmentController::class, 'store']);
    Route::get('appointments/doctors/{doctor}/schedule', [Client\AppointmentController::class, 'getDoctorSchedule']);
    Route::patch('appointments/{appointment}/cancel', [Client\AppointmentController::class, 'cancel']);
    
    // Shop API
    Route::get('shop', [Client\ShopController::class, 'index']);
    Route::get('shop/{product}', [Client\ShopController::class, 'show']);
    
    // Cart API
    Route::get('cart', [Client\CartController::class, 'index']);
    Route::post('cart', [Client\CartController::class, 'add']);
    Route::put('cart/{cartItem}', [Client\CartController::class, 'update']);
    Route::delete('cart/{cartItem}', [Client\CartController::class, 'remove']);
    Route::delete('cart', [Client\CartController::class, 'clear']);
    
    // Orders API
    Route::get('orders', [Client\OrderController::class, 'index']);
    Route::get('orders/{order}', [Client\OrderController::class, 'show']);
    Route::post('orders', [Client\OrderController::class, 'store']);
    
    // Prescriptions API
    Route::get('prescriptions', [Client\PrescriptionController::class, 'index']);
    Route::get('prescriptions/{prescription}', [Client\PrescriptionController::class, 'show']);
    
    // Profile API
    Route::put('profile', [Client\ProfileController::class, 'update']);
    Route::put('profile/password', [Client\ProfileController::class, 'updatePassword']);
});
