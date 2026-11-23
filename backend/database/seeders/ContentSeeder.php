<?php

namespace Database\Seeders;

use App\Support\Rows;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Fills empty website-content tables (procedures, FAQs, branches, About, images, articles) with the default content.
 * database/data/seed.json is written by `npm run build` from src/data/seed.js, so the site and the database start equal.
 * Tables that already have rows are never touched.
 */
class ContentSeeder extends Seeder
{
    /** @return list<string> tables filled, e.g. "faqs (12)" */
    public function run(): array
    {
        $file = database_path('data/seed.json');
        if (! is_file($file)) {
            $this->command?->warn('database/data/seed.json not found: run `npm run build` in the project root first.');

            return [];
        }
        $seed = json_decode((string) file_get_contents($file), true) ?: [];
        $done = [];
        foreach (config('clinic.content') as $r) {
            if (empty($seed[$r]) || DB::table($r)->exists()) {
                continue;
            }
            foreach ($seed[$r] as $row) {
                Rows::insert($r, Rows::filter($r, $row));
            }
            $done[] = $r.' ('.count($seed[$r]).')';
        }
        $this->command?->info($done ? 'Default content added: '.implode(', ', $done) : 'Content tables already filled.');

        return $done;
    }
}
