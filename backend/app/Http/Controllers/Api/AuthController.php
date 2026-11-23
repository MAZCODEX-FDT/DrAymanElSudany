<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/** Dashboard sign-in with a Laravel session cookie (HttpOnly, SameSite=Strict). */
class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $ok = Auth::attempt([
            'email' => strtolower(trim((string) $request->input('email', ''))),
            'password' => (string) $request->input('password', ''),
        ]);
        if (! $ok) {
            return response()->json(['error' => 'invalid'], 401);
        }
        $request->session()->regenerate();

        return response()->json(['user' => $request->user()->toApi()]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $request->user()->toApi()]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['ok' => true]);
    }

    public function password(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! Hash::check((string) $request->input('current', ''), $user->password)) {
            return response()->json(['error' => 'wrong password'], 403);
        }
        $next = (string) $request->input('next', '');
        if (strlen($next) < 10) {
            return response()->json(['error' => 'password must be at least 10 characters'], 422);
        }
        $user->password = $next;
        $user->save();

        return response()->json(['ok' => true]);
    }
}
