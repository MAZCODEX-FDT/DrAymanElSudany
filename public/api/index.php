<?php
// Clinic API: /api/index.php?r=<route>[&id=<id>]
declare(strict_types=1);
require __DIR__ . '/lib.php';

set_exception_handler(function (Throwable $e) {
    error_log('[clinic-api] ' . $e->getMessage());
    fail(500, 'server error');
});

$method = $_SERVER['REQUEST_METHOD'];
$r = (string) ($_GET['r'] ?? '');
$id = isset($_GET['id']) ? (int) $_GET['id'] : null;

// Writes must be JSON from this site (blocks simple cross-site form posts).
// The one exception is the admin image upload, which is multipart and needs a signed-in session.
if ($method !== 'GET') {
    $type = $_SERVER['CONTENT_TYPE'] ?? '';
    $isUpload = $method === 'POST' && $r === 'upload' && stripos($type, 'multipart/form-data') === 0;
    if ($type !== '' && !$isUpload && stripos($type, 'application/json') !== 0) {
        fail(415, 'json only');
    }
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        $o = parse_url($origin);
        $originHost = strtolower(($o['host'] ?? '') . (isset($o['port']) ? ':' . $o['port'] : ''));
        if ($originHost !== strtolower($_SERVER['HTTP_HOST'] ?? '')) {
            fail(403, 'bad origin');
        }
    }
}

// ---------- public routes ----------
switch ("$method $r") {
    case 'GET settings':
        start_session();
        $s = settings_all();
        out(empty($_SESSION['uid']) ? array_intersect_key($s, array_flip(PUBLIC_SETTING_KEYS)) : $s);

    case 'GET public-faqs':
        $rows = db()->query('SELECT id, q_ar, a_ar, q_en, a_en FROM faqs WHERE published = 1 ORDER BY sort, id')->fetchAll();
        out(array_map('clean_row', $rows));

    case 'GET public-content':
        out(public_content());

    case 'GET public-testimonials':
        $rows = db()->query('SELECT id, quote_ar, quote_en, author, source, rating FROM testimonials WHERE approved = 1 ORDER BY id DESC')->fetchAll();
        out(array_map('clean_row', $rows));

    case 'POST lead':
        throttle('lead', 8, 60);
        $b = body();
        $type = in_array($b['type'] ?? '', ['booking', 'referral', 'contact'], true) ? $b['type'] : 'contact';
        $name = trim((string) ($b['name'] ?? ''));
        $phone = preg_replace('/[^0-9+ ]/', '', (string) ($b['phone'] ?? ''));
        if ($name === '' || strlen($phone) < 8) {
            fail(422, 'name and phone required');
        }
        $payload = is_array($b['payload'] ?? null) ? array_slice($b['payload'], 0, 20, true) : [];
        $row = insert_row('leads', filter_fields('leads', [
            'type' => $type,
            'name' => $name,
            'phone' => $phone,
            'payload' => $payload,
            'label' => $type === 'referral' ? 'referring_doctor' : 'new',
            'status' => 'open',
        ]));
        notify($type === 'referral' ? 'تحويل حالة جديد' : 'طلب حجز جديد', "$name\n$phone\n" . json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        out(['ok' => true, 'id' => $row['id']], 201);

    case 'POST event':
        throttle('event', 120, 60);
        $b = body();
        $type = in_array($b['type'] ?? '', ['whatsapp', 'call', 'map', 'form'], true) ? $b['type'] : null;
        if (!$type) {
            fail(422, 'bad type');
        }
        insert_row('events', ['type' => $type, 'page' => mb_substr((string) ($b['page'] ?? ''), 0, 190)]);
        out(['ok' => true], 201);

    case 'POST login':
        throttle('login', 6, 15);
        $b = body();
        $st = db()->prepare('SELECT * FROM users WHERE email = ?');
        $st->execute([strtolower(trim((string) ($b['email'] ?? '')))]);
        $u = $st->fetch();
        if (!$u || !password_verify((string) ($b['password'] ?? ''), $u['password_hash'])) {
            fail(401, 'invalid');
        }
        start_session();
        session_regenerate_id(true);
        $_SESSION['uid'] = (int) $u['id'];
        $_SESSION['email'] = $u['email'];
        $_SESSION['name'] = $u['name'];
        out(['user' => ['id' => (int) $u['id'], 'email' => $u['email'], 'name' => $u['name']]]);

    case 'GET me':
        out(['user' => require_admin()]);

    case 'POST logout':
        start_session();
        $_SESSION = [];
        session_destroy();
        out(['ok' => true]);
}

// ---------- admin routes ----------
$user = require_admin();

if ($r === 'settings' && $method === 'PUT') {
    $b = body();
    $st = db()->prepare('REPLACE INTO settings (k, v) VALUES (?, ?)');
    foreach (SETTING_KEYS as $k) {
        if (array_key_exists($k, $b)) {
            $st->execute([$k, mb_substr(trim((string) $b[$k]), 0, 1000)]);
        }
    }
    out(settings_all());
}

if ($r === 'upload' && $method === 'POST') {
    if (empty($_SERVER['HTTP_ORIGIN'])) {
        fail(403, 'origin required');
    }
    out(['url' => save_upload($_FILES['file'] ?? [])], 201);
}

if ($r === 'password' && $method === 'POST') {
    $b = body();
    $st = db()->prepare('SELECT password_hash FROM users WHERE id = ?');
    $st->execute([$user['id']]);
    if (!password_verify((string) ($b['current'] ?? ''), (string) $st->fetchColumn())) {
        fail(403, 'wrong password');
    }
    $next = (string) ($b['next'] ?? '');
    if (strlen($next) < 10) {
        fail(422, 'password must be at least 10 characters');
    }
    db()->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([password_hash($next, PASSWORD_DEFAULT), $user['id']]);
    out(['ok' => true]);
}

if (!isset(RESOURCES[$r])) {
    fail(404, 'unknown route');
}

switch ($method) {
    case 'GET':
        $order = in_array($r, ['appointments'], true) ? '`date` DESC, `time`' : (in_array($r, CONTENT, true) ? 'sort, id' : 'id DESC');
        $limit = $r === 'events' ? ' WHERE created_at > (UTC_TIMESTAMP() - INTERVAL 90 DAY)' : '';
        $rows = db()->query('SELECT * FROM ' . q($r) . $limit . ' ORDER BY ' . $order . ' LIMIT 5000')->fetchAll();
        out(array_map('clean_row', $rows));

    case 'POST':
        $fields = filter_fields($r, body());
        if (!$fields) {
            fail(422, 'empty');
        }
        out(insert_row($r, $fields), 201);

    case 'PUT':
        if (!$id) {
            fail(400, 'id required');
        }
        $fields = filter_fields($r, body());
        if ($fields) {
            $set = implode(',', array_map(fn ($c) => q($c) . ' = ?', array_keys($fields)));
            db()->prepare('UPDATE ' . q($r) . " SET $set WHERE id = ?")->execute([...array_values($fields), $id]);
        }
        out(get_row($r, $id));

    case 'DELETE':
        if (!$id) {
            fail(400, 'id required');
        }
        db()->prepare('DELETE FROM ' . q($r) . ' WHERE id = ?')->execute([$id]);
        out(['ok' => true]);
}

fail(405, 'method not allowed');
