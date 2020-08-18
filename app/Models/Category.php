<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Models;

use App\Libraries\Slug\HasSlug;
use Spatie\MediaLibrary\HasMedia;
use App\Libraries\Slug\SlugOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\Category.
 *
 * @property int $id
 * @property string $slug
 * @property null|int $parent_id
 * @property null|int $order_column
 * @property string $title
 * @property null|string $subtitle
 * @property string $description
 * @property string $layout
 * @property null|\Illuminate\Support\Carbon $deleted_at
 * @property null|\Illuminate\Support\Carbon $created_at
 * @property null|\Illuminate\Support\Carbon $updated_at
 * @property-read \App\Models\Activity[]|\Illuminate\Database\Eloquent\Collection $activities
 * @property-read null|int $activities_count
 * @property-read \App\Models\Category[]|\Illuminate\Database\Eloquent\Collection $children
 * @property-read null|int $children_count
 * @property-read \Category $first_child
 * @property-read \Category[]|\Collection $siblings
 * @property-read string|\UrlGenerator $url
 * @property-read \Illuminate\Database\Eloquent\Collection|\Spatie\MediaLibrary\MediaCollections\Models\Media[] $media
 * @property-read null|int $media_count
 * @property-read null|\App\Models\Category $parent
 * @property-read \App\Models\Post[]|\Illuminate\Database\Eloquent\Collection $posts
 * @property-read null|int $posts_count
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category newQuery()
 * @method static \Illuminate\Database\Query\Builder|\App\Models\Category onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category whereLayout($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category whereOrderColumn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category whereSubtitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Category whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Models\Category withTrashed()
 * @method static \Illuminate\Database\Query\Builder|\App\Models\Category withoutTrashed()
 * @mixin \Eloquent
 * @property-read string $cover
 */
class Category extends Model implements HasMedia
{
    use SoftDeletes, HasSlug, LogsActivity, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'parent_id',
        'order_column',
        'subtitle',
        'description',
    ];

    /**
     * @param null|Media $media
     * @throws \Spatie\Image\Exceptions\InvalidManipulation
     */
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('cover')
            ->optimize()
            ->quality(70)
            ->withResponsiveImages();
    }

    /**
     * @return string
     */
    public function getCoverAttribute(): string
    {
        if ($this->hasMedia('images')) {
            return $this->getFirstMediaUrl('images', 'cover');
        }

        return \Storage::url('img/categories/page.jpg');
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        if (request()->expectsJson()) {
            return 'id';
        }

        return 'slug';
    }

    /**
     * Generate slug form from title field.
     *
     * @return SlugOptions
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    /**
     * Generate url category by
     * call category->url.
     *
     * @return string|UrlGenerator
     */
    public function getUrlAttribute(): string
    {
        return url("category/{$this->slug}");
    }

    /**
     * Category has children.
     *
     * @return HasMany
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')
            ->orderBy('order_column');
    }

    /**
     * Count category if have children.
     *
     * @return bool
     */
    public function hasChildren(): bool
    {
        return count($this->children);
    }

    /**
     * @throws \Exception
     * @return Category
     */
    public function getFirstChildAttribute(): self
    {
        if (! $this->hasChildren()) {
            throw new \Exception("Category `{$this->title}` doesn't have any children.");
        }

        return $this->children->sortBy('order_column')->first();
    }

    /**
     * @return Category[]|Collection
     */
    public function getSiblingsAttribute()
    {
        return self::where('parent_id', $this->parent_id)
            ->orderBy('order_column')
            ->get();
    }

    /**
     * Parent of children.
     *
     * @return BelongsTo
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * check if model has parent.
     *
     * @return bool
     */
    public function hasParent(): bool
    {
        return ! is_null($this->parent_id);
    }

    /**
     * one to many polymorphic relation category model and other models.
     *
     * @return HasMany
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'category_id');
    }
}
