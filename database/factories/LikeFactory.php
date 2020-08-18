<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Like;
use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/
$factory->define(Like::class, function (Faker $faker) {
    return [
        //        'like_type' => $faker->randomElement(['App\Models\Post', 'App\Models\Media', 'App\Models\Comment']),
        //        'like_id' => mt_rand(1, 100),
        'user_id' => mt_rand(1, 10),
    ];
});
