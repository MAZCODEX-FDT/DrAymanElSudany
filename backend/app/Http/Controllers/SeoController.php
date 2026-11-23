<?php

namespace App\Http\Controllers;

use App\Support\Settings;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/** Live sitemap from the database, and Google Search Console file verification set from the dashboard. */
class SeoController extends Controller
{
    private const PAGES = ['/', '/about', '/procedures', '/for-doctors', '/faq', '/contact', '/book', '/before-your-visit', '/articles'];

    public function sitemap(Request $request): Response
    {
        $host = $request->getSchemeAndHttpHost();
        $paths = self::PAGES;
        try {
            foreach (['procedures', 'articles'] as $table) {
                foreach (DB::table($table)->where('enabled', true)->orderBy('sort')->orderBy('id')->pluck('slug') as $slug) {
                    $paths[] = "/$table/$slug";
                }
            }
        } catch (\Throwable $e) {
            Log::warning('sitemap: '.$e->getMessage());
        }
        $today = gmdate('Y-m-d');
        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
        foreach ($paths as $p) {
            $ar = htmlspecialchars($host.$p, ENT_XML1);
            $en = htmlspecialchars($host.($p === '/' ? '/en' : '/en'.$p), ENT_XML1);
            $alt = "<xhtml:link rel=\"alternate\" hreflang=\"ar\" href=\"$ar\"/><xhtml:link rel=\"alternate\" hreflang=\"en\" href=\"$en\"/><xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"$ar\"/>";
            foreach ([$ar, $en] as $loc) {
                $xml .= "<url><loc>$loc</loc><lastmod>$today</lastmod>$alt</url>";
            }
        }

        return response($xml."</urlset>\n", 200, ['Content-Type' => 'application/xml; charset=utf-8', 'Cache-Control' => 'public, max-age=3600']);
    }

    /** Paste the file name Google gives (e.g. google1234abcd.html) in Dashboard > Settings; no file upload needed. */
    public function searchConsole(string $file): Response
    {
        $want = trim(Settings::get('gsc_verification'));
        if ($want !== '' && preg_match('/^google[a-z0-9]+\.html$/i', $want) && hash_equals($want, $file)) {
            return response('google-site-verification: '.$want, 200, ['Content-Type' => 'text/html; charset=utf-8']);
        }

        return response('Not found', 404);
    }
}
