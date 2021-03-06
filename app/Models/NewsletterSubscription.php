<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Carbon;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * App\Models\NewsletterSubscription.
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|\App\Models\Activity[] $activities
 * @property-read int|null $activities_count
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription newQuery()
 * @method static Builder|NewsletterSubscription onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription query()
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription whereUpdatedAt($value)
 * @method static Builder|NewsletterSubscription withTrashed()
 * @method static Builder|NewsletterSubscription withoutTrashed()
 * @mixin Eloquent
 */
class NewsletterSubscription extends Model
{
    use SoftDeletes, LogsActivity;
    /**
     * The attributes that are mass assignable.
     * @var array
     */
    protected $fillable = ['name', 'email'];
}
