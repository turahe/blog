<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Social.
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $url
 * @property null|string $text
 * @property null|\Illuminate\Support\Carbon $created_at
 * @property null|\Illuminate\Support\Carbon $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Social newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Social newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Social query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Social whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Social whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Social whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Social whereText($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Social whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Social whereUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Social whereUserId($value)
 * @mixin \Eloquent
 * @property-read \App\Models\User $user
 */
class Social extends Model
{
    /**
     * Return the socials's user.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
