<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use App\Models\Appointment;
use App\Models\Notification;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $doctor = auth()->user();
            $query = Prescription::with(['client:id,name,email', 'appointment'])
                ->where('doctor_id', $doctor->id);

            if ($request->has('client_id')) {
                $query->where('client_id', $request->client_id);
            }

            if ($request->has('search')) {
                $query->whereHas('client', function ($q) use ($request) {
                    $q->where('name', 'like', "%{$request->search}%");
                });
            }

            $prescriptions = $query->orderBy('prescription_date', 'desc')
                ->paginate(15);

            return response()->json($prescriptions);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $doctor = auth()->user();

        $validated = $request->validate([
            'appointment_id' => 'required|exists:appointments,id',
            'client_id' => 'required|exists:users,id',
            'right_sphere' => 'nullable|numeric',
            'right_cylinder' => 'nullable|numeric',
            'right_axis' => 'nullable|integer|min:0|max:180',
            'right_add' => 'nullable|numeric',
            'left_sphere' => 'nullable|numeric',
            'left_cylinder' => 'nullable|numeric',
            'left_axis' => 'nullable|integer|min:0|max:180',
            'left_add' => 'nullable|numeric',
            'pd' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'prescription_date' => 'required|date',
            'expiry_date' => 'nullable|date|after:prescription_date',
        ]);

        // Verify appointment belongs to this doctor
        $appointment = Appointment::findOrFail($validated['appointment_id']);
        if ($appointment->doctor_id !== $doctor->id) {
            abort(403);
        }

        $validated['doctor_id'] = $doctor->id;

        $prescription = Prescription::create($validated);

        // Create notification for client
        Notification::create([
            'user_id' => $validated['client_id'],
            'type' => 'prescription',
            'title' => 'New Prescription Available',
            'message' => 'A new prescription has been issued for you.',
            'data' => ['prescription_id' => $prescription->id],
        ]);

        return response()->json(['message' => 'Prescription created successfully.', 'prescription' => $prescription], 201);
    }

    public function update(Request $request, Prescription $prescription)
    {
        // Ensure doctor can only update their own prescriptions
        if ($prescription->doctor_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'right_sphere' => 'nullable|numeric',
            'right_cylinder' => 'nullable|numeric',
            'right_axis' => 'nullable|integer|min:0|max:180',
            'right_add' => 'nullable|numeric',
            'left_sphere' => 'nullable|numeric',
            'left_cylinder' => 'nullable|numeric',
            'left_axis' => 'nullable|integer|min:0|max:180',
            'left_add' => 'nullable|numeric',
            'pd' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'expiry_date' => 'nullable|date|after:prescription_date',
        ]);

        $prescription->update($validated);

        return response()->json(['message' => 'Prescription updated successfully.', 'prescription' => $prescription]);
    }

    public function destroy(Prescription $prescription)
    {
        // Ensure doctor can only delete their own prescriptions
        if ($prescription->doctor_id !== auth()->id()) {
            abort(403);
        }

        $prescription->delete();

        return response()->json(['message' => 'Prescription deleted successfully.']);
    }
}
