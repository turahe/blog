<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\User;
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
        $user = $this->faker->randomElement(User::pluck('id')->toArray());

        return [
            'user_id' => $user,
            'title' => $this->faker->sentence,
            'content' => Str::limit($this->faker->paragraph(mt_rand(3, 5))),
            'published_at' => $this->faker->dateTimeBetween('-1 Month', '+3 days'),
            'approved' => $this->faker->boolean,
        ];
    }
}
