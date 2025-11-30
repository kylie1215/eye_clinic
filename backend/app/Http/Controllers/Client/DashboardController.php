<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Order;
use App\Models\Prescription;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $client = auth()->user();

            $stats = [
                'upcoming_appointments' => Appointment::where('client_id', $client->id)
                    ->where('appointment_date', '>=', now())
                    ->whereIn('status', ['pending', 'approved'])
                    ->count(),
                'total_orders' => Order::where('client_id', $client->id)->count(),
                'pending_orders' => Order::where('client_id', $client->id)
                    ->where('status', 'pending')
                    ->count(),
                'prescriptions_count' => Prescription::where('client_id', $client->id)->count(),
                'total_spent' => (float) (Order::where('client_id', $client->id)
                    ->where('payment_status', 'paid')
                    ->sum('total') ?? 0),
            ];

            $upcomingAppointments = Appointment::with('doctor:id,name,email')
                ->where('client_id', $client->id)
                ->where('appointment_date', '>=', now())
                ->whereIn('status', ['pending', 'approved'])
                ->orderBy('appointment_date')
                ->take(3)
                ->get();

            $recentOrders = Order::where('client_id', $client->id)
                ->orderBy('created_at', 'desc')
                ->take(3)
                ->get();

            $featuredProducts = Product::where('is_active', true)
                ->where('stock_quantity', '>', 0)
                ->take(6)
                ->get();

            return response()->json([
                'stats' => $stats,
                'upcomingAppointments' => $upcomingAppointments,
                'recentOrders' => $recentOrders,
                'featuredProducts' => $featuredProducts,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'stats' => [
                    'upcoming_appointments' => 0,
                    'total_orders' => 0,
                    'pending_orders' => 0,
                    'prescriptions_count' => 0,
                    'total_spent' => 0,
                ],
                'upcomingAppointments' => [],
                'recentOrders' => [],
                'featuredProducts' => [],
                'error' => $e->getMessage()
            ]);
        }
    }
}
