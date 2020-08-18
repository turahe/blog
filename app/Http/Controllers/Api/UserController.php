<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Api;

use Hash;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\UsersRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\User as UserResource;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * Class UserController.
 */
class UserController extends Controller
{
    /**
     * Return the users.
     * @param Request $request
     * @return ResourceCollection
     */
    public function index(Request $request): ResourceCollection
    {
        return UserResource::collection(
            User::withCount(['comments', 'posts'])
                ->with('roles')->latest()
                ->paginate($request->input('limit', 20))
        );
    }

    /**
     * Return the specified resource.
     * @param User $user
     * @return UserResource
     */
    public function show(User $user): UserResource
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     * @param UsersRequest $request
     * @param User $user
     * @throws AuthorizationException
     * @return UserResource
     */
    public function update(UsersRequest $request, User $user): UserResource
    {
        $this->authorize('update', $user);

        if ($request->filled('password')) {
            $request->merge([
                'password' => Hash::make($request->input('password')),
            ]);
        }

        $user->update(array_filter($request->only(['name', 'email', 'password'])));

        return new UserResource($user);
    }
}
