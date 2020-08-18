<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\Social as Model;
use Faker\Generator as Faker;

$factory->define(Model::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'url' => $faker->domainName,
    ];
});
