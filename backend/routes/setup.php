<?php

use App\Http\Controllers\SetupController;
use Illuminate\Support\Facades\Route;

// Runs without sessions or cookies, so it works before the tables (and the app key) exist. Guarded by CLINIC_SETUP_TOKEN.
Route::match(['get', 'post'], '/setup', SetupController::class);
