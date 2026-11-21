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
];
