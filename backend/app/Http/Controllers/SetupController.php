<?php

namespace App\Http\Controllers;

use App\Models\User;
use Database\Seeders\ContentSeeder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Artisan;

/**
 * One-time setup for hosts without SSH: /setup?token=<CLINIC_SETUP_TOKEN>.
 * Creates the app key (if .env has none), the tables, the default website content and the first admin.
 * Safe to open again after each update (it only adds what is missing). Remove CLINIC_SETUP_TOKEN from .env when done.
 */
class SetupController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $expected = (string) config('clinic.setup_token');
        $token = (string) $request->query('token', '');
        if (strlen($expected) < 20 || str_starts_with($expected, 'CHANGE_ME') || ! hash_equals($expected, $token)) {
            return response('Forbidden', 403);
        }

        $notes = [];
        if ($this->ensureAppKey()) {
            $notes[] = 'App key created in .env.';
        }
        Artisan::call('migrate', ['--force' => true]);
        $notes[] = 'Tables are ready.';
        $seeded = (new ContentSeeder)->run();
        if ($seeded) {
            $notes[] = 'Default content added: '.implode(', ', $seeded).'.';
        }

        $hasUser = User::query()->exists();
        if (! $hasUser && $request->isMethod('POST')) {
            $email = strtolower(trim((string) $request->input('email', '')));
            $pass = (string) $request->input('password', '');
            if (! filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 10) {
                $notes[] = '<b>Valid email and a password of 10+ characters are required.</b>';
            } else {
                User::create(['email' => $email, 'name' => 'Clinic Admin', 'password' => $pass]);
                $hasUser = true;
                $notes[] = '<b>Admin created.</b>';
            }
        }

        $t = htmlspecialchars($token, ENT_QUOTES);
        $html = "<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width'><meta name=robots content=noindex>"
            ."<body style='font-family:system-ui;max-width:440px;margin:60px auto;padding:0 16px'><h2>Clinic setup</h2>";
        foreach ($notes as $n) {
            $html .= "<p>$n</p>";
        }
        $html .= $hasUser
            ? "<p>An admin exists. <b>Now remove CLINIC_SETUP_TOKEN from .env</b> (or set it to empty), then sign in at <a href='/dashboard'>/dashboard</a>.</p>"
            : "<form method=post action='?token=$t'><p><input name=email type=email placeholder='admin email' required style='width:100%;padding:8px'></p>"
              ."<p><input name=password type=password minlength=10 placeholder='password (10+ characters)' required style='width:100%;padding:8px'></p><button>Create admin</button></form>";

        return response($html, 200, ['Content-Type' => 'text/html; charset=utf-8', 'Cache-Control' => 'no-store']);
    }

    /** Hosts without SSH cannot run `php artisan key:generate`, so write a key into .env the first time. */
    private function ensureAppKey(): bool
    {
        if (config('app.key')) {
            return false;
        }
        $env = base_path('.env');
        if (! is_file($env) || ! is_writable($env)) {
            return false;
        }
        $key = 'base64:'.base64_encode(random_bytes(32));
        $text = (string) file_get_contents($env);
        $text = preg_match('/^APP_KEY=.*$/m', $text) ? preg_replace('/^APP_KEY=.*$/m', 'APP_KEY='.$key, $text) : "APP_KEY=$key\n".$text;
        file_put_contents($env, $text);
        config(['app.key' => $key]);

        return true;
    }
}
