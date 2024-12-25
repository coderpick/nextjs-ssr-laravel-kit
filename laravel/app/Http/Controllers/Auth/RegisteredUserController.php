<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use App\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')),
        ]);
        
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
        ], 201);
    }
}