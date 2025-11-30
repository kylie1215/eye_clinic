<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Prescription;
use App\Models\User;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        try {
            $doctor = auth()->user();

            // Get unique clients who have appointments with this doctor
            $clientIds = Appointment::where('doctor_id', $doctor->id)
                ->distinct()
                ->pluck('client_id');

            $query = User::whereIn('id', $clientIds);

            if ($request->has('search')) {
                $query->where(function ($q) use ($request) {
                    $q->where('name', 'like', "%{$request->search}%")
                      ->orWhere('email', 'like', "%{$request->search}%");
                });
            }

            $patients = $query->withCount([
                'clientAppointments' => function ($q) use ($doctor) {
                    $q->where('doctor_id', $doctor->id);
                }
            ])->paginate(15);

            return response()->json($patients);
        } catch (\Exception $e) {
            return response()->json([
                'data' => [],
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(User $patient)
    {
        try {
            $doctor = auth()->user();

            // Verify the patient has appointments with this doctor
            $hasAppointments = Appointment::where('doctor_id', $doctor->id)
                ->where('client_id', $patient->id)
                ->exists();

            if (!$hasAppointments) {
                return response()->json(['error' => 'You do not have access to this patient.'], 403);
            }

            $appointments = Appointment::where('doctor_id', $doctor->id)
                ->where('client_id', $patient->id)
                ->with('prescription')
                ->orderBy('appointment_date', 'desc')
                ->get();

            $prescriptions = Prescription::where('doctor_id', $doctor->id)
                ->where('client_id', $patient->id)
                ->orderBy('prescription_date', 'desc')
                ->get();

            return response()->json([
                'patient' => $patient,
                'appointments' => $appointments,
                'prescriptions' => $prescriptions,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
