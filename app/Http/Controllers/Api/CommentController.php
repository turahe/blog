<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Api;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use App\Http\Resources\Comment as CommentResource;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * Class CommentController.
 */
class CommentController extends Controller
{
    /**
     * Return the comments.
     * @param Request $request
     * @param Comment $comment
     * @return ResourceCollection
     */
    public function index(Request $request, Comment $comment): ResourceCollection
    {
        return CommentResource::collection(
            $comment->latest()
                ->paginate($request->input('limit', 20))
        );
    }

    /**
     * Return the specified resource.
     * @param Comment $comment
     * @return CommentResource
     */
    public function show(Comment $comment): CommentResource
    {
        return new CommentResource($comment);
    }

    /**
     * Remove the specified resource from storage.
     * @param Comment $comment
     * @throws \Exception
     * @throws AuthorizationException
     * @return Response
     */
    public function destroy(Comment $comment): Response
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->noContent();
    }
}
