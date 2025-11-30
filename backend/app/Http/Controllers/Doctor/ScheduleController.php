<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\DoctorSchedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        try {
            $doctor = auth()->user();

            $schedules = DoctorSchedule::where('doctor_id', $doctor->id)
                ->orderByRaw("FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')")
                ->get();

            return response()->json(['schedules' => $schedules]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $doctor = auth()->user();

        $validated = $request->validate([
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_available' => 'boolean',
        ]);

        // Check if schedule for this day already exists
        $exists = DoctorSchedule::where('doctor_id', $doctor->id)
            ->where('day_of_week', $validated['day_of_week'])
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'Schedule for this day already exists.'], 422);
        }

        $validated['doctor_id'] = $doctor->id;

        $schedule = DoctorSchedule::create($validated);

        return response()->json(['message' => 'Schedule added successfully.', 'schedule' => $schedule], 201);
    }

    public function update(Request $request, DoctorSchedule $schedule)
    {
        // Ensure doctor can only update their own schedule
        if ($schedule->doctor_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_available' => 'boolean',
        ]);

        $schedule->update($validated);

        return response()->json(['message' => 'Schedule updated successfully.', 'schedule' => $schedule]);
    }

    public function destroy(DoctorSchedule $schedule)
    {
        // Ensure doctor can only delete their own schedule
        if ($schedule->doctor_id !== auth()->id()) {
            abort(403);
        }

        $schedule->delete();

        return response()->json(['message' => 'Schedule deleted successfully.']);
    }
}
