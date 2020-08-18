<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Api;

use Auth;
use App\Models\Post;
use Illuminate\Http\Request;
use App\Events\CommentPosted;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CommentsRequest;
use App\Http\Resources\Comment as CommentResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * Class PostCommentController.
 */
class PostCommentController extends Controller
{
    /**
     * Return the post's comments.
     * @param Request $request
     * @param Post $post
     * @return ResourceCollection
     */
    public function index(Request $request, Post $post): ResourceCollection
    {
        return CommentResource::collection(
            $post->comments()->with('user')
                ->where('approved', true)
                ->latest()
                ->paginate($request->input('limit', 20))
        );
    }

    /**
     * Store a newly created resource in storage.
     * @param CommentsRequest $request
     * @param Post $post
     * @return CommentResource
     */
    public function store(CommentsRequest $request, Post $post): CommentResource
    {
        $comment = new CommentResource(
            Auth::user()->comments()->create($request->all())
        );

        broadcast(new CommentPosted($comment, $post))->toOthers();

        return $comment;
    }
}
