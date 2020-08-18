<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Category extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'cover' => $this->cover,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'description' => $this->description,
            'created_at' => $this->created_at->toIso8601String(),
            'time_humanize' => $this->created_at->diffForHumans(),
            //            'posts' => Post::collection($this->whenLoaded('posts')),
        ];
//        return parent::toArray($request);
    }
}
