<?php

/*
| Clinic API settings. The resource lists are the only tables and columns the dashboard can read or write.
*/

$social = ['facebook', 'instagram', 'youtube', 'tiktok', 'x', 'threads', 'snapchat', 'linkedin', 'telegram', 'whatsapp_channel', 'pinterest', 'vezeeta'];
$public = array_merge(['phone', 'whatsapp', 'email', 'website', 'address_ar', 'address_en', 'hours_ar', 'hours_en', 'map_url', 'review_url'], $social, ['ga_id', 'meta_pixel_id']);

return [
    'resources' => [
        'appointments' => ['patient_name', 'phone', 'date', 'time', 'reason', 'status', 'source', 'notes'],
        'leads' => ['type', 'name', 'phone', 'payload', 'label', 'status', 'responded_at'],
        'cases' => ['patient_name', 'phone', 'procedure', 'stage', 'referring_doctor', 'next_follow_up', 'notes'],
        'referrers' => ['name', 'specialty', 'city', 'phone', 'cases_count', 'last_referral', 'report_sent'],
        'patients' => ['name', 'phone', 'age', 'city', 'condition', 'summary', 'last_visit'],
        'testimonials' => ['quote_ar', 'quote_en', 'author', 'source', 'rating', 'approved'],
        'faqs' => ['category_ar', 'category_en', 'q_ar', 'a_ar', 'q_en', 'a_en', 'published', 'sort'],
        'events' => ['type', 'page'],
        'procedures' => ['slug', 'icon', 'image', 'content', 'enabled', 'sort'],
        'branches' => ['name_ar', 'name_en', 'address_ar', 'address_en', 'hours_ar', 'hours_en', 'phone', 'whatsapp', 'map_url', 'lat', 'lng', 'image', 'enabled', 'sort'],
        'articles' => ['slug', 'category_ar', 'category_en', 'title_ar', 'title_en', 'excerpt_ar', 'excerpt_en', 'body_ar', 'body_en', 'image', 'published_on', 'enabled', 'sort'],
        'about' => ['kind', 'title_ar', 'title_en', 'body_ar', 'body_en', 'image', 'enabled', 'sort'],
        'media' => ['slot', 'url', 'alt_ar', 'alt_en', 'enabled', 'sort'],
    ],

    // Website content shown publicly (enabled rows only), ordered by `sort`.
    'content' => ['procedures', 'faqs', 'branches', 'about', 'media', 'articles'],

    'setting_keys' => array_merge($public, ['google_reviews', 'google_reviews_goal', 'google_place_id', 'gsc_verification']),
    'public_setting_keys' => $public,

    // Needed once for /setup?token=..., which creates the tables, the default content and the first admin.
    'setup_token' => env('CLINIC_SETUP_TOKEN', ''),

    // Optional: email told about each new booking or referral (uses the MAIL_* settings).
    'notify_email' => env('CLINIC_NOTIFY_EMAIL', ''),

    // Optional: Google Places API (New) key, restricted to the server IP. With the Place ID in Dashboard > Settings
    // the site shows the live Google rating and recent reviews.
    'google_places_key' => env('GOOGLE_PLACES_KEY', ''),
    'google_refresh_days' => 7,

    // Optional: push each new booking or referral to the clinic WhatsApp (WhatsApp Business Cloud API).
    // Needs an approved template with 5 body variables: type, name, phone, reason, preferred date.
    'whatsapp_cloud' => [
        'token' => env('WHATSAPP_CLOUD_TOKEN', ''),
        'phone_number_id' => env('WHATSAPP_CLOUD_PHONE_NUMBER_ID', ''),
        'to' => env('WHATSAPP_CLOUD_TO', ''),
        'template' => env('WHATSAPP_CLOUD_TEMPLATE', ''),
        'language' => env('WHATSAPP_CLOUD_LANGUAGE', 'ar'),
    ],
];
