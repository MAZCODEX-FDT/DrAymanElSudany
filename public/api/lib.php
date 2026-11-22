<?php
declare(strict_types=1);

const RESOURCES = [
    'appointments' => ['patient_name', 'phone', 'date', 'time', 'reason', 'status', 'source', 'notes'],
    'leads' => ['type', 'name', 'phone', 'payload', 'label', 'status', 'responded_at'],
    'cases' => ['patient_name', 'phone', 'procedure', 'stage', 'referring_doctor', 'next_follow_up', 'notes'],
    'referrers' => ['name', 'specialty', 'city', 'phone', 'cases_count', 'last_referral', 'report_sent'],
    'patients' => ['name', 'phone', 'age', 'city', 'condition', 'summary', 'last_visit'],
    'testimonials' => ['quote_ar', 'quote_en', 'author', 'source', 'rating', 'approved'],
    'faqs' => ['category_ar', 'category_en', 'q_ar', 'a_ar', 'q_en', 'a_en', 'published', 'sort'],
    'events' => ['type', 'page'],
    'procedures' => ['slug', 'icon', 'image', 'content', 'enabled', 'sort'],
    'branches' => ['name_ar', 'name_en', 'address_ar', 'address_en', 'hours_ar', 'hours_en', 'phone', 'whatsapp', 'map_url', 'lat', 'lng', 'image', 'enabled', 'sort'],
    'articles' => ['slug', 'category_ar', 'category_en', 'title_ar', 'title_en', 'excerpt_ar', 'excerpt_en', 'body_ar', 'body_en', 'image', 'published_on', 'enabled', 'sort'],
    'about' => ['kind', 'title_ar', 'title_en', 'body_ar', 'body_en', 'image', 'enabled', 'sort'],
    'media' => ['slot', 'url', 'alt_ar', 'alt_en', 'enabled', 'sort'],
];
/** Website content shown publicly (only enabled rows), ordered by `sort`. */
const CONTENT = ['procedures', 'faqs', 'branches', 'about', 'media', 'articles'];
const JSON_COLS = ['payload', 'content'];
const BOOLS = ['report_sent', 'approved', 'published', 'enabled'];
const INTS = ['id', 'cases_count', 'age', 'sort', 'rating'];
const DATETIMES = ['created_at', 'responded_at'];
const SETTING_KEYS = ['phone', 'whatsapp', 'email', 'website', 'address_ar', 'address_en', 'hours_ar', 'hours_en', 'map_url', 'review_url', 'facebook', 'instagram', 'youtube', 'tiktok', 'google_reviews', 'google_reviews_goal', 'google_place_id', 'ga_id', 'meta_pixel_id', 'gsc_verification'];
const PUBLIC_SETTING_KEYS = ['phone', 'whatsapp', 'email', 'website', 'address_ar', 'address_en', 'hours_ar', 'hours_en', 'map_url', 'review_url', 'facebook', 'instagram', 'youtube', 'tiktok', 'ga_id', 'meta_pixel_id'];

function config(): array
{
    static $c = null;
    if ($c === null) {
        $file = __DIR__ . '/config.php';
        if (!is_file($file)) {
            fail(500, 'config.php missing');
        }
        $c = require $file;
    }
    return $c;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $c = config()['db'];
        $pdo = new PDO("mysql:host={$c['host']};dbname={$c['name']};charset=utf8mb4", $c['user'], $c['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        $pdo->exec("SET time_zone = '+00:00'");
    }
    return $pdo;
}

function out($data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(int $code, string $msg): void
{
    out(['error' => $msg], $code);
}

function body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        fail(400, 'invalid json');
    }
    return $data;
}

function q(string $col): string
{
    return '`' . str_replace('`', '', $col) . '`';
}

function client_ip(): string
{
    return substr($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0', 0, 64);
}

/** Simple per-IP rate limit backed by the throttle table. */
function throttle(string $action, int $max, int $minutes): void
{
    $pdo = db();
    $pdo->prepare('DELETE FROM throttle WHERE created_at < (UTC_TIMESTAMP() - INTERVAL 1 DAY)')->execute();
    $st = $pdo->prepare('SELECT COUNT(*) FROM throttle WHERE ip = ? AND action = ? AND created_at > (UTC_TIMESTAMP() - INTERVAL ? MINUTE)');
    $st->execute([client_ip(), $action, $minutes]);
    if ((int) $st->fetchColumn() >= $max) {
        fail(429, 'too many requests');
    }
    $pdo->prepare('INSERT INTO throttle (ip, action, created_at) VALUES (?, ?, UTC_TIMESTAMP())')->execute([client_ip(), $action]);
}

function clean_row(array $row): array
{
    foreach ($row as $k => $v) {
        if ($v === null) {
            continue;
        }
        if (in_array($k, BOOLS, true)) {
            $row[$k] = (bool) $v;
        } elseif (in_array($k, INTS, true)) {
            $row[$k] = (int) $v;
        } elseif (in_array($k, DATETIMES, true)) {
            $row[$k] = str_replace(' ', 'T', $v) . 'Z';
        } elseif (in_array($k, JSON_COLS, true)) {
            $row[$k] = json_decode($v, true) ?: new stdClass();
        }
    }
    return $row;
}

/** Keep only whitelisted columns and normalise values for MySQL. */
function filter_fields(string $r, array $in): array
{
    $out = [];
    foreach (RESOURCES[$r] as $col) {
        if (!array_key_exists($col, $in)) {
            continue;
        }
        $v = $in[$col];
        if (in_array($col, BOOLS, true)) {
            $v = $v ? 1 : 0;
        } elseif (in_array($col, JSON_COLS, true)) {
            $v = json_encode(is_array($v) ? $v : [], JSON_UNESCAPED_UNICODE);
        } elseif ($col === 'slug') {
            $v = trim(preg_replace('/[^a-z0-9]+/', '-', strtolower((string) $v)), '-') ?: 'page-' . bin2hex(random_bytes(3));
        } elseif (in_array($col, ['image', 'url', 'map_url'], true)) {
            $v = safe_url((string) $v);
        } elseif (in_array($col, DATETIMES, true)) {
            $v = $v ? gmdate('Y-m-d H:i:s', strtotime((string) $v)) : null;
        } elseif (in_array($col, ['lat', 'lng'], true)) {
            $v = is_numeric($v) ? (string) round((float) $v, 6) : '';
        } elseif (in_array($col, ['next_follow_up', 'last_referral', 'last_visit', 'date', 'published_on'], true)) {
            $v = $v ? substr((string) $v, 0, 10) : null;
        } elseif (in_array($col, INTS, true)) {
            $v = ($v === '' || $v === null) ? null : (int) $v;
        } elseif (is_string($v)) {
            $v = mb_substr(trim($v), 0, 5000);
        } elseif (!is_scalar($v) && $v !== null) {
            $v = null;
        }
        $out[$col] = $v;
    }
    return $out;
}

function insert_row(string $r, array $fields): array
{
    $cols = array_keys($fields);
    $sql = 'INSERT INTO ' . q($r) . ' (' . implode(',', array_map('q', $cols)) . ', created_at) VALUES (' . implode(',', array_fill(0, count($cols), '?')) . ', UTC_TIMESTAMP())';
    db()->prepare($sql)->execute(array_values($fields));
    return get_row($r, (int) db()->lastInsertId());
}

function get_row(string $r, int $id): array
{
    $st = db()->prepare('SELECT * FROM ' . q($r) . ' WHERE id = ?');
    $st->execute([$id]);
    $row = $st->fetch();
    if (!$row) {
        fail(404, 'not found');
    }
    return clean_row($row);
}

function settings_all(): array
{
    $rows = db()->query('SELECT k, v FROM settings')->fetchAll();
    $s = array_fill_keys(SETTING_KEYS, '');
    foreach ($rows as $row) {
        if (in_array($row['k'], SETTING_KEYS, true)) {
            $s[$row['k']] = $row['v'];
        }
    }
    return $s;
}

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_name('aes_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function require_admin(): array
{
    start_session();
    if (empty($_SESSION['uid'])) {
        fail(401, 'unauthorized');
    }
    return ['id' => $_SESSION['uid'], 'email' => $_SESSION['email'], 'name' => $_SESSION['name'] ?? ''];
}

function notify(string $subject, string $text): void
{
    $to = config()['notify_email'] ?? '';
    if ($to) {
        @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $text, "Content-Type: text/plain; charset=UTF-8\r\n");
    }
}

/** Only site-relative paths (/uploads/...) or http(s) links are stored as image/map URLs. */
function safe_url(string $u): string
{
    $u = trim($u);
    if ($u === '') {
        return '';
    }
    if (preg_match('#^/(?!/)[A-Za-z0-9/_\-.]+$#', $u) || preg_match('#^https?://#i', $u)) {
        return mb_substr($u, 0, 500);
    }
    return '';
}

/** Enabled website content for the public site, in one call. */
function public_content(): array
{
    $out = [];
    foreach (CONTENT as $r) {
        $flag = $r === 'faqs' ? 'published' : 'enabled';
        $rows = db()->query('SELECT * FROM ' . q($r) . " WHERE $flag = 1 ORDER BY sort, id")->fetchAll();
        $out[$r] = array_map('clean_row', $rows);
    }
    return $out;
}

/** Stores an uploaded image in /uploads/YYYY/MM after checking it really is a JPEG, PNG, WebP or GIF. */
function save_upload(array $f): string
{
    if (($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file($f['tmp_name'])) {
        fail(422, 'upload failed');
    }
    if ($f['size'] > 8 * 1024 * 1024) {
        fail(413, 'image larger than 8 MB');
    }
    $types = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
    if (!isset($types[$mime]) || @getimagesize($f['tmp_name']) === false) {
        fail(415, 'only jpg, png, webp or gif images');
    }
    $sub = gmdate('Y/m');
    $dir = dirname(__DIR__) . '/uploads/' . $sub;
    if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
        fail(500, 'cannot create uploads folder');
    }
    $name = bin2hex(random_bytes(12)) . '.' . $types[$mime];
    if (!move_uploaded_file($f['tmp_name'], "$dir/$name")) {
        fail(500, 'cannot save file');
    }
    @chmod("$dir/$name", 0644);
    return "/uploads/$sub/$name";
}

/**
 * Google rating and reviews for the clinic's Google Business profile (Places API, New).
 * Needs config.php 'google_places_key' and the Place ID in Settings. Cached for 12 hours in the settings table,
 * so visitors never wait on Google and the key is never exposed to the browser.
 */
function google_reviews(bool $force = false): array
{
    $key = (string) (config()['google_places_key'] ?? '');
    $s = settings_all();
    $place = trim((string) ($s['google_place_id'] ?? ''));
    $cache = json_decode((string) (db()->query("SELECT v FROM settings WHERE k = 'google_cache'")->fetchColumn() ?: ''), true);
    $fresh = is_array($cache) && ($cache['place'] ?? '') === $place && (time() - (int) ($cache['at'] ?? 0)) < 12 * 3600;
    if (($fresh && !$force) || $key === '' || $place === '') {
        return is_array($cache) ? $cache['data'] ?? [] : [];
    }
    $data = [];
    foreach (['ar', 'en'] as $lang) {
        $ctx = stream_context_create(['http' => ['timeout' => 6, 'ignore_errors' => true, 'header' => "X-Goog-Api-Key: $key\r\nX-Goog-FieldMask: rating,userRatingCount,googleMapsUri,reviews\r\n"]]);
        $raw = @file_get_contents('https://places.googleapis.com/v1/places/' . rawurlencode($place) . '?languageCode=' . $lang, false, $ctx);
        $j = $raw ? json_decode($raw, true) : null;
        if (!is_array($j) || isset($j['error'])) {
            error_log('[clinic-api] google places: ' . substr((string) $raw, 0, 300));
            return is_array($cache) ? $cache['data'] ?? [] : [];
        }
        $data['rating'] = (float) ($j['rating'] ?? 0);
        $data['count'] = (int) ($j['userRatingCount'] ?? 0);
        $data['url'] = (string) ($j['googleMapsUri'] ?? '');
        $data['reviews_' . $lang] = array_values(array_map(fn ($r) => [
            'author' => (string) ($r['authorAttribution']['displayName'] ?? ''),
            'rating' => (int) ($r['rating'] ?? 0),
            'text' => mb_substr(trim((string) ($r['text']['text'] ?? $r['originalText']['text'] ?? '')), 0, 600),
            'when' => (string) ($r['relativePublishTimeDescription'] ?? ''),
            'url' => (string) ($r['authorAttribution']['uri'] ?? ''),
        ], array_filter($j['reviews'] ?? [], fn ($r) => (int) ($r['rating'] ?? 0) >= 4)));
    }
    db()->prepare("REPLACE INTO settings (k, v) VALUES ('google_cache', ?)")->execute([json_encode(['place' => $place, 'at' => time(), 'data' => $data], JSON_UNESCAPED_UNICODE)]);
    return $data;
}

/** Optional: also push new bookings to the clinic's WhatsApp through the WhatsApp Business Cloud API (config 'whatsapp_cloud'). */
function whatsapp_notify(array $params): void
{
    $w = config()['whatsapp_cloud'] ?? null;
    if (!is_array($w) || empty($w['token']) || empty($w['phone_number_id']) || empty($w['to']) || empty($w['template'])) {
        return;
    }
    $body = json_encode([
        'messaging_product' => 'whatsapp',
        'to' => $w['to'],
        'type' => 'template',
        'template' => [
            'name' => $w['template'],
            'language' => ['code' => $w['language'] ?? 'ar'],
            'components' => [['type' => 'body', 'parameters' => array_map(fn ($p) => ['type' => 'text', 'text' => mb_substr((string) $p, 0, 200) ?: '-'], array_values($params))]],
        ],
    ], JSON_UNESCAPED_UNICODE);
    $ctx = stream_context_create(['http' => ['method' => 'POST', 'timeout' => 6, 'ignore_errors' => true, 'header' => "Authorization: Bearer {$w['token']}\r\nContent-Type: application/json\r\n", 'content' => $body]]);
    $res = @file_get_contents('https://graph.facebook.com/v21.0/' . rawurlencode($w['phone_number_id']) . '/messages', false, $ctx);
    if ($res === false || str_contains((string) $res, '"error"')) {
        error_log('[clinic-api] whatsapp notify failed: ' . substr((string) $res, 0, 300));
    }
}
