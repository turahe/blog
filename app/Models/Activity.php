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
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Spatie\Activitylog\Models\Activity as Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * App\Models\Activity.
 *
 * @property int $id
 * @property null|string $log_name
 * @property string $description
 * @property null|int $subject_id
 * @property null|string $subject_type
 * @property null|int $causer_id
 * @property null|string $causer_type
 * @property null|Collection $properties
 * @property null|Carbon $created_at
 * @property null|Carbon $updated_at
 * @property-read Eloquent|\Illuminate\Database\Eloquent\Model $causer
 * @property-read mixed $changes
 * @property-read Eloquent|\Illuminate\Database\Eloquent\Model $subject
 * @method static Builder|Model causedBy(\Illuminate\Database\Eloquent\Model $causer)
 * @method static Builder|Model forSubject(\Illuminate\Database\Eloquent\Model $subject)
 * @method static Builder|Model inLog($logNames)
 * @method static Builder|Activity newModelQuery()
 * @method static Builder|Activity newQuery()
 * @method static Builder|Activity query()
 * @method static Builder|Activity whereCauserId($value)
 * @method static Builder|Activity whereCauserType($value)
 * @method static Builder|Activity whereCreatedAt($value)
 * @method static Builder|Activity whereDescription($value)
 * @method static Builder|Activity whereId($value)
 * @method static Builder|Activity whereLogName($value)
 * @method static Builder|Activity whereProperties($value)
 * @method static Builder|Activity whereSubjectId($value)
 * @method static Builder|Activity whereSubjectType($value)
 * @method static Builder|Activity whereUpdatedAt($value)
 * @mixin Eloquent
 * @method static Builder|Model forEvent($event)
 * @property null|string $event
 * @method static Builder|Activity whereEvent($value)
 */
class Activity extends Model
{
    /**
     * @return HasOne
     */
    public function getUser(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'causer_id');
    }

    /**
     * @return HasOne
     */
    public function getSubject(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'causer_id');
    }
}
