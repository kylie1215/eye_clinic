<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    /**
     * Update the authenticated user's profile
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
        ];

        // Add password validation rules if user is trying to change password
        if ($request->filled('current_password')) {
            $rules['current_password'] = 'required|string';
            $rules['new_password'] = ['required', 'string', 'confirmed', Password::defaults()];
        }

        $validated = $request->validate($rules);

        // Check current password if user is changing password
        if ($request->filled('current_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect',
                    'errors' => [
                        'current_password' => ['Current password is incorrect']
                    ]
                ], 422);
            }

            $user->password = Hash::make($request->new_password);
        }

        // Update user profile
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? $user->phone;
        $user->address = $validated['address'] ?? $user->address;
        $user->date_of_birth = $validated['date_of_birth'] ?? $user->date_of_birth;
        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Update the authenticated user's profile picture
     */
    public function updatePicture(Request $request)
    {
        // Check if file exists in request
        if (!$request->hasFile('profile_picture')) {
            return response()->json([
                'message' => 'No file uploaded',
                'errors' => [
                    'profile_picture' => ['No file was uploaded']
                ]
            ], 422);
        }

        // Check if file is valid
        if (!$request->file('profile_picture')->isValid()) {
            return response()->json([
                'message' => 'Invalid file upload',
                'errors' => [
                    'profile_picture' => ['The uploaded file is invalid']
                ]
            ], 422);
        }

        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048', // 2MB max
        ]);

        $user = $request->user();

        // Delete old profile picture if it exists
        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        // Store new profile picture
        $path = $request->file('profile_picture')->store('profile-pictures', 'public');

        // Update user profile picture path
        $user->profile_picture = $path;
        $user->save();

        return response()->json([
            'message' => 'Profile picture updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Delete the authenticated user's profile picture
     */
    public function deletePicture(Request $request)
    {
        $user = $request->user();

        if ($user->profile_picture) {
            Storage::disk('public')->delete($user->profile_picture);
            $user->profile_picture = null;
            $user->save();
        }

        return response()->json([
            'message' => 'Profile picture deleted successfully',
            'user' => $user
        ]);
    }
}
