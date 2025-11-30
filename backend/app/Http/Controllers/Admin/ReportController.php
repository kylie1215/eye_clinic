<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Appointment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        try {
            // Revenue statistics
            $totalRevenue = Order::where('payment_status', 'paid')->sum('total_amount') ?? 0;
            $monthlyRevenue = Order::where('payment_status', 'paid')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('total_amount') ?? 0;
            $yearlyRevenue = Order::where('payment_status', 'paid')
                ->whereYear('created_at', now()->year)
                ->sum('total_amount') ?? 0;

            // Monthly revenue chart data
            $monthlyRevenueData = Order::where('payment_status', 'paid')
                ->whereYear('created_at', now()->year)
                ->select(
                    DB::raw('MONTH(created_at) as month'),
                    DB::raw('SUM(total_amount) as revenue')
                )
                ->groupBy('month')
                ->orderBy('month')
                ->get();

            // Top selling products
            $topProducts = Product::where('is_active', true)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();

            // Appointment statistics
            $totalAppointments = Appointment::count();
            $pendingAppointments = Appointment::where('status', 'pending')->count();
            $completedAppointments = Appointment::where('status', 'completed')->count();

            // Appointment trends
            $appointmentTrends = Appointment::select(
                    DB::raw('DATE(appointment_date) as date'),
                    DB::raw('COUNT(*) as count')
                )
                ->where('appointment_date', '>=', now()->subDays(30))
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // User statistics
            $totalClients = User::where('role', 'client')->count();
            $newClientsThisMonth = User::where('role', 'client')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();

            return response()->json([
                'revenue' => [
                    'total' => (float) $totalRevenue,
                    'monthly' => (float) $monthlyRevenue,
                    'yearly' => (float) $yearlyRevenue,
                    'monthlyData' => $monthlyRevenueData,
                ],
                'products' => [
                    'topSelling' => $topProducts,
                ],
                'appointments' => [
                    'total' => $totalAppointments,
                    'pending' => $pendingAppointments,
                    'completed' => $completedAppointments,
                    'trends' => $appointmentTrends,
                ],
                'users' => [
                    'totalClients' => $totalClients,
                    'newThisMonth' => $newClientsThisMonth,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'revenue' => [
                    'total' => 0,
                    'monthly' => 0,
                    'yearly' => 0,
                    'monthlyData' => [],
                ],
                'products' => [
                    'topSelling' => [],
                ],
                'appointments' => [
                    'total' => 0,
                    'pending' => 0,
                    'completed' => 0,
                    'trends' => [],
                ],
                'users' => [
                    'totalClients' => 0,
                    'newThisMonth' => 0,
                ],
                'error' => $e->getMessage()
            ]);
        }
    }
}
