<?php
// Copy to config.php on the server and fill in. config.php is git-ignored and blocked from the web by .htaccess.
return [
    'db' => [
        'host' => 'localhost',
        'name' => 'cpaneluser_drayman',
        'user' => 'cpaneluser_drayman',
        'pass' => 'CHANGE_ME',
    ],
    // Long random string. Needed once for /api/setup.php?token=..., which creates the tables and the first admin.
    'setup_token' => 'CHANGE_ME_TO_A_LONG_RANDOM_STRING',
    // Optional: email notified when a booking or referral arrives (uses PHP mail()).
    'notify_email' => '',
    // Optional: Google Places API key (Places API (New) enabled, restricted to this server's IP). With the Place ID in
    // Dashboard > Settings, the site shows the live Google rating and recent reviews, refreshed once a week.
    'google_places_key' => '',
    // Optional: send each new booking/referral to the clinic WhatsApp through the WhatsApp Business Cloud API.
    // Needs an approved message template with 5 body variables: type, name, phone, reason, preferred date.
    'whatsapp_cloud' => [
        'token' => '',            // permanent system-user access token
        'phone_number_id' => '',  // the sending business number's ID
        'to' => '',               // clinic WhatsApp in international format, e.g. 2010xxxxxxxx
        'template' => '',         // e.g. new_booking
        'language' => 'ar',
    ],
];
