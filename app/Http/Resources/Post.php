<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class Post.
 * @property mixed user_id
 * @property mixed published_at
 * @property mixed content
 * @property mixed slug
 * @property mixed title
 * @property mixed id
 * @property mixed subtitle
 * @property mixed user
 * @property mixed meta_description
 * @property mixed category
 * @property mixed content_html
 * @property mixed thumbnail
 * @property mixed cover
 */
class Post extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->url,
            'subtitle' => $this->subtitle,
            'description' => $this->meta_description,
            'content' => $this->content_html,
            'published_at' => $this->published_at,
            'time_humanize' => $this->published_at->diffForHumans(),
            //            'category' => $this->category->title,
            //            'author' => $this->user->name,
            //            'avatar' => $this->user->avatar,
            //            'comments_count' => $this->comments_count ?? $this->comments()->count(),
            //            'likes_count' => $this->likes_count ?? $this->likes()->count(),
            //            'image_thumbnail' => $this->thumbnail,
            //            'image_cover' => $this->cover
        ];
    }
}
