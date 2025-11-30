<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Prescription;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $doctor = auth()->user();

            $stats = [
                'today_appointments' => Appointment::where('doctor_id', $doctor->id)
                    ->whereDate('appointment_date', today())
                    ->count(),
                'pending_appointments' => Appointment::where('doctor_id', $doctor->id)
                    ->where('status', 'pending')
                    ->count(),
                'total_patients' => Appointment::where('doctor_id', $doctor->id)
                    ->distinct('client_id')
                    ->count('client_id'),
                'prescriptions_issued' => Prescription::where('doctor_id', $doctor->id)
                    ->whereMonth('created_at', now()->month)
                    ->count(),
            ];

            $todayAppointments = Appointment::with('client:id,name,email')
                ->where('doctor_id', $doctor->id)
                ->whereDate('appointment_date', today())
                ->orderBy('start_time')
                ->get();

            $upcomingAppointments = Appointment::with('client:id,name,email')
                ->where('doctor_id', $doctor->id)
                ->where('appointment_date', '>', today())
                ->where('status', 'approved')
                ->orderBy('appointment_date')
                ->take(5)
                ->get();

            return response()->json([
                'stats' => $stats,
                'todayAppointments' => $todayAppointments,
                'upcomingAppointments' => $upcomingAppointments,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'stats' => [
                    'today_appointments' => 0,
                    'pending_appointments' => 0,
                    'total_patients' => 0,
                    'prescriptions_issued' => 0,
                ],
                'todayAppointments' => [],
                'upcomingAppointments' => [],
                'error' => $e->getMessage()
            ]);
        }
    }
}
