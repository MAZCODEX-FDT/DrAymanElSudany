<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Writes to the API must come from this site and be JSON, which blocks simple cross-site form posts.
 * The one exception is the admin image upload, which is multipart and must carry an Origin header.
 */
class SameOriginJson
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethodSafe()) {
            return $next($request);
        }

        $type = (string) $request->header('Content-Type', '');
        $isUpload = $request->isMethod('POST') && $request->is('api/upload') && stripos($type, 'multipart/form-data') === 0;
        if ($type !== '' && ! $isUpload && stripos($type, 'application/json') !== 0) {
            return response()->json(['error' => 'json only'], 415);
        }

        $origin = (string) $request->header('Origin', '');
        if ($isUpload && $origin === '') {
            return response()->json(['error' => 'origin required'], 403);
        }
        if ($origin !== '') {
            $o = parse_url($origin);
            $host = strtolower(($o['host'] ?? '').(isset($o['port']) ? ':'.$o['port'] : ''));
            if ($host !== strtolower($request->getHttpHost())) {
                return response()->json(['error' => 'bad origin'], 403);
            }
        }

        $response = $next($request);
        $response->headers->set('Cache-Control', 'no-store');

        return $response;
    }
}
