<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        // Log the login
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'login',
            'description' => "User {$user->name} logged in",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'client',
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'is_active' => true,
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        // Log the registration
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'register',
            'description' => "New user {$user->name} registered",
            'model_type' => User::class,
            'model_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        
        // Log the logout
        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'logout',
            'description' => "User {$user->name} logged out",
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
        
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
