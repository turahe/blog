<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Models\Comment;
use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Api\CommentsRequest;

/**
 * Class CommentController.
 */
final class CommentController extends Controller
{
    /**
     * Show the application comments index.
     */
    public function index(): View
    {
        return view('admin.comments.index', [
            'comments' => Comment::with(['post', 'user'])
                ->latest()
                ->get(),
        ]);
    }

    /**
     * Display the specified resource edit form.
     * @param Comment $comment
     * @return View
     */
    public function edit(Comment $comment): View
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
