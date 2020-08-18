<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    5/6/20, 1:56 AM
 *  @name          Rate.php
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Rate.
 *
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Rate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Rate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Rate query()
 * @mixin \Eloquent
 * @property int $id
 * @property int $post_id
 * @property int $user_id
 * @property int $rate
 * @property null|\Illuminate\Support\Carbon $created_at
 * @property null|\Illuminate\Support\Carbon $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Rate whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Rate whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Rate wherePostId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Rate whereRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Rate whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Rate whereUserId($value)
 */
class Rate extends Model
{
    protected $table = 'rates';
}
