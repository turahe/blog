<?php

namespace App\Http\Controllers;

use App\Libraries\Manifest\ManifestService;

/**
 * Class ManifestController.
 */
final class ManifestController extends Controller
{
    /**
     * @param ManifestService $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function manifestJson(ManifestService $service)
    {
        return response()->json($service->generate());
    }

    /**
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function offline()
    {
        return view('vendor.pwa.offline');
    }
}
