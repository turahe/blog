<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Faker\Generator as Faker;
use App\Models\Social as Model;

$factory->define(Model::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'url' => $faker->domainName,
    ];
});
