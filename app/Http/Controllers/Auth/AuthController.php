<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Auth;

use Auth;
use Socialite;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

/**
 * Class AuthController.
 */
class AuthController extends Controller
{
    /**
     * Redirect the user to the GitHub authentication page.
     *
     * @param $provider
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /**
     * Obtain the user information from provider.
     *
     * @param $provider
     * @return RedirectResponse
     */
    public function handleProviderCallback($provider)
    {
        try {
            $user = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            return redirect()->route('login');
        }

        $authUser = $this->findOrCreateUser($user, $provider);

        Auth::login($authUser, true);

        return redirect()
            ->route('home')
            ->with('success', __('auth.logged_in_provider', ['provider' => $provider]));
    }

    /**
     * Return user if exists; create and return if doesn't.
     *
     * @param $user
     * @param $provider
     * @return Builder|Model|object
     */
    private function findOrCreateUser(User $user, $provider)
    {
        $authUser = $user->where('provider_id', $user->id)->first();

        if ($authUser) {
            return $authUser;
        }

        return $user->create([
            'name' => $user->name ?? $user->email,
            'email' => $user->email,
            'provider' => $provider,
            'provider_id' => $user->id,
        ]);
    }
}
