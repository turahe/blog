<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 * @author         Nur Wachid
 * @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Models;

use App\Libraries\Post\Markdown;
use App\Libraries\Post\ReadTime\ReadTime;
use App\Libraries\Slug\HasSlug;
use App\Libraries\Slug\SlugOptions;
use App\Libraries\Sortable\Sortable;
use App\Scopes\PostedScope;
use Illuminate\Contracts\Routing\UrlRoutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\EloquentSortable\SortableTrait;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Tags\HasTags;
use Turahe\Likeable\Contracts\Likeable as LikeableContract;
use Turahe\Likeable\Traits\Likeable;

/**
 * App\Models\Post.
 *
 * @property int $id
 * @property int $category_id
 * @property int $user_id
 * @property int|null $parent_id
 * @property string $slug
 * @property string $title
 * @property string|null $subtitle
 * @property string|null $meta_description
 * @property string $content_raw
 * @property string $content_html
 * @property string $is_draft
 * @property string $is_sticky
 * @property string $type
 * @property \Illuminate\Support\Carbon $published_at
 * @property string $layout
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read Collection|\App\Models\Activity[] $activities
 * @property-read int|null $activities_count
 * @property-read \App\Models\Category $category
 * @property-read Collection|Post[] $children
 * @property-read int|null $children_count
 * @property-read Collection|\App\Models\Comment[] $comments
 * @property-read int|null $comments_count
 * @property-read string $author
 * @property-read null|string $content
 * @property-read Post $first_child
 * @property-read string $keywords
 * @property-read ReadTime $read_time
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Post[] $siblings
 * @property-read string $url
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection|Media[] $media
 * @property-read int|null $media_count
 * @property-read Post|null $parent
 * @property-read \App\Models\User $user
 * @method static Builder|Post newModelQuery()
 * @method static Builder|Post newQuery()
 * @method static \Illuminate\Database\Query\Builder|Post onlyTrashed()
 * @method static Builder|Post query()
 * @method static Builder|Post search(?string $search)
 * @method static Builder|Post whereCategoryId($value)
 * @method static Builder|Post whereContentHtml($value)
 * @method static Builder|Post whereContentRaw($value)
 * @method static Builder|Post whereCreatedAt($value)
 * @method static Builder|Post whereDeletedAt($value)
 * @method static Builder|Post whereId($value)
 * @method static Builder|Post whereIsDraft($value)
 * @method static Builder|Post whereIsSticky($value)
 * @method static Builder|Post whereLayout($value)
 * @method static Builder|Post whereMetaDescription($value)
 * @method static Builder|Post whereParentId($value)
 * @method static Builder|Post wherePublishedAt($value)
 * @method static Builder|Post whereSlug($value)
 * @method static Builder|Post whereSubtitle($value)
 * @method static Builder|Post whereTitle($value)
 * @method static Builder|Post whereType($value)
 * @method static Builder|Post whereUpdatedAt($value)
 * @method static Builder|Post whereUserId($value)
 * @method static \Illuminate\Database\Query\Builder|Post withTrashed()
 * @method static \Illuminate\Database\Query\Builder|Post withoutTrashed()
 * @mixin \Eloquent
 */
class Post extends Model implements HasMedia, UrlRoutable, LikeableContract, Sortable
{
    use InteractsWithMedia;
    use HasSlug;
    use HasTags;
    use Likeable;
    use SoftDeletes;
    use LogsActivity;
    use HasFactory;
    use SortableTrait;

    /**
     * @var array
     */
    public $sortable = [
        'order_column_name' => 'order_column',
        'sort_when_creating' => true,
    ];


    /**
     * @var array
     */
    protected $dates = ['published_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'parent_id',
        'type',
        'title',
        'subtitle',
        'type',
        'order_column',
        'content',
        'meta_description',
        'status',
        'published_at',
    ];

    /**
     * @param null|Media $media
     * @throws \Spatie\Image\Exceptions\InvalidManipulation
     */
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('xs')
            ->width(90)
            ->height(80)
            ->sharpen(10)
            ->optimize()
            ->quality(70)
            ->withResponsiveImages();

        $this->addMediaConversion('sm')
            ->width(690)
            ->height(504)
            ->sharpen(10)
            ->optimize()
            ->quality(70)
            ->withResponsiveImages();

        $this->addMediaConversion('md')
            ->width(810)
            ->height(480)
            ->sharpen(10)
            ->optimize()
            ->quality(70)
            ->withResponsiveImages();

        $this->addMediaConversion('lg')
            ->width(870)
            ->height(448)
            ->sharpen(10)
            ->optimize()
            ->quality(70)
            ->withResponsiveImages();

        $this->addMediaConversion('xl')
            ->width(1170)
            ->height(600)
            ->sharpen(10)
            ->optimize()
            ->quality(70)
            ->withResponsiveImages();
    }

    /**
     * @return SlugOptions
     */
    public function getSlugOptions(): SlugOptions
    {
        // TODO: Implement getSlugOptions() method.
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName(): string
    {
        if (request()->expectsJson()) {
            return 'id';
        }

        return 'slug';
    }

    /**
     * Set the HTML content automatically when the raw content is set.
     *
     * @param string $value
     */
    public function setContentRawAttribute($value)
    {
        $markdown = new Markdown();

        $this->attributes['content_raw'] = $value;
        $this->attributes['content_html'] = $markdown->generate($value);
    }

    /**
     * Alias for content_raw.
     * @return null|string
     */
    public function getContentAttribute()
    {
        return $this->content_raw;
    }

    /**
     * Return URL to post.
     *
     * @return string
     */
    public function getUrlAttribute(): string
    {
        switch ($this->type) {
            case 'page':
                return url($this->slug);
                break;
            default:
                return url($this->type.'/'.$this->slug);
        }
    }

    /**
     * Return keyword of post based tags.
     *
     * @return string
     */
    public function getKeywordsAttribute(): string
    {
        $tags = $this->tags();

        return $tags->implode('tag', ', ');
    }

    /**
     * Scope a query to search posts.
     *
     * @param Builder $query
     * @param null|string $search
     * @return Builder
     */
    public function scopeSearch(Builder $query, ?string $search)
    {
        if ($search) {
            return $query->where('title', 'LIKE', "%{$search}%")
                ->orWhere('content_raw', 'LIKE', "%{$search}%");
        }
    }

    /**
     * @throws \Exception
     * @return ReadTime
     */
    public function getReadTimeAttribute(): ReadTime
    {
        $content = $this->content;
        $omitSeconds = config('blog.omit_seconds');
        $timeOnly = config('blog.time_only');
        $abbreviated = config('blog.abbreviate_time_measurements');
        $wordsPerMinute = config('blog.words_per_minute');
        $ltr = __('read-time.reads_left_to_right');
        $translation = __('read-time');

        return (new ReadTime($content))
            ->omitSeconds($omitSeconds)
            ->timeOnly($timeOnly)
            ->abbreviated($abbreviated)
            ->wpm($wordsPerMinute)
            ->ltr($ltr)
            ->setTranslation($translation);
    }

    /**
     * Define a one-to-many relationship.
     *
     * @return HasMany
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')
            ->orderBy('order_column');
    }

    /**
     * check if model has Children.
     *
     * @return bool
     */
    public function hasChildren(): bool
    {
        return count($this->children);
    }

    /**
     * get first element children models.
     *
     * @throws \Exception
     * @return Post
     */
    public function getFirstChildAttribute(): self
    {
        if (! $this->hasChildren()) {
            throw new \Exception("Article `{$this->title}` doesn't have any children.");
        }

        return $this->children->sortBy('order_column')->first();
    }

    /**
     * get sibling attribute.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getSiblingsAttribute()
    {
        return self::where('parent_id', $this->parent_id)
            ->orderBy('order_column')
            ->get();
    }

    /**
     * @return BelongsTo
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * Check if parent is exist or not null.
     *
     * @return bool
     */
    public function hasParent(): bool
    {
        return ! is_null($this->parent_id);
    }

    /**
     * one to many relationship between user and posts
     * example: $post->user->name.
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get Author name from table user.
     *
     * @return string
     */
    public function getAuthorAttribute(): string
    {
        if (! empty($this->user)) {
            return $this->user->name;
        }
    }

    /**
     * Define an inverse one-to-one or many relationship.
     *
     * @return BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Return the post's comments
     * Define a polymorphic one-to-many relationship.
     *
     * @return MorphMany
     */
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'comment');
    }

    /**
     * The "booting" method of the model.
     */
    protected static function boot(): void
    {
        parent::boot();
        static::addGlobalScope(new PostedScope);
    }

    /**
     * Prepare a date for array / JSON serialization.
     *
     * @param \DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(\DateTimeInterface $date): string
    {
        return $date->format('Y-m-d H:i:s');
    }
}
