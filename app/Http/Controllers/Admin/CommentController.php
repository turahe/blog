<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Api\CommentsRequest;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pipeline\Pipeline;

/**
 * Class CommentController.
 */
final class CommentController extends Controller
{
    /**
     * Show the application comments index.
     * @param Request $request
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function index(Request $request)
    {
        $comments = app(Pipeline::class)
            ->send(Comment::with('post', 'user')->latest())
            ->through([
                \App\Http\QueryFilters\Type::class,
                \App\Http\QueryFilters\Sort::class,
                \App\Http\QueryFilters\MaxCount::class,
            ])
            ->thenReturn()
            ->paginate($request->input('limit', 10));

        return view('admin.comments.index', compact('comments'));
    }

    /**
     * Display the specified resource edit form.
     * @param Comment $comment
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function edit(Comment $comment)
    {
        return view('admin.comments.edit', [
            'comment' => $comment,
            'users' => User::pluck('name', 'id'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     * @param CommentsRequest $request
     * @param Comment $comment
     * @return RedirectResponse
     */
    public function update(CommentsRequest $request, Comment $comment): RedirectResponse
    {
        $comment->update($request->validated());

        return redirect()
            ->route('admin.comments.edit', $comment)
            ->with('success', __('comments.updated'));
    }

    /**
     * Remove the specified resource from storage.
     * @param Comment $comment
     * @throws \Exception
     * @return RedirectResponse
     */
    public function destroy(Comment $comment): RedirectResponse
    {
        $comment->delete();

        return redirect()
            ->route('admin.comments.index')
            ->with('success', __('comments.deleted'));
    }
}
