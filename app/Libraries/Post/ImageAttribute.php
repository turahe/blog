<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    5/21/20, 11:18 PM
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Post;

trait ImageAttribute
{
    /**
     * @return string
     */
    public function getSlideIndexAttribute(): string
    {
        if ($this->hasMedia('images')) {
            return $this->getFirstMediaUrl('images', 'slider-index');
        }

        return asset('storage/images/default/not-found/slide-index.jpg');
    }

    /**
     * @return string
     */
    public function getSlideShowAttribute(): string
    {
        if ($this->hasMedia('images')) {
            return $this->getFirstMediaUrl('images', 'slider-show');
        }

        return asset('storage/images/default/not-found/slide-show.jpg');
    }

    /**
     * @return string
     */
    public function getCoverAttribute(): string
    {
        if ($this->hasMedia('images')) {
            return $this->getFirstMediaUrl('images', 'lg');
        }

        return asset('storage/images/default/not-found/lg.jpg');
    }

    /**
     * @return string
     */
    public function getImageAttribute(): string
    {
        if ($this->hasMedia('images')) {
            return $this->getFirstMediaUrl('images', 'sm');
        }

        return asset('storage/images/default/not-found/sm.jpg');
    }

    /**
     * @return string
     */
    public function getThumbnailAttribute(): string
    {
        if ($this->hasMedia('images')) {
            return $this->getFirstMediaUrl('images', 'xs');
        }

        return asset('storage/images/default/not-found/xs.jpg');
    }
}
