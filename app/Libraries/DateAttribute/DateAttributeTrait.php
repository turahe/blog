<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\DateAttribute;

use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Builder;

/**
 * Trait DateAttributeTrait.
 */
trait DateAttributeTrait
{
    /**
     * Scope a query to order posts by latest posted.
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeLatest(Builder $query): Builder
    {
        return $query->orderBy('published_at', 'desc');
    }

    /**
     * Scope a query to only include posts posted last month.
     *
     * @param Builder $query
     * @param int $limit
     * @return Builder
     */
    public function scopeLastMonth(Builder $query, int $limit = 5): Builder
    {
        return $query->whereBetween('published_at', [Carbon::now()->subMonth(), Carbon::now()])
            ->latest()
            ->limit($limit);
    }

    /**
     * Scope a query to only include posts posted last week.
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeLastWeek(Builder $query): Builder
    {
        return $query->whereBetween('published_at', [Carbon::now()->subWeeks(1), now()])
            ->latest();
    }

    /**
     * get publish attribute.
     *
     * @param $value
     * @throws \Exception
     * @return mixed
     */
    public function getPublishAttribute($value): string
    {
        return $this->attributes['published_at'] = Carbon::parse($value)->format('D, M Y');
    }

    /**
     * get publish date attribute.
     *
     * @param $value
     * @throws \Exception
     * @return mixed
     */
    public function getPublishDateAttribute($value): string
    {
        return $this->attributes['published_at'] = Carbon::parse($value)->format('Y-m-d');
    }

    /**
     * get publish time attribute.
     *
     * @param $value
     * @throws \Exception
     * @return mixed
     */
    public function getPublishTimeAttribute($value): string
    {
        return $this->attributes['published_at'] = Carbon::parse($value)->format('H:i');
    }

    /**
     * get publish date attribute.
     *
     * @param $value
     * @return string
     */
    public function getDateAttribute($value): string
    {
        return $this->attributes['published_at'] = Carbon::parse($value)->format('d');
    }

    /**
     * get publish month attribute.
     *
     * @param $value
     * @return string
     */
    public function getMonthAttribute($value): string
    {
        return $this->attributes['published_at'] = Carbon::parse($value)->format('M');
    }

    /**
     * get publish time elapsed attribute.
     *
     * @return string
     */
    public function getTimeElapsedAttribute(): string
    {
        return  Carbon::parse($this->attributes['published_at'])->diffForHumans();
    }

    /**
     * get publish time elapsed attribute.
     *
     * @param $value
     * @return string
     */
    public function getPublishAtomAttribute($value): string
    {
        return $this->attributes['updated_at'] = Carbon::parse($value)->format(\DateTime::ATOM);
    }
}
