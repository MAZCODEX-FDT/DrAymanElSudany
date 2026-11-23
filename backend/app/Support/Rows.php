<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;

/**
 * Whitelisting and type clean-up for dashboard rows. Requests may only write the columns listed in config/clinic.php,
 * and responses always carry real booleans, integers, decoded JSON and ISO dates, the shape the React app expects.
 */
class Rows
{
    public const JSON_COLS = ['payload', 'content'];
    public const BOOLS = ['report_sent', 'approved', 'published', 'enabled'];
    public const INTS = ['id', 'cases_count', 'age', 'sort', 'rating'];
    public const DATETIMES = ['created_at', 'responded_at'];
    public const DATES = ['next_follow_up', 'last_referral', 'last_visit', 'date', 'published_on'];
    public const URLS = ['image', 'url', 'map_url'];

    public static function exists(string $resource): bool
    {
        return array_key_exists($resource, config('clinic.resources'));
    }

    public static function isContent(string $resource): bool
    {
        return in_array($resource, config('clinic.content'), true);
    }

    /** Keep only whitelisted columns and normalise values for the database. */
    public static function filter(string $resource, array $in): array
    {
        $out = [];
        foreach (config("clinic.resources.$resource") as $col) {
            if (! array_key_exists($col, $in)) {
                continue;
            }
            $v = $in[$col];
            if (in_array($col, self::BOOLS, true)) {
                $v = $v ? 1 : 0;
            } elseif (in_array($col, self::JSON_COLS, true)) {
                $v = json_encode(is_array($v) ? $v : [], JSON_UNESCAPED_UNICODE);
            } elseif ($col === 'slug') {
                $v = trim(preg_replace('/[^a-z0-9]+/', '-', strtolower((string) $v)), '-') ?: 'page-'.bin2hex(random_bytes(3));
            } elseif (in_array($col, self::URLS, true)) {
                $v = self::safeUrl((string) $v);
            } elseif (in_array($col, self::DATETIMES, true)) {
                $t = $v ? strtotime((string) $v) : false;
                $v = $t ? gmdate('Y-m-d H:i:s', $t) : null;
            } elseif (in_array($col, ['lat', 'lng'], true)) {
                $v = is_numeric($v) ? (string) round((float) $v, 6) : '';
            } elseif (in_array($col, self::DATES, true)) {
                $d = substr((string) $v, 0, 10);
                $v = preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $d, $m) && checkdate((int) $m[2], (int) $m[3], (int) $m[1]) ? $d : null;
            } elseif (in_array($col, self::INTS, true)) {
                $v = ($v === '' || $v === null) ? null : (int) $v;
            } elseif (is_string($v)) {
                $v = mb_substr(trim($v), 0, str_starts_with($col, 'body_') ? 60000 : 5000);
            } elseif (! is_scalar($v) && $v !== null) {
                $v = null;
            }
            $out[$col] = $v;
        }

        return $out;
    }

    /** A database row as JSON for the app. */
    public static function clean(object|array $row): array
    {
        $row = (array) $row;
        foreach ($row as $k => $v) {
            if ($v === null) {
                continue;
            }
            if (in_array($k, self::BOOLS, true)) {
                $row[$k] = (bool) $v;
            } elseif (in_array($k, self::INTS, true)) {
                $row[$k] = (int) $v;
            } elseif (in_array($k, self::DATETIMES, true)) {
                $row[$k] = gmdate('Y-m-d\TH:i:s\Z', strtotime($v.' UTC'));
            } elseif (in_array($k, self::JSON_COLS, true)) {
                $row[$k] = json_decode($v, true) ?: new \stdClass;
            }
        }

        return $row;
    }

    public static function insert(string $resource, array $fields): array
    {
        $id = DB::table($resource)->insertGetId($fields + ['created_at' => gmdate('Y-m-d H:i:s')]);

        return self::clean(DB::table($resource)->find($id));
    }

    /** Only site-relative paths (/uploads/...) or http(s) links are stored as image/map URLs. */
    public static function safeUrl(string $u): string
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
}
