<?php

namespace Database\Factories;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Profile::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'gender' => $this->faker->boolean,
            'birthplace' => $this->faker->city,
            'birthday' => $this->faker->dateTimeBetween('-30 years', '-20 years'),
            'biography' => $this->faker->sentence,
        ];
    }
}
