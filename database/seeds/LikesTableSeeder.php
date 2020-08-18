<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

use App\Models\Like;
use Illuminate\Database\Seeder;

/**
 * Class LikesTableSeeder.
 */
class LikesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (App::environment(['local', 'staging', 'testing'])) {
            factory(Like::class, 100)->create();
        }
    }
}
