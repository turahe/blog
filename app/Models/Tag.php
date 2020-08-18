<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Models;

use Illuminate\Database\Query\Builder;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Collection;

/**
 * App\Models\Tag.
 *
 * @property int $id
 * @property string $tag
 * @property string $title
 * @property string $subtitle
 * @property string $meta_description
 * @property string $layout
 * @property null|string $type
 * @property null|int $order_column
 * @property null|\Illuminate\Support\Carbon $created_at
 * @property null|\Illuminate\Support\Carbon $updated_at
 * @property-read \App\Models\Activity[]|\Illuminate\Database\Eloquent\Collection $activities
 * @property-read null|int $activities_count
 * @property-read string $url
 * @property-read \App\Models\Permission[]|\Illuminate\Database\Eloquent\Collection $permissions
 * @property-read null|int $permissions_count
 * @property-read \App\Models\Post[]|\Illuminate\Database\Eloquent\Collection $post
 * @property-read null|int $post_count
 * @property-read \App\Models\Role[]|\Illuminate\Database\Eloquent\Collection $roles
 * @property-read null|int $roles_count
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag containing($name, $locale = null)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag newQuery()
 * @method static \Illuminate\Database\Query\Builder|\App\Models\Tag onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag permission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag role($roles, $guard = null)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag whereLayout($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag whereMetaDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag whereOrderColumn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag whereSubtitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag whereTag($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\App\Models\Tag withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag withType($type = null)
 * @method static \Illuminate\Database\Query\Builder|\App\Models\Tag withoutTrashed()
 * @mixin \Eloquent
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Tag ordered($direction = 'asc')
 */
class Tag extends Model
{
    use LogsActivity;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'type',
    ];

    /**
     * @param Builder $query
     * @param null|string $type
     * @return Builder
     */
    public function scopeWithType(Builder $query, string $type = null): Builder
    {
        if (is_null($type)) {
            return $query;
        }

        return $query->where('type', $type);
    }

    /**
     * @param array|\ArrayAccess|string $values
     * @param null|string $type
     * @return \Illuminate\Support\Collection|mixed|\Tightenco\Collect\Support\Collection
     */
    public static function findOrCreate($values, string $type = null)
    {
        $tags = collect($values)->map(function ($value) use ($type) {
            if ($value instanceof self) {
                return $value;
            }

            return static::findOrCreateFromString($value, $type);
        });

        return is_string($values) ? $tags->first() : $tags;
    }

    /**
     * @param string $type
     * @return Collection
     */
    public static function getWithType(string $type): Collection
    {
        return static::withType($type)->get();
    }

    /**
     * @param string $name
     * @param null|string $type
     * @return null|Builder|Model|object|Tag
     */
    public static function findFromString(string $name, string $type = null)
    {
        return static::query()
            ->where('name', $name)
            ->where('type', $type)
            ->first();
    }

    /**
     * @param string $name
     * @return null|Builder|Model|object|Tag
     */
    public static function findFromStringOfAnyType(string $name)
    {
        return static::query()
            ->where('name', $name)
            ->first();
    }

    /**
     * @param string $name
     * @param null|string $type
     * @return null|Builder|Model|object|Tag
     */
    protected static function findOrCreateFromString(string $name, string $type = null)
    {
        $locale = $locale ?? app()->getLocale();

        $tag = static::findFromString($name, $type);

        if (! $tag) {
            $tag = static::create([
                'name' =>$name,
                'type' => $type,
            ]);
        }

        return $tag;
    }
}
