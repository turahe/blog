<?php

namespace App\Http\Middleware;

use Closure;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class CacheControl.
 */
class CacheControl
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        /** @var \Illuminate\Http\Response $response */
        $response = $next($request);

        if ($this->shouldAddCacheHeader($request, $response)) {
            $response->headers->add(['Cache-Control' => 'max-age=600, public']);
        }

        return $response;
    }

    /**
     * @param $request
     * @param Response $response
     * @return bool
     */
    public function shouldAddCacheHeader($request, Response $response): bool
    {
        if (! app()->environment('production')) {
            return false;
        }

        if (auth()->check()) {
            return false;
        }

        if ($request->method() !== 'GET') {
            return false;
        }

        if (! $response->isSuccessful()) {
            return false;
        }

        return true;
    }
}
