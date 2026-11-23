<?php

/*
| Bluehost entry point for the Laravel API. This folder (public_html) holds the built React site;
| the Laravel app lives one level up in ~/drayman-app, out of reach of the web.
| Only /api/*, /sitemap.xml, /google*.html and /setup are sent here (see .htaccess).
*/

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$app_dir = dirname(__DIR__).'/drayman-app';

if (file_exists($maintenance = $app_dir.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $app_dir.'/vendor/autoload.php';

$app = require_once $app_dir.'/bootstrap/app.php';
$app->usePublicPath(__DIR__); // uploads are saved to public_html/uploads
$app->handleRequest(Request::capture());
