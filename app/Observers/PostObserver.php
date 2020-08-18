<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Observers;

use Str;
use App\Models\Post;

/**
 * Class PostObserver.
 */
class PostObserver
{
    /**
     * Listen to the Post saving event.
     * @param Post $post
     */
    public function saving(Post $post): void
    {
        $post->slug = Str::slug($post->title, '-');
    }
}
