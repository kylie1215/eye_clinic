<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Notification;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $doctor = auth()->user();
            $query = Appointment::with('client:id,name,email')
                ->where('doctor_id', $doctor->id);

            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            if ($request->has('date')) {
                $query->whereDate('appointment_date', $request->date);
            }

            $appointments = $query->orderBy('appointment_date', 'desc')
                ->paginate(15);

            return response()->json($appointments);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Appointment $appointment)
    {
        try {
            // Ensure doctor can only view their own appointments
            if ($appointment->doctor_id !== auth()->id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $appointment->load(['client:id,name,email', 'prescription']);

            return response()->json(['appointment' => $appointment]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        // Ensure doctor can only update their own appointments
        if ($appointment->doctor_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,declined,completed,cancelled',
            'doctor_notes' => 'nullable|string',
        ]);

        $appointment->update($validated);

        // Create notification for client
        $statusMessages = [
            'approved' => "Your appointment on {$appointment->appointment_date} at {$appointment->start_time} has been approved by the doctor.",
            'declined' => "Your appointment on {$appointment->appointment_date} at {$appointment->start_time} has been declined. Please book another time slot.",
            'completed' => "Your appointment on {$appointment->appointment_date} has been completed. You can now view your prescription if available.",
            'cancelled' => "Your appointment on {$appointment->appointment_date} at {$appointment->start_time} has been cancelled.",
        ];

        Notification::create([
            'user_id' => $appointment->client_id,
            'type' => 'appointment',
            'title' => 'Appointment Status Updated',
            'message' => $statusMessages[$validated['status']],
            'data' => ['appointment_id' => $appointment->id],
        ]);

        return response()->json(['message' => 'Appointment status updated successfully.', 'appointment' => $appointment]);
    }

    public function reschedule(Request $request, Appointment $appointment)
    {
        // Ensure doctor can only reschedule their own appointments
        if ($appointment->doctor_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'appointment_date' => 'required|date|after:now',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $appointment->update($validated);

        // Create notification for client
        Notification::create([
            'user_id' => $appointment->client_id,
            'type' => 'appointment',
            'title' => 'Appointment Rescheduled',
            'message' => 'Your appointment has been rescheduled by the doctor.',
            'data' => ['appointment_id' => $appointment->id],
        ]);

        return response()->json(['message' => 'Appointment rescheduled successfully.', 'appointment' => $appointment]);
    }
}
