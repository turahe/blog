<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    5/8/20, 3:44 PM
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Like;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

interface LikeInterface
{
    /**
     * Get all of the resource's likes.
     *
     * @return MorphMany
     */
    public function likes(): MorphMany;

    /**
     * Create a like if it does not exist yet.
     *
     * @return Model
     */
    public function like(): Model;

    /**
     * Check if the resource is liked by the current user.
     *
     * @return bool
     */
    public function isLiked(): bool;

    /**
     * Delete like for a resource.
     *
     * @return mixed
     */
    public function dislike();
}
