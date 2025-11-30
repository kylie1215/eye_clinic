<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Appointment::with(['client:id,name,email', 'doctor:id,name']);

            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->has('doctor_id')) {
                $query->where('doctor_id', $request->doctor_id);
            }

            if ($request->has('date')) {
                $query->whereDate('appointment_date', $request->date);
            }

            if ($request->has('search')) {
                $query->where(function ($q) use ($request) {
                    $q->whereHas('client', function ($cq) use ($request) {
                        $cq->where('name', 'like', "%{$request->search}%");
                    })
                    ->orWhereHas('doctor', function ($dq) use ($request) {
                        $dq->where('name', 'like', "%{$request->search}%");
                    })
                    ->orWhere('reason', 'like', "%{$request->search}%");
                });
            }

            $appointments = $query->orderBy('appointment_date', 'desc')->paginate(15);

            return response()->json($appointments);
        } catch (\Exception $e) {
            return response()->json([
                'data' => [],
                'total' => 0,
                'error' => $e->getMessage()
            ], 200);
        }
    }
}
