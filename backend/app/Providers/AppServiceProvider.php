<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Per-IP limits for the public forms and the dashboard sign-in.
        RateLimiter::for('lead', fn (Request $r) => Limit::perHour(8)->by($r->ip()));
        RateLimiter::for('event', fn (Request $r) => Limit::perHour(120)->by($r->ip()));
        RateLimiter::for('login', fn (Request $r) => Limit::perMinutes(15, 6)->by($r->ip()));
    }
}
