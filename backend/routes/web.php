<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\ResourceController;
use App\Http\Controllers\SeoController;
use App\Http\Middleware\SameOriginJson;
use Illuminate\Support\Facades\Route;

// The React site is static (index.html + assets) and only these paths reach Laravel (see public/.htaccess).
Route::get('/sitemap.xml', [SeoController::class, 'sitemap']);
Route::get('/{file}', [SeoController::class, 'searchConsole'])->where('file', 'google[A-Za-z0-9]+\.html');

Route::prefix('api')->middleware(SameOriginJson::class)->group(function () {
    // Public website
    Route::get('settings', [PublicController::class, 'settings']);
    Route::get('public-content', [PublicController::class, 'content']);
    Route::get('public-faqs', [PublicController::class, 'faqs']);
    Route::get('public-testimonials', [PublicController::class, 'testimonials']);
    Route::get('public-google', [PublicController::class, 'google']);
    Route::post('lead', [PublicController::class, 'lead'])->middleware('throttle:lead');
    Route::post('event', [PublicController::class, 'event'])->middleware('throttle:event');

    // Dashboard sign-in
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:login');
    Route::post('logout', [AuthController::class, 'logout']);

    // Dashboard (signed in)
    Route::middleware('auth')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('password', [AuthController::class, 'password']);
        Route::put('settings', [AdminController::class, 'saveSettings']);
        Route::post('upload', [AdminController::class, 'upload']);
        Route::post('google-refresh', [AdminController::class, 'googleRefresh']);

        $resources = implode('|', array_keys(config('clinic.resources')));
        Route::get('{resource}', [ResourceController::class, 'index'])->where('resource', $resources);
        Route::post('{resource}', [ResourceController::class, 'store'])->where('resource', $resources);
        Route::put('{resource}/{id}', [ResourceController::class, 'update'])->where(['resource' => $resources, 'id' => '[0-9]+']);
        Route::delete('{resource}/{id}', [ResourceController::class, 'destroy'])->where(['resource' => $resources, 'id' => '[0-9]+']);
    });
});
