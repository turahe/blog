<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Api\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\User as UserResource;

class AuthenticateController extends Controller
{
    /**
     * Return the user's access token.
     * @param Request $request
     * @return JsonResponse|UserResource
     */
    public function authenticate(Request $request): JsonResponse
    {
        if (Auth::attempt(['email' => $request->input('email'), 'password' => $request->input('password')])) {
            $user = User::where('email', $request->input('email'))->first();

            return (new UserResource($user))
                ->additional(['meta' => [
                    'access_token' => $user->api_token,
                ]]);
        }

        return response()->json(['message' => 'This action is unauthorized.'], 401);
    }
}
