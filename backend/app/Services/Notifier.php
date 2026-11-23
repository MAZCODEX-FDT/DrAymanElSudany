<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/** Tells the clinic about a new booking or referral: email (optional) and WhatsApp Cloud API (optional). */
class Notifier
{
    public function newLead(string $type, string $name, string $phone, array $payload): void
    {
        $label = $type === 'referral' ? 'تحويل حالة' : 'حجز';
        $this->email(($type === 'referral' ? 'تحويل حالة جديد' : 'طلب حجز جديد'), "$name\n$phone\n".json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        $this->whatsapp([$label, $name, $phone, (string) ($payload['reason'] ?? $payload['summary'] ?? ''), (string) ($payload['preferred'] ?? '')]);
    }

    private function email(string $subject, string $text): void
    {
        $to = (string) config('clinic.notify_email');
        if ($to === '') {
            return;
        }
        try {
            Mail::raw($text, fn ($m) => $m->to($to)->subject($subject));
        } catch (\Throwable $e) {
            Log::warning('notify email: '.$e->getMessage());
        }
    }

    private function whatsapp(array $params): void
    {
        $w = config('clinic.whatsapp_cloud');
        if (empty($w['token']) || empty($w['phone_number_id']) || empty($w['to']) || empty($w['template'])) {
            return;
        }
        try {
            $res = Http::timeout(6)->withToken($w['token'])->post('https://graph.facebook.com/v21.0/'.rawurlencode($w['phone_number_id']).'/messages', [
                'messaging_product' => 'whatsapp',
                'to' => $w['to'],
                'type' => 'template',
                'template' => [
                    'name' => $w['template'],
                    'language' => ['code' => $w['language'] ?: 'ar'],
                    'components' => [['type' => 'body', 'parameters' => array_map(fn ($p) => ['type' => 'text', 'text' => mb_substr((string) $p, 0, 200) ?: '-'], array_values($params))]],
                ],
            ]);
            if (! $res->successful()) {
                Log::warning('whatsapp notify: '.substr($res->body(), 0, 300));
            }
        } catch (\Throwable $e) {
            Log::warning('whatsapp notify: '.$e->getMessage());
        }
    }
}
