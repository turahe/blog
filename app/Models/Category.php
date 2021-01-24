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
use App\Libraries\Slug\SlugOptions;
use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * App\Models\Category.
 *
 * @property int $id
 * @property string $slug
 * @property int|null $parent_id
 * @property string $title
 * @property string|null $subtitle
 * @property string $description
 * @property int|null $order_column
 * @property string $layout
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Activity[] $activities
 * @property-read int|null $activities_count
 * @property-read \Illuminate\Database\Eloquent\Collection|Category[] $children
 * @property-read int|null $children_count
 * @property-read string $cover
 * @property-read Category $first_child
 * @property-read \Illuminate\Support\Collection $siblings
 * @property-read string|\Illuminate\Contracts\Routing\UrlGenerator $url
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection|Media[] $media
 * @property-read int|null $media_count
 * @property-read Category|null $parent
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Post[] $posts
 * @property-read int|null $posts_count
 * @method static \Illuminate\Database\Eloquent\Builder|Category newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Category newQuery()
 * @method static \Illuminate\Database\Query\Builder|Category onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Category ordered(string $direction = 'asc')
 * @method static \Illuminate\Database\Eloquent\Builder|Category query()
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereLayout($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereOrderColumn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereSubtitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Category whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|Category withTrashed()
 * @method static \Illuminate\Database\Query\Builder|Category withoutTrashed()
 * @mixin \Eloquent
 */
class Category extends Model implements HasMedia, Sortable
{
    use SoftDeletes;
    use    HasSlug;
    use    LogsActivity;
    use    InteractsWithMedia;
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
     * @return \Illuminate\Support\Collection
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
