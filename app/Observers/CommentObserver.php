<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Observers;

use App\Models\Comment;

/**
 * Class CommentObserver.
 */
class CommentObserver
{
    /**
     * Listen to the Comment creating event.
     * @param Comment $comment
     */
    public function creating(Comment $comment): void
    {
        $comment->published_at = now();
    }
}
