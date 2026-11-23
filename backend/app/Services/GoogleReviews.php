<?php

namespace App\Services;

use App\Support\Settings;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Google rating and recent 4-5 star reviews from the clinic's Google Business profile (Places API, New).
 * Needs GOOGLE_PLACES_KEY in .env and the Place ID in dashboard Settings. Refreshed once a week (or from the
 * dashboard button); the last good answer is kept in the settings table so a Google outage never empties the block.
 */
class GoogleReviews
{
    public function get(bool $force = false): array
    {
        $key = (string) config('clinic.google_places_key');
        $place = trim(Settings::get('google_place_id'));
        $cache = json_decode(Settings::get('google_cache'), true);
        $maxAge = (int) config('clinic.google_refresh_days', 7) * 86400;
        $fresh = is_array($cache) && ($cache['place'] ?? '') === $place && (time() - (int) ($cache['at'] ?? 0)) < $maxAge;
        $last = is_array($cache) ? ($cache['data'] ?? []) : [];

        if (($fresh && ! $force) || $key === '' || $place === '') {
            return $last;
        }

        $data = [];
        foreach (['ar', 'en'] as $lang) {
            try {
                $res = Http::timeout(6)
                    ->withHeaders(['X-Goog-Api-Key' => $key, 'X-Goog-FieldMask' => 'rating,userRatingCount,googleMapsUri,reviews'])
                    ->get('https://places.googleapis.com/v1/places/'.rawurlencode($place), ['languageCode' => $lang]);
            } catch (\Throwable $e) {
                Log::warning('google places: '.$e->getMessage());

                return $last;
            }
            $j = $res->json();
            if (! $res->ok() || ! is_array($j)) {
                Log::warning('google places: '.substr($res->body(), 0, 300));

                return $last;
            }
            $data['rating'] = (float) ($j['rating'] ?? 0);
            $data['count'] = (int) ($j['userRatingCount'] ?? 0);
            $data['url'] = (string) ($j['googleMapsUri'] ?? '');
            $data['reviews_'.$lang] = collect($j['reviews'] ?? [])
                ->filter(fn ($r) => (int) ($r['rating'] ?? 0) >= 4)
                ->map(fn ($r) => [
                    'author' => (string) ($r['authorAttribution']['displayName'] ?? ''),
                    'rating' => (int) ($r['rating'] ?? 0),
                    'text' => mb_substr(trim((string) ($r['text']['text'] ?? $r['originalText']['text'] ?? '')), 0, 600),
                    'when' => (string) ($r['relativePublishTimeDescription'] ?? ''),
                    'url' => (string) ($r['authorAttribution']['uri'] ?? ''),
                ])->values()->all();
        }
        Settings::put('google_cache', json_encode(['place' => $place, 'at' => time(), 'data' => $data], JSON_UNESCAPED_UNICODE));

        return $data;
    }
}
