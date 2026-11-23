<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;

/** Clinic settings (phone, WhatsApp, social links, analytics IDs...) kept as key/value rows. */
class Settings
{
    public static function all(): array
    {
        $keys = config('clinic.setting_keys');
        $s = array_fill_keys($keys, '');
        foreach (DB::table('settings')->whereIn('k', $keys)->get() as $row) {
            $s[$row->k] = (string) $row->v;
        }

        return $s;
    }

    public static function public(): array
    {
        return array_intersect_key(self::all(), array_flip(config('clinic.public_setting_keys')));
    }

    public static function get(string $key): string
    {
        return (string) DB::table('settings')->where('k', $key)->value('v');
    }

    public static function put(string $key, ?string $value): void
    {
        DB::table('settings')->updateOrInsert(['k' => $key], ['v' => $value]);
    }

    /** Save only known keys from a request body. */
    public static function save(array $in): array
    {
        foreach (config('clinic.setting_keys') as $k) {
            if (array_key_exists($k, $in)) {
                self::put($k, mb_substr(trim((string) $in[$k]), 0, 1000));
            }
        }

        return self::all();
    }
}
