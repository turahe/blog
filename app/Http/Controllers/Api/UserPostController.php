<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\Post as PostResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * Class UserPostController.
 */
class UserPostController extends Controller
{
    /**
     * Return the user's posts.
     * @param Request $request
     * @param User $user
     * @return ResourceCollection
     */
    public function index(Request $request, User $user): ResourceCollection
    {
        return PostResource::collection(
            $user->posts()->latest()->paginate($request->input('limit', 20))
        );
    }
}
