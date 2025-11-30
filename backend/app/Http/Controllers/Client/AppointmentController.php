<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\User;
use App\Models\DoctorSchedule;
use App\Models\Notification;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $client = auth()->user();
            $query = Appointment::with('doctor:id,name,email')
                ->where('client_id', $client->id);

            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            $appointments = $query->orderBy('appointment_date', 'desc')
                ->paginate(15);

            return response()->json($appointments);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function create()
    {
        try {
            $doctors = User::where('role', 'doctor')
                ->where('is_active', true)
                ->select('id', 'name', 'email')
                ->get();

            return response()->json(['doctors' => $doctors]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getDoctorSchedule(User $doctor)
    {
        $schedules = DoctorSchedule::where('doctor_id', $doctor->id)
            ->where('is_available', true)
            ->get();

        return response()->json($schedules);
    }

    public function store(Request $request)
    {
        $client = auth()->user();

        $validated = $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'appointment_date' => 'required|date|after:now',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'reason' => 'required|string|max:500',
            'notes' => 'nullable|string',
        ]);

        // Check for conflicting appointments
        $conflict = Appointment::where('doctor_id', $validated['doctor_id'])
            ->whereDate('appointment_date', $validated['appointment_date'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                      ->orWhere(function ($q) use ($validated) {
                          $q->where('start_time', '<=', $validated['start_time'])
                            ->where('end_time', '>=', $validated['end_time']);
                      });
            })
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        if ($conflict) {
            return response()->json(['error' => 'This time slot is already booked.'], 422);
        }

        $validated['client_id'] = $client->id;
        $validated['status'] = 'pending';

        $appointment = Appointment::create($validated);

        // Create notification for doctor
        Notification::create([
            'user_id' => $validated['doctor_id'],
            'type' => 'appointment',
            'title' => 'New Appointment Request',
            'message' => "{$client->name} has requested an appointment on {$validated['appointment_date']} at {$validated['start_time']}. Reason: {$validated['reason']}",
            'data' => ['appointment_id' => $appointment->id],
        ]);

        return response()->json(['message' => 'Appointment request submitted successfully.', 'appointment' => $appointment], 201);
    }

    public function cancel(Appointment $appointment)
    {
        // Ensure client can only cancel their own appointments
        if ($appointment->client_id !== auth()->id()) {
            abort(403);
        }

        if (!in_array($appointment->status, ['pending', 'approved'])) {
            return response()->json(['error' => 'This appointment cannot be cancelled.'], 422);
        }

        $appointment->update(['status' => 'cancelled']);

        // Create notification for doctor
        $client = auth()->user();
        Notification::create([
            'user_id' => $appointment->doctor_id,
            'type' => 'appointment',
            'title' => 'Appointment Cancelled',
            'message' => "{$client->name} has cancelled their appointment scheduled for {$appointment->appointment_date} at {$appointment->start_time}.",
            'data' => ['appointment_id' => $appointment->id],
        ]);

        return response()->json(['message' => 'Appointment cancelled successfully.', 'appointment' => $appointment]);
    }
}
