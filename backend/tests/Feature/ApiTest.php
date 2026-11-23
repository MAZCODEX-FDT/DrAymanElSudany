<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::create(['email' => 'admin@test.local', 'name' => 'Admin', 'password' => 'localpass12345']);
    }

    public function test_public_settings_hide_private_keys(): void
    {
        DB::table('settings')->insert([['k' => 'phone', 'v' => '0100'], ['k' => 'google_place_id', 'v' => 'secret-place']]);

        $this->getJson('/api/settings')->assertOk()->assertJsonPath('phone', '0100')->assertJsonMissingPath('google_place_id');
        $this->actingAs($this->admin())->getJson('/api/settings')->assertJsonPath('google_place_id', 'secret-place');
    }

    public function test_lead_is_saved_and_cleaned(): void
    {
        $this->postJson('/api/lead', ['type' => 'booking', 'name' => 'Sara', 'phone' => '0100 123 4567<x>', 'payload' => ['reason' => 'headache']])
            ->assertCreated()->assertJsonPath('ok', true);

        $row = DB::table('leads')->first();
        $this->assertSame('0100 123 4567', $row->phone);
        $this->assertSame('new', $row->label);
        $this->postJson('/api/lead', ['name' => '', 'phone' => '1'])->assertStatus(422)->assertJsonPath('error', 'name and phone required');
    }

    public function test_lead_is_rate_limited(): void
    {
        for ($i = 0; $i < 8; $i++) {
            $this->postJson('/api/lead', ['name' => 'A', 'phone' => '01001234567'])->assertCreated();
        }
        $this->postJson('/api/lead', ['name' => 'A', 'phone' => '01001234567'])->assertStatus(429)->assertJsonPath('error', 'too many requests');
    }

    public function test_writes_must_be_json_and_same_origin(): void
    {
        $this->post('/api/lead', ['name' => 'A', 'phone' => '01001234567'], ['Content-Type' => 'application/x-www-form-urlencoded'])->assertStatus(415);
        $this->postJson('/api/lead', ['name' => 'A', 'phone' => '01001234567'], ['Origin' => 'https://evil.example'])->assertStatus(403);
        $this->postJson('/api/lead', ['name' => 'A', 'phone' => '01001234567'], ['Origin' => 'http://localhost'])->assertCreated();
    }

    public function test_dashboard_needs_sign_in(): void
    {
        $this->get('/api/leads')->assertStatus(401)->assertJsonPath('error', 'unauthorized');
        $this->getJson('/api/leads')->assertStatus(401)->assertJsonPath('error', 'unauthorized');
        $this->getJson('/api/me')->assertStatus(401);
        $this->putJson('/api/settings', ['phone' => '1'])->assertStatus(401);
    }

    public function test_login_me_logout(): void
    {
        $this->admin();
        $this->postJson('/api/login', ['email' => 'ADMIN@test.local ', 'password' => 'wrong-password'])->assertStatus(401)->assertJsonPath('error', 'invalid');
        $this->postJson('/api/login', ['email' => 'ADMIN@test.local ', 'password' => 'localpass12345'])->assertOk()->assertJsonPath('user.email', 'admin@test.local');
        $this->getJson('/api/me')->assertOk()->assertJsonPath('user.name', 'Admin');
        $this->postJson('/api/logout')->assertOk();
    }

    public function test_change_password(): void
    {
        $user = $this->admin();
        $this->actingAs($user)->postJson('/api/password', ['current' => 'nope', 'next' => 'newpassword123'])->assertStatus(403);
        $this->actingAs($user)->postJson('/api/password', ['current' => 'localpass12345', 'next' => 'short'])->assertStatus(422);
        $this->actingAs($user)->postJson('/api/password', ['current' => 'localpass12345', 'next' => 'newpassword123'])->assertOk();
        $this->assertTrue(password_verify('newpassword123', $user->fresh()->password));
    }

    public function test_resource_crud_with_whitelist_and_types(): void
    {
        $this->actingAs($this->admin());

        $row = $this->postJson('/api/articles', [
            'slug' => 'Stroke Signs!', 'title_ar' => 'علامات', 'enabled' => true, 'sort' => '3',
            'published_on' => '2026-13-45', 'image' => 'javascript:alert(1)', 'hacker' => 'x',
        ])->assertCreated()->json();

        $this->assertSame('stroke-signs', $row['slug']);
        $this->assertTrue($row['enabled']);
        $this->assertSame(3, $row['sort']);
        $this->assertNull($row['published_on']);
        $this->assertSame('', $row['image']);
        $this->assertArrayNotHasKey('hacker', $row);
        $this->assertMatchesRegularExpression('/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/', $row['created_at']);

        $this->putJson("/api/articles/{$row['id']}", ['enabled' => false, 'published_on' => '2026-11-20'])
            ->assertOk()->assertJsonPath('enabled', false)->assertJsonPath('published_on', '2026-11-20');
        $this->getJson('/api/articles')->assertOk()->assertJsonCount(1);
        $this->putJson('/api/articles/9999', ['sort' => 1])->assertStatus(404);
        $this->deleteJson("/api/articles/{$row['id']}")->assertOk();
        $this->getJson('/api/articles')->assertJsonCount(0);
        $this->getJson('/api/users')->assertStatus(404);

        $lead = $this->postJson('/api/leads', ['type' => 'booking', 'name' => 'A', 'payload' => ['a' => 1]])->json();
        $this->assertSame(['a' => 1], $lead['payload']);
    }

    public function test_public_content_shows_enabled_rows_in_order(): void
    {
        DB::table('faqs')->insert([
            ['q_ar' => 'b', 'published' => 1, 'sort' => 2],
            ['q_ar' => 'a', 'published' => 1, 'sort' => 1],
            ['q_ar' => 'hidden', 'published' => 0, 'sort' => 0],
        ]);
        $this->getJson('/api/public-content')->assertOk()->assertJsonCount(2, 'faqs')->assertJsonPath('faqs.0.q_ar', 'a')->assertJsonPath('faqs.0.published', true);
        $this->getJson('/api/public-faqs')->assertJsonCount(2);
    }

    public function test_event_tracking(): void
    {
        $this->postJson('/api/event', ['type' => 'whatsapp', 'page' => '/'])->assertCreated();
        $this->postJson('/api/event', ['type' => 'hack'])->assertStatus(422);
        $this->assertSame(1, DB::table('events')->count());
    }

    public function test_upload_checks_the_image(): void
    {
        $this->actingAs($this->admin());
        $headers = ['Origin' => 'http://localhost', 'Accept' => 'application/json', 'Content-Type' => 'multipart/form-data; boundary=x'];

        $res = $this->post('/api/upload', ['file' => UploadedFile::fake()->image('x.png', 20, 20)], $headers)->assertCreated();
        $url = $res->json('url');
        $this->assertMatchesRegularExpression('#^/uploads/\d{4}/\d\d/[a-f0-9]{24}\.png$#', $url);
        $this->assertFileExists(public_path(ltrim($url, '/')));
        File::delete(public_path(ltrim($url, '/')));

        $this->post('/api/upload', ['file' => UploadedFile::fake()->createWithContent('x.png', '<?php echo 1;')], $headers)->assertStatus(415);
        $this->post('/api/upload', ['file' => UploadedFile::fake()->image('x.png')], ['Accept' => 'application/json', 'Content-Type' => 'multipart/form-data; boundary=x'])->assertStatus(403);
    }

    public function test_google_reviews_are_cached_for_a_week(): void
    {
        config(['clinic.google_places_key' => 'k']);
        DB::table('settings')->insert(['k' => 'google_place_id', 'v' => 'PLACE']);
        Http::fake(['places.googleapis.com/*' => Http::response(['rating' => 4.6, 'userRatingCount' => 715, 'reviews' => [
            ['rating' => 5, 'text' => ['text' => 'ممتاز'], 'authorAttribution' => ['displayName' => 'M']],
            ['rating' => 2, 'text' => ['text' => 'bad']],
        ]])]);

        $this->getJson('/api/public-google')->assertOk()->assertJsonPath('count', 715)->assertJsonCount(1, 'reviews_ar');
        $this->getJson('/api/public-google')->assertOk();
        Http::assertSentCount(2); // ar + en once; the second visit used the cache
    }

    public function test_sitemap_and_search_console(): void
    {
        DB::table('procedures')->insert(['slug' => 'stroke', 'content' => '{}']);
        DB::table('settings')->insert(['k' => 'gsc_verification', 'v' => 'google123abc.html']);

        $this->get('/sitemap.xml')->assertOk()->assertSee('/procedures/stroke', false)->assertSee('/en/before-your-visit', false);
        $this->get('/google123abc.html')->assertOk()->assertSee('google-site-verification: google123abc.html');
        $this->get('/google999.html')->assertNotFound();
    }

    public function test_setup_page_is_token_guarded_and_creates_admin(): void
    {
        $this->get('/setup')->assertForbidden();
        $this->get('/setup?token=wrong')->assertForbidden();
        $this->get('/setup?token=test-setup-token-0123456789')->assertOk()->assertSee('Create admin');
        $this->post('/setup?token=test-setup-token-0123456789', ['email' => 'Doc@Clinic.test', 'password' => 'longpassword1'])->assertOk()->assertSee('Admin created');
        $this->assertTrue(User::where('email', 'doc@clinic.test')->exists());
    }
}
