<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GoogleReviews;
use App\Services\Notifier;
use App\Support\Rows;
use App\Support\Settings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/** What the public website reads and sends: settings, content, reviews, booking/referral forms and click tracking. */
class PublicController extends Controller
{
    public function settings(): JsonResponse
    {
        return response()->json(Auth::check() ? Settings::all() : Settings::public());
    }

    public function content(): JsonResponse
    {
        $out = [];
        foreach (config('clinic.content') as $r) {
            $flag = $r === 'faqs' ? 'published' : 'enabled';
            $out[$r] = DB::table($r)->where($flag, true)->orderBy('sort')->orderBy('id')->get()->map(Rows::clean(...))->all();
        }

        return response()->json($out);
    }

    public function faqs(): JsonResponse
    {
        return response()->json(DB::table('faqs')->where('published', true)->orderBy('sort')->orderBy('id')
            ->get(['id', 'q_ar', 'a_ar', 'q_en', 'a_en'])->map(Rows::clean(...)));
    }

    public function testimonials(): JsonResponse
    {
        return response()->json(DB::table('testimonials')->where('approved', true)->orderByDesc('id')
            ->get(['id', 'quote_ar', 'quote_en', 'author', 'source', 'rating'])->map(Rows::clean(...)));
    }

    public function google(GoogleReviews $google): JsonResponse
    {
        return response()->json($google->get());
    }

    public function lead(Request $request, Notifier $notifier): JsonResponse
    {
        $type = in_array($request->input('type'), ['booking', 'referral', 'contact'], true) ? $request->input('type') : 'contact';
        $name = trim((string) $request->input('name', ''));
        $phone = preg_replace('/[^0-9+ ]/', '', (string) $request->input('phone', ''));
        if ($name === '' || strlen($phone) < 8) {
            return response()->json(['error' => 'name and phone required'], 422);
        }
        $payload = is_array($request->input('payload')) ? array_slice($request->input('payload'), 0, 20, true) : [];
        $row = Rows::insert('leads', Rows::filter('leads', [
            'type' => $type,
            'name' => $name,
            'phone' => $phone,
            'payload' => $payload,
            'label' => $type === 'referral' ? 'referring_doctor' : 'new',
            'status' => 'open',
        ]));
        $notifier->newLead($type, $name, $phone, $payload);

        return response()->json(['ok' => true, 'id' => $row['id']], 201);
    }

    public function event(Request $request): JsonResponse
    {
        $type = $request->input('type');
        if (! in_array($type, ['whatsapp', 'call', 'map', 'form'], true)) {
            return response()->json(['error' => 'bad type'], 422);
        }
        Rows::insert('events', ['type' => $type, 'page' => mb_substr((string) $request->input('page', ''), 0, 190)]);

        return response()->json(['ok' => true], 201);
    }
}
