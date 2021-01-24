<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Models;

use App\Libraries\DateAttribute\DateAttributeTrait;
use App\Libraries\Like\Likeable;
use App\Libraries\Like\LikeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Traits\HasRoles;

class Comment extends Model implements LikeInterface
{
    use SoftDeletes, Likeable, LogsActivity, HasRoles, DateAttributeTrait;
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'parent_id',
        'title',
        'content',
        'published_at',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'published_at',
    ];

    /**
     * Return the comment's user.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Return the comment's post
     * Many to one polymorphic relationship between comments and post.
     *
     * @return MorphTo
     */
    public function post(): MorphTo
    {
        return $this->morphTo();
    }
}
