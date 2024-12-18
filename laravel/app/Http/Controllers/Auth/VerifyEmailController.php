<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'status' => 'redirect',
                'message' => 'Email already verified',
                'redirect_url' => config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
            ]);
        }
    
        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }
    
        return response()->json([
            'status' => 'redirect',
            'message' => 'Email verified',
            'redirect_url' => config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
        ]);
    }
}
