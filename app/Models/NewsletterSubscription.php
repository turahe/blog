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
use Illuminate\Support\Carbon;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\NewsletterSubscription.
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property null|Carbon $created_at
 * @property null|Carbon $updated_at
 * @method static bool|null forceDelete()
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription newQuery()
 * @method static Builder|NewsletterSubscription onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription query()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NewsletterSubscription whereUpdatedAt($value)
 * @method static Builder|NewsletterSubscription withTrashed()
 * @method static Builder|NewsletterSubscription withoutTrashed()
 * @mixin Eloquent
 * @property-read Collection|\Spatie\Activitylog\Models\Activity[] $activities
 * @property-read null|int $activities_count
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
