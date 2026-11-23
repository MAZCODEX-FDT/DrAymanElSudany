<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** Dashboard and website-content tables (same columns the React app has always used). */
return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'settings' => function (Blueprint $t) {
                $t->string('k', 64)->primary();
                $t->text('v')->nullable();
            },
            'appointments' => function (Blueprint $t) {
                $t->string('patient_name', 190);
                $t->string('phone', 40)->default('');
                $t->date('date')->index();
                $t->string('time', 5)->default('');
                $t->string('reason')->default('');
                $t->string('status', 20)->default('requested');
                $t->string('source', 20)->default('website');
                $t->text('notes')->nullable();
            },
            'leads' => function (Blueprint $t) {
                $t->string('type', 20);
                $t->string('name', 190);
                $t->string('phone', 40)->default('');
                $t->text('payload')->nullable();
                $t->string('label', 30)->default('new');
                $t->string('status', 20)->default('open');
                $t->dateTime('responded_at')->nullable();
            },
            'cases' => function (Blueprint $t) {
                $t->string('patient_name', 190);
                $t->string('phone', 40)->default('');
                $t->string('procedure', 80)->default('');
                $t->string('stage', 20)->default('candidate');
                $t->string('referring_doctor', 190)->default('');
                $t->date('next_follow_up')->nullable();
                $t->text('notes')->nullable();
            },
            'referrers' => function (Blueprint $t) {
                $t->string('name', 190);
                $t->string('specialty', 120)->default('');
                $t->string('city', 120)->default('');
                $t->string('phone', 40)->default('');
                $t->integer('cases_count')->default(0);
                $t->date('last_referral')->nullable();
                $t->boolean('report_sent')->default(false);
            },
            'patients' => function (Blueprint $t) {
                $t->string('name', 190);
                $t->string('phone', 40)->default('');
                $t->integer('age')->nullable();
                $t->string('city', 120)->default('');
                $t->string('condition')->default('');
                $t->text('summary')->nullable();
                $t->date('last_visit')->nullable();
            },
            'testimonials' => function (Blueprint $t) {
                $t->text('quote_ar')->nullable();
                $t->text('quote_en')->nullable();
                $t->string('author', 190)->default('');
                $t->string('source', 80)->default('');
                $t->integer('rating')->default(5);
                $t->boolean('approved')->default(false);
            },
            'faqs' => function (Blueprint $t) {
                $t->string('category_ar', 120)->default('');
                $t->string('category_en', 120)->default('');
                $t->text('q_ar')->nullable();
                $t->text('a_ar')->nullable();
                $t->text('q_en')->nullable();
                $t->text('a_en')->nullable();
                $t->boolean('published')->default(true);
                $t->integer('sort')->default(0);
            },
            'events' => function (Blueprint $t) {
                $t->string('type', 20);
                $t->string('page', 190)->default('');
            },
            'procedures' => function (Blueprint $t) {
                $t->string('slug', 120)->unique();
                $t->string('icon', 40)->default('diagnostic');
                $t->string('image', 500)->default('');
                $t->mediumText('content')->nullable();
                $t->boolean('enabled')->default(true);
                $t->integer('sort')->default(0);
            },
            'branches' => function (Blueprint $t) {
                foreach (['name', 'address', 'hours'] as $f) {
                    $len = $f === 'address' ? 500 : ($f === 'name' ? 190 : 255);
                    $t->string($f.'_ar', $len)->default('');
                    $t->string($f.'_en', $len)->default('');
                }
                $t->string('phone', 40)->default('');
                $t->string('whatsapp', 40)->default('');
                $t->string('map_url', 500)->default('');
                $t->string('lat', 20)->default('');
                $t->string('lng', 20)->default('');
                $t->string('image', 500)->default('');
                $t->boolean('enabled')->default(true);
                $t->integer('sort')->default(0);
            },
            'about' => function (Blueprint $t) {
                $t->string('kind', 20)->default('section');
                $t->string('title_ar')->default('');
                $t->string('title_en')->default('');
                $t->text('body_ar')->nullable();
                $t->text('body_en')->nullable();
                $t->string('image', 500)->default('');
                $t->boolean('enabled')->default(true);
                $t->integer('sort')->default(0);
            },
            'media' => function (Blueprint $t) {
                $t->string('slot', 40)->default('gallery');
                $t->string('url', 500)->default('');
                $t->string('alt_ar')->default('');
                $t->string('alt_en')->default('');
                $t->boolean('enabled')->default(true);
                $t->integer('sort')->default(0);
            },
            'articles' => function (Blueprint $t) {
                $t->string('slug', 160)->unique();
                $t->string('category_ar', 120)->default('');
                $t->string('category_en', 120)->default('');
                $t->string('title_ar')->default('');
                $t->string('title_en')->default('');
                $t->text('excerpt_ar')->nullable();
                $t->text('excerpt_en')->nullable();
                $t->mediumText('body_ar')->nullable();
                $t->mediumText('body_en')->nullable();
                $t->string('image', 500)->default('');
                $t->date('published_on')->nullable();
                $t->boolean('enabled')->default(true);
                $t->integer('sort')->default(0);
            },
        ];

        foreach ($tables as $name => $columns) {
            if (Schema::hasTable($name)) {
                continue;
            }
            Schema::create($name, function (Blueprint $t) use ($name, $columns) {
                if ($name !== 'settings') {
                    $t->id();
                }
                $columns($t);
                if ($name !== 'settings') {
                    $t->dateTime('created_at')->useCurrent()->index();
                }
            });
        }
    }

    public function down(): void
    {
        foreach (['settings', 'appointments', 'leads', 'cases', 'referrers', 'patients', 'testimonials', 'faqs', 'events', 'procedures', 'branches', 'about', 'media', 'articles'] as $name) {
            Schema::dropIfExists($name);
        }
    }
};
