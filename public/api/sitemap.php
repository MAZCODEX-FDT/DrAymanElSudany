<?php
// Live sitemap: fixed pages + every enabled procedure and article from the dashboard. Served at /sitemap.xml (see .htaccess).
declare(strict_types=1);
require __DIR__ . '/lib.php';

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');
$host = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https://' : 'http://') . preg_replace('/[^A-Za-z0-9.\-:]/', '', (string) ($_SERVER['HTTP_HOST'] ?? 'localhost'));
$paths = ['/', '/about', '/procedures', '/for-doctors', '/faq', '/contact', '/book', '/before-your-visit', '/articles'];
try {
    foreach (db()->query('SELECT slug FROM procedures WHERE enabled = 1 ORDER BY sort, id') as $r) {
        $paths[] = '/procedures/' . $r['slug'];
    }
    foreach (db()->query('SELECT slug FROM articles WHERE enabled = 1 ORDER BY sort, id') as $r) {
        $paths[] = '/articles/' . $r['slug'];
    }
} catch (Throwable $e) {
    error_log('[clinic-api] sitemap: ' . $e->getMessage());
}
$today = gmdate('Y-m-d');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
foreach ($paths as $p) {
    $ar = htmlspecialchars($host . $p, ENT_XML1);
    $en = htmlspecialchars($host . ($p === '/' ? '/en' : '/en' . $p), ENT_XML1);
    $alt = "<xhtml:link rel=\"alternate\" hreflang=\"ar\" href=\"$ar\"/><xhtml:link rel=\"alternate\" hreflang=\"en\" href=\"$en\"/><xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"$ar\"/>";
    foreach ([$ar, $en] as $loc) {
        echo "<url><loc>$loc</loc><lastmod>$today</lastmod>$alt</url>";
    }
}
echo "</urlset>\n";
