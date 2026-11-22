<?php
// One-time setup: creates the tables and the first admin user.
// Visit /api/setup.php?token=<setup_token from config.php>, submit the form, then DELETE this file.
declare(strict_types=1);
require __DIR__ . '/lib.php';

header('Content-Type: text/html; charset=utf-8');
$token = (string) ($_GET['token'] ?? '');
$expected = (string) (config()['setup_token'] ?? '');
if ($expected === '' || str_starts_with($expected, 'CHANGE_ME') || !hash_equals($expected, $token)) {
    http_response_code(403);
    exit('Forbidden');
}

$pdo = db();
$pdo->exec(file_get_contents(__DIR__ . '/schema.sql'));
// Columns added after the first release (CREATE TABLE IF NOT EXISTS does not add them to old tables).
$addCols = ['testimonials' => ['rating' => 'INT NOT NULL DEFAULT 5 AFTER source'], 'faqs' => ['category_ar' => "VARCHAR(120) NOT NULL DEFAULT '' AFTER id", 'category_en' => "VARCHAR(120) NOT NULL DEFAULT '' AFTER category_ar"]];
foreach ($addCols as $table => $cols) {
    foreach ($cols as $col => $def) {
        $st = $pdo->prepare('SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?');
        $st->execute([$table, $col]);
        if ((int) $st->fetchColumn() === 0) {
            $pdo->exec('ALTER TABLE ' . q($table) . ' ADD COLUMN ' . q($col) . ' ' . $def);
        }
    }
}
// Fill empty website-content tables with the default content (procedures, FAQs, branches, about, images).
$seeded = [];
$seedFile = __DIR__ . '/seed.json';
if (is_file($seedFile)) {
    $seed = json_decode((string) file_get_contents($seedFile), true) ?: [];
    foreach (CONTENT as $r) {
        if (!empty($seed[$r]) && (int) $pdo->query('SELECT COUNT(*) FROM ' . q($r))->fetchColumn() === 0) {
            foreach ($seed[$r] as $row) {
                insert_row($r, filter_fields($r, $row));
            }
            $seeded[] = $r . ' (' . count($seed[$r]) . ')';
        }
    }
}
$hasUser = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn() > 0;
$msg = '';

if (!$hasUser && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim((string) ($_POST['email'] ?? '')));
    $pass = (string) ($_POST['password'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 10) {
        $msg = 'Valid email and a password of 10+ characters are required.';
    } else {
        $pdo->prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)')->execute([$email, 'Clinic Admin', password_hash($pass, PASSWORD_DEFAULT)]);
        $hasUser = true;
        $msg = 'Admin created.';
    }
}
$t = htmlspecialchars($token, ENT_QUOTES);
$m = htmlspecialchars($msg, ENT_QUOTES);
echo "<!doctype html><meta name=viewport content='width=device-width'><body style='font-family:system-ui;max-width:420px;margin:60px auto;padding:0 16px'>";
echo "<h2>Clinic setup</h2><p>Tables are ready.</p>" . ($seeded ? '<p>Default content added: ' . htmlspecialchars(implode(', ', $seeded)) . '</p>' : '') . ($m ? "<p><b>$m</b></p>" : '');
if ($hasUser) {
    echo "<p>An admin user exists. <b>Delete api/setup.php from the server now</b>, then sign in at <a href='/dashboard'>/dashboard</a>.</p>";
} else {
    echo "<form method=post action='?token=$t'><p><input name=email type=email placeholder='admin email' required style='width:100%;padding:8px'></p><p><input name=password type=password placeholder='password (10+ chars)' required style='width:100%;padding:8px'></p><button>Create admin</button></form>";
}
