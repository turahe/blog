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
use Spatie\Permission\Models\Role as Model;

/**
 * Class Role
 *
 * @package App\Models
 * @property-read Collection|\Spatie\Permission\Models\Permission[] $permissions
 * @property-read null|int $permissions_count
 * @property-read Collection|User[] $users
 * @property-read null|int $users_count
 * @method static bool|null forceDelete()
 * @method static Builder|Role newModelQuery()
 * @method static Builder|Role newQuery()
 * @method static \Illuminate\Database\Query\Builder|Role onlyTrashed()
 * @method static Builder|Model permission($permissions)
 * @method static Builder|Role query()
 * @method static bool|null restore()
 * @method static \Illuminate\Database\Query\Builder|Role withTrashed()
 * @method static \Illuminate\Database\Query\Builder|Role withoutTrashed()
 * @mixin Eloquent
 * @property int $id
 * @property string $name
 * @property null|string $description
 * @property string $guard_name
 * @property null|Carbon $deleted_at
 * @property null|Carbon $created_at
 * @property null|Carbon $updated_at
 * @method static Builder|Role whereCreatedAt($value)
 * @method static Builder|Role whereDeletedAt($value)
 * @method static Builder|Role whereDescription($value)
 * @method static Builder|Role whereGuardName($value)
 * @method static Builder|Role whereId($value)
 * @method static Builder|Role whereName($value)
 * @method static Builder|Role whereUpdatedAt($value)
 * @property-read Collection|\Spatie\Activitylog\Models\Activity[] $activities
 * @property-read null|int $activities_count
 */
class Role extends Model
{
    use SoftDeletes, LogsActivity;

    const ROLE_ADMIN = 'admin';
    const ROLE_EDITOR = 'editor';
    const ROLE_AUTHOR = 'author';
    const ROLE_GUEST = 'guest';
}
