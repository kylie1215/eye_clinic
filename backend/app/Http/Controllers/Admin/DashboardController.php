<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Appointment;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'total_doctors' => User::where('role', 'doctor')->count(),
                'total_clients' => User::where('role', 'client')->count(),
                'total_products' => Product::count(),
                'total_appointments' => Appointment::count(),
                'pending_appointments' => Appointment::where('status', 'pending')->count(),
                'total_orders' => Order::count(),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'total_revenue' => (float) (Order::where('payment_status', 'paid')->sum('total') ?? 0),
                'monthly_revenue' => (float) (Order::where('payment_status', 'paid')
                    ->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year)
                    ->sum('total') ?? 0),
                'low_stock_products' => Product::where('stock_quantity', '<', 10)->count(),
            ];

            $recentAppointments = Appointment::with(['client:id,name,email', 'doctor:id,name'])
                ->latest()
                ->take(5)
                ->get();

            $recentOrders = Order::with('client:id,name,email')
                ->latest()
                ->take(5)
                ->get();

            return response()->json([
                'stats' => $stats,
                'recentAppointments' => $recentAppointments,
                'recentOrders' => $recentOrders,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'stats' => [
                    'total_users' => 0,
                    'total_doctors' => 0,
                    'total_clients' => 0,
                    'total_products' => 0,
                    'total_appointments' => 0,
                    'pending_appointments' => 0,
                    'total_orders' => 0,
                    'pending_orders' => 0,
                    'total_revenue' => 0,
                    'monthly_revenue' => 0,
                    'low_stock_products' => 0,
                ],
                'recentAppointments' => [],
                'recentOrders' => [],
                'error' => $e->getMessage()
            ]);
        }
    }
}
