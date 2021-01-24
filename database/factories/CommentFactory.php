<?php

namespace Database\Factories;

use App\Models\Comment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CommentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Comment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => mt_rand(1, 100), //factory(\App\Models\User::class)->create()->id,
            'title' => $this->faker->sentence,
            'content' => Str::limit($this->faker->paragraph(mt_rand(3, 5))),
            'published_at' => $this->faker->dateTimeBetween('-1 Month', '+3 days'),
            'approved' => $this->faker->boolean,
        ];
    }
}
