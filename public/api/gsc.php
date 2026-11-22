<?php
// Google Search Console "HTML file" verification without uploading a file: paste the file name
// (e.g. google1234abcd.html) in Dashboard > Settings. /googleXXXX.html is routed here by .htaccess.
declare(strict_types=1);
require __DIR__ . '/lib.php';

$want = trim((string) (settings_all()['gsc_verification'] ?? ''));
$asked = basename((string) ($_GET['f'] ?? ''));
if ($want !== '' && preg_match('/^google[a-z0-9]+\.html$/i', $want) && hash_equals($want, $asked)) {
    header('Content-Type: text/html; charset=utf-8');
    echo 'google-site-verification: ' . $want;
    exit;
}
http_response_code(404);
echo 'Not found';
