<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Api;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PostRequest;
use App\Http\Resources\Post as PostResource;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * Class PostController.
 */
class PostController extends Controller
{
    /**
     * Return the posts.
     * @param Request $request
     * @return ResourceCollection
     */
    public function index(Request $request): ResourceCollection
    {
        return PostResource::collection(
            Post::search($request->input('q'))
                ->where('type', 'blog')
                ->withCount('comments', 'likes')->latest()
                ->with('user')
                ->paginate($request->input('limit', 20))
        );
    }

    /**
     * Update the specified resource in storage.
     * @param PostRequest $request
     * @param Post $post
     * @throws AuthorizationException
     * @return PostResource
     */
    public function update(PostRequest $request, Post $post): PostResource
    {
        $this->authorize('update', $post);

        $post->update($request->only(['title', 'content', 'published_at', 'user_id', 'thumbnail_id']));

        return new PostResource($post);
    }

    /**
     * Store a newly created resource in storage.
     * @param PostRequest $request
     * @param Post $post
     * @throws AuthorizationException
     * @return PostResource
     */
    public function store(PostRequest $request, Post $post): PostResource
    {
        $this->authorize('store', Post::class);

        return new PostResource(
            $post->create($request->all())
        );
    }

    /**
     * Return the specified resource.
     * @param Post $post
     * @return PostResource
     */
    public function show(Post $post): PostResource
    {
        return new PostResource($post);
    }

    /**
     * Remove the specified resource from storage.
     * @param Post $post
     * @throws AuthorizationException
     * @return Response
     */
    public function destroy(Post $post): Response
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->noContent();
    }
}
