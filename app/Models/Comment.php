<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Turahe\Likeable\Contracts\Likeable as LikeableContract;
use Turahe\Likeable\Traits\Likeable;

/**
 * App\Models\Comment.
 *
 * @property int $id
 * @property int $user_id
 * @property int|null $parent_id
 * @property string|null $title
 * @property string $content
 * @property string|null $comment_type
 * @property int|null $comment_id
 * @property \Illuminate\Support\Carbon|null $published_at
 * @property int $approved
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Activity[] $activities
 * @property-read int|null $activities_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Turahe\Likeable\Models\Like[] $dislikes
 * @property-read int $dislikes_count
 * @property-read \Turahe\Likeable\Models\LikeCounter|null $dislikesCounter
 * @property-read string $date
 * @property-read bool $disliked
 * @property-read bool $liked
 * @property-read int|null $likes_count
 * @property-read int $likes_diff_dislikes_count
 * @property-read string $month
 * @property-read string $publish_atom
 * @property-read mixed $publish
 * @property-read mixed $publish_date
 * @property-read mixed $publish_time
 * @property-read string $time_elapsed
 * @property-read \Illuminate\Database\Eloquent\Collection|\Turahe\Likeable\Models\Like[] $likes
 * @property-read \Illuminate\Database\Eloquent\Collection|\Turahe\Likeable\Models\Like[] $likesAndDislikes
 * @property-read int|null $likes_and_dislikes_count
 * @property-read \Turahe\Likeable\Models\LikeCounter|null $likesCounter
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Permission[] $permissions
 * @property-read int|null $permissions_count
 * @property-read Model|\Eloquent $post
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Role[] $roles
 * @property-read int|null $roles_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|Comment lastMonth(int $limit = 5)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment lastWeek()
 * @method static \Illuminate\Database\Eloquent\Builder|Comment latest()
 * @method static \Illuminate\Database\Eloquent\Builder|Comment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Comment newQuery()
 * @method static \Illuminate\Database\Query\Builder|Comment onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Comment orderByDislikesCount($direction = 'desc')
 * @method static \Illuminate\Database\Eloquent\Builder|Comment orderByLikesCount($direction = 'desc')
 * @method static \Illuminate\Database\Eloquent\Builder|Comment permission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment query()
 * @method static \Illuminate\Database\Eloquent\Builder|Comment role($roles, $guard = null)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment whereApproved($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment whereCommentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment whereCommentType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment whereDislikedBy($userId = null)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment whereLikedBy($userId = null)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment wherePublishedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Comment whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|Comment withTrashed()
 * @method static \Illuminate\Database\Query\Builder|Comment withoutTrashed()
 * @mixin \Eloquent
 */
class Comment extends Model implements LikeableContract
{
    use SoftDeletes;
    use  Likeable;
    use LogsActivity;
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
