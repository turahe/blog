<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

/** @var Factory $factory */

use App\Models\Tag;
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
$factory->define(Tag::class, function (Faker $faker) {
    $word = $faker->unique()->word;

    return [
        'tag' => $word,
        'title' => ucfirst($word),
        'subtitle' => $faker->sentence,
        'meta_description' => "Meta for $word",
    ];
});
