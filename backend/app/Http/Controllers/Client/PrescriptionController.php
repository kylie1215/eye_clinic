<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    public function index()
    {
        try {
            $client = auth()->user();

            $prescriptions = Prescription::with(['doctor:id,name,email', 'appointment'])
                ->where('client_id', $client->id)
                ->orderBy('prescription_date', 'desc')
                ->get();

            return response()->json(['prescriptions' => $prescriptions]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Prescription $prescription)
    {
        try {
            // Ensure client can only view their own prescriptions
            if ($prescription->client_id !== auth()->id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $prescription->load(['doctor:id,name,email', 'appointment']);

            return response()->json(['prescription' => $prescription]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
