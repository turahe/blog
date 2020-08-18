<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Events;

use App\Models\Post;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use App\Http\Resources\Comment as CommentResource;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

/**
 * Class CommentPosted.
 */
class CommentPosted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Comment details.
     *
     * @var CommentResource
     */
    public CommentResource $comment;

    /**
     * Post details.
     *
     * @var Post
     */
    private Post $post;

    /**
     * Create a new event instance.
     *
     * @param CommentResource $comment
     * @param Post $post
     */
    public function __construct(CommentResource $comment, Post $post)
    {
        $this->comment = $comment;
        $this->post = $post;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array|Channel
     */
    public function broadcastOn(): Channel
    {
        return new Channel('post.'.$this->post->id);
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'comment.posted';
    }
}
