<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class User.
 * @property mixed provider
 * @property int provider_id
 * @property int registered_at
 * @property mixed roles
 * @property mixed email
 * @property int id
 * @property string name
 * @property string avatar
 */
class User extends JsonResource
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
            'name' => $this->name,
            'avatar' => $this->avatar,
            'email' => $this->email,
            'provider' => $this->provider,
            'provider_id' => $this->provider_id,
            'registered_at' => $this->registered_at->toIso8601String() ?? now(),
            'time_humanize'=> Carbon::parse($this->registered_at)->diffForHumans(),
            'comments_count' => $this->comments_count ?? $this->comments()->count(),
            'posts_count' => $this->posts_count ?? $this->posts()->count(),
            'roles' => Role::collection($this->roles),
        ];
    }
}
