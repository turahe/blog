<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Social.
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $url
 * @property string|null $text
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|Social newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Social newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Social query()
 * @method static \Illuminate\Database\Eloquent\Builder|Social whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Social whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Social whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Social whereText($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Social whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Social whereUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Social whereUserId($value)
 * @mixin \Eloquent
 */
class Social extends Model
{
    use HasFactory;

    /**
     * Return the social's user.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
