<?php
declare(strict_types=1);

const RESOURCES = [
    'appointments' => ['patient_name', 'phone', 'date', 'time', 'reason', 'status', 'source', 'notes'],
    'leads' => ['type', 'name', 'phone', 'payload', 'label', 'status', 'responded_at'],
    'cases' => ['patient_name', 'phone', 'procedure', 'stage', 'referring_doctor', 'next_follow_up', 'notes'],
    'referrers' => ['name', 'specialty', 'city', 'phone', 'cases_count', 'last_referral', 'report_sent'],
    'patients' => ['name', 'phone', 'age', 'city', 'condition', 'summary', 'last_visit'],
    'testimonials' => ['quote_ar', 'quote_en', 'author', 'source', 'approved'],
    'faqs' => ['q_ar', 'a_ar', 'q_en', 'a_en', 'published', 'sort'],
    'events' => ['type', 'page'],
];
const BOOLS = ['report_sent', 'approved', 'published'];
const INTS = ['id', 'cases_count', 'age', 'sort'];
const DATETIMES = ['created_at', 'responded_at'];
const SETTING_KEYS = ['phone', 'whatsapp', 'address_ar', 'address_en', 'hours_ar', 'hours_en', 'map_url', 'review_url', 'facebook', 'instagram', 'youtube', 'tiktok', 'google_reviews', 'google_reviews_goal'];
const PUBLIC_SETTING_KEYS = ['phone', 'whatsapp', 'address_ar', 'address_en', 'hours_ar', 'hours_en', 'map_url', 'review_url', 'facebook', 'instagram', 'youtube', 'tiktok'];

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
        } elseif ($k === 'payload') {
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
        } elseif ($col === 'payload') {
            $v = json_encode(is_array($v) ? $v : [], JSON_UNESCAPED_UNICODE);
        } elseif (in_array($col, DATETIMES, true)) {
            $v = $v ? gmdate('Y-m-d H:i:s', strtotime((string) $v)) : null;
        } elseif (in_array($col, ['next_follow_up', 'last_referral', 'last_visit', 'date'], true)) {
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
        $s[$row['k']] = $row['v'];
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
