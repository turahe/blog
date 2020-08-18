<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Profile as Model;
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
$factory->define(Model::class, function (Faker $faker) {
    return [
        'first_name' => $faker->firstName,
        'last_name' => $faker->lastName,
        'gender' => $faker->boolean,
        'birthplace' => $faker->city,
        'birthday' => $faker->dateTimeBetween('-30 years', '-20 years'),
        'biography' => $faker->sentences(3, true),
    ];
});
