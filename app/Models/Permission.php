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
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Permission\Models\Permission as Model;

/**
 * Class Permission.
 *
 * @property-read Collection|Model[] $permissions
 * @property-read null|int $permissions_count
 * @property-read Collection|\Spatie\Permission\Models\Role[] $roles
 * @property-read null|int $roles_count
 * @property-read Collection|User[] $users
 * @property-read null|int $users_count
 * @method static bool|null forceDelete()
 * @method static Builder|Permission newModelQuery()
 * @method static Builder|Permission newQuery()
 * @method static \Illuminate\Database\Query\Builder|Permission onlyTrashed()
 * @method static Builder|Model permission($permissions)
 * @method static Builder|Permission query()
 * @method static bool|null restore()
 * @method static Builder|Model role($roles, $guard = null)
 * @method static \Illuminate\Database\Query\Builder|Permission withTrashed()
 * @method static \Illuminate\Database\Query\Builder|Permission withoutTrashed()
 * @mixin Eloquent
 * @property int $id
 * @property string $name
 * @property null|string $description
 * @property string $guard_name
 * @property null|Carbon $deleted_at
 * @property null|Carbon $created_at
 * @property null|Carbon $updated_at
 * @method static Builder|Permission whereCreatedAt($value)
 * @method static Builder|Permission whereDeletedAt($value)
 * @method static Builder|Permission whereDescription($value)
 * @method static Builder|Permission whereGuardName($value)
 * @method static Builder|Permission whereId($value)
 * @method static Builder|Permission whereName($value)
 * @method static Builder|Permission whereUpdatedAt($value)
 * @property-read Collection|\Spatie\Activitylog\Models\Activity[] $activities
 * @property-read null|int $activities_count
 */
class Permission extends Model
{
    use SoftDeletes, LogsActivity;
}
