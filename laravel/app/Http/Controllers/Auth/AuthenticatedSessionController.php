<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\VerifyEmail;
use Illuminate\Http\Request;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);
    
        if (!auth()->attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 422);
        }
    
        $user = User::with(['roles','permissions'])->where('email', $request->email)->first();
        
        $accessToken = $user->createToken('access_token', ['*'], now()->addSeconds(config('sanctum.access_token_expiration')))->plainTextToken;
        $refreshToken = $user->createToken('refresh_token', ['*'], now()->addSeconds(config('sanctum.refresh_token_expiration')))->plainTextToken;
    
        if(!$user->hasVerifiedEmail()){
            $user->notify(new VerifyEmail);
        }
    
        return response()->json([
            'user' => $user,
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'access_token_expiration' => config('sanctum.access_token_expiration'),
            'refresh_token_expiration' => config('sanctum.refresh_token_expiration'),
        ], 200);
    }

    public function refreshToken(Request $request)
    {
        $request->user()->tokens()->delete();
        $accessToken = $request->user()->createToken('access_token', ['issue-access-token'], now()->addSeconds(config('sanctum.access_token_expiration',null)));
        $refreshToken = $request->user()->createToken('refresh_token', ['access-api'], now()->addSeconds(config('sanctum.refresh_token_expiration',3)));
    
        return response()->json([
            'user' => $request->user(),
            'access_token' => $accessToken->plainTextToken, 
            'refresh_token' => $refreshToken->plainTextToken,
            'access_token_expiration' => config('sanctum.access_token_expiration'),
            'refresh_token_expiration' => config('sanctum.refresh_token_expiration'),
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        if(!$request->user()){
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}