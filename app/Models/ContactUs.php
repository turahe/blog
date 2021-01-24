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
 * App\Models\ContactUs.
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $subject
 * @property string|null $phone
 * @property string $message
 * @property int $status
 * @property int $read
 * @property Carbon|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection|\App\Models\Activity[] $activities
 * @property-read int|null $activities_count
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs newQuery()
 * @method static Builder|ContactUs onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs query()
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs whereRead($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs whereSubject($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ContactUs whereUpdatedAt($value)
 * @method static Builder|ContactUs withTrashed()
 * @method static Builder|ContactUs withoutTrashed()
 * @mixin Eloquent
 */
class ContactUs extends Model
{
    use SoftDeletes, LogsActivity;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'contact_us';

    /**
     * The attributes that should be mutated to dates.
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'subject', 'message', 'phone', 'status', 'read',
    ];
}
