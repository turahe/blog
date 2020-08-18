<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Providers\RouteServiceProvider;

/**
 * Class RedirectIfAuthenticated.
 */
class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param Closure $next
     * @param  null|string  $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        if (\Auth::guard($guard)->check()) {
            return redirect(RouteServiceProvider::HOME);
        }

        return $next($request);
    }
}
