<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

/** @var Factory $factory */

use App\Models\Comment;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factory;

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
$factory->define(Comment::class, function (Faker $faker) {
    return [
        'user_id' => mt_rand(1, 100), //factory(\App\Models\User::class)->create()->id,
        'title' => $faker->sentence,
        'content' => Str::limit($faker->paragraph(mt_rand(3, 5))),
        'published_at' => $faker->dateTimeBetween('-1 Month', '+3 days'),
        'approved' => $faker->boolean,
    ];
});
