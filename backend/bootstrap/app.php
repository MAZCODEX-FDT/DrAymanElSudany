<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        then: fn () => Route::group([], __DIR__.'/../routes/setup.php'),
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // The API is JSON-only and same-origin (SameOriginJson) with SameSite=Strict session cookies, so it needs no CSRF token.
        $middleware->validateCsrfTokens(except: ['api/*']);
        // Signed-out API calls get 401 JSON (the React dashboard shows its own sign-in), never a redirect.
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // The React app reads { error: "..." } from every failed API call.
        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }
            [$status, $message] = match (true) {
                $e instanceof AuthenticationException => [401, 'unauthorized'],
                $e instanceof ThrottleRequestsException => [429, 'too many requests'],
                $e instanceof HttpExceptionInterface => [$e->getStatusCode(), $e->getStatusCode() === 404 ? 'unknown route' : ($e->getMessage() ?: 'error')],
                default => [500, 'server error'],
            };

            return response()->json(['error' => $message], $status);
        });
    })->create();
