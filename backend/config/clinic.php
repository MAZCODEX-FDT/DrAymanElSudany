<?php

// Clinic-specific settings. Secrets come from .env only.
return [
    // Dashboard collections and the columns each one may write (anything else in a request is ignored).
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

    'setting_keys' => [
        'phone', 'whatsapp', 'email', 'website', 'address_ar', 'address_en', 'hours_ar', 'hours_en', 'map_url', 'review_url',
        'facebook', 'instagram', 'youtube', 'tiktok', 'x', 'threads', 'snapchat', 'linkedin', 'telegram', 'whatsapp_channel', 'pinterest', 'vezeeta',
        'google_reviews', 'google_reviews_goal', 'google_place_id', 'ga_id', 'meta_pixel_id', 'gsc_verification',
    ],
    'public_setting_keys' => [
        'phone', 'whatsapp', 'email', 'website', 'address_ar', 'address_en', 'hours_ar', 'hours_en', 'map_url', 'review_url',
        'facebook', 'instagram', 'youtube', 'tiktok', 'x', 'threads', 'snapchat', 'linkedin', 'telegram', 'whatsapp_channel', 'pinterest', 'vezeeta',
        'ga_id', 'meta_pixel_id',
    ],

    // Email notified on each new booking or referral (optional).
    'notify_email' => env('CLINIC_NOTIFY_EMAIL', ''),

    // One-time setup page (/setup?token=...). Leave empty to switch the page off.
    'setup_token' => env('CLINIC_SETUP_TOKEN', ''),

    // Google Places API (New) key for the live rating and reviews. The Place ID is set in dashboard Settings.
    'google_places_key' => env('GOOGLE_PLACES_KEY', ''),
    'google_refresh_days' => 7,

    // Optional: push each new booking/referral to the clinic WhatsApp (WhatsApp Business Cloud API, approved template
    // with 5 body variables: type, name, phone, reason, preferred day).
    'whatsapp_cloud' => [
        'token' => env('WHATSAPP_CLOUD_TOKEN', ''),
        'phone_number_id' => env('WHATSAPP_CLOUD_PHONE_NUMBER_ID', ''),
        'to' => env('WHATSAPP_CLOUD_TO', ''),
        'template' => env('WHATSAPP_CLOUD_TEMPLATE', ''),
        'language' => env('WHATSAPP_CLOUD_LANGUAGE', 'ar'),
    ],
];
