<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GoogleReviews;
use App\Support\Settings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/** Signed-in only: clinic settings, image uploads and a manual Google refresh. */
class AdminController extends Controller
{
    private const IMAGE_TYPES = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];

    public function saveSettings(Request $request): JsonResponse
    {
        return response()->json(Settings::save($request->all()));
    }

    public function googleRefresh(GoogleReviews $google): JsonResponse
    {
        return response()->json($google->get(true));
    }

    /** Stores an image in /uploads/YYYY/MM next to the website, after checking it really is a JPEG, PNG, WebP or GIF. */
    public function upload(Request $request): JsonResponse
    {
        $file = $request->file('file');
        if (! $file || ! $file->isValid()) {
            return response()->json(['error' => 'upload failed'], 422);
        }
        if ($file->getSize() > 8 * 1024 * 1024) {
            return response()->json(['error' => 'image larger than 8 MB'], 413);
        }
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file->getRealPath());
        if (! isset(self::IMAGE_TYPES[$mime]) || @getimagesize($file->getRealPath()) === false) {
            return response()->json(['error' => 'only jpg, png, webp or gif images'], 415);
        }
        $sub = gmdate('Y/m');
        $name = bin2hex(random_bytes(12)).'.'.self::IMAGE_TYPES[$mime];
        $file->move(public_path('uploads/'.$sub), $name);
        @chmod(public_path("uploads/$sub/$name"), 0644);

        return response()->json(['url' => "/uploads/$sub/$name"], 201);
    }
}
