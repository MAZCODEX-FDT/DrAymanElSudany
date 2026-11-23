<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\Rows;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/** Dashboard list/create/update/delete for every table in config('clinic.resources'). */
class ResourceController extends Controller
{
    public function index(string $resource): JsonResponse
    {
        $q = DB::table($resource);
        if ($resource === 'appointments') {
            $q->orderByDesc('date')->orderBy('time');
        } elseif (Rows::isContent($resource)) {
            $q->orderBy('sort')->orderBy('id');
        } else {
            $q->orderByDesc('id');
        }
        if ($resource === 'events') {
            $q->where('created_at', '>', gmdate('Y-m-d H:i:s', time() - 90 * 86400));
        }

        return response()->json($q->limit(5000)->get()->map(Rows::clean(...)));
    }

    public function store(Request $request, string $resource): JsonResponse
    {
        $fields = Rows::filter($resource, $request->all());
        if (! $fields) {
            return response()->json(['error' => 'empty'], 422);
        }

        return response()->json(Rows::insert($resource, $fields), 201);
    }

    public function update(Request $request, string $resource, int $id): JsonResponse
    {
        $fields = Rows::filter($resource, $request->all());
        if ($fields) {
            DB::table($resource)->where('id', $id)->update($fields);
        }
        $row = DB::table($resource)->find($id);

        return $row ? response()->json(Rows::clean($row)) : response()->json(['error' => 'not found'], 404);
    }

    public function destroy(string $resource, int $id): JsonResponse
    {
        DB::table($resource)->where('id', $id)->delete();

        return response()->json(['ok' => true]);
    }
}
