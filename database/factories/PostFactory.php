<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Post::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $title = $this->faker->unique()->sentence(3, 1);
        $user = $this->faker->randomElement(\DB::table('users')->pluck('id')->toArray());

        return [
            'user_id' => $user, //factory(\App\Models\User::class)->create()->id,
            //        'category_id' => mt_rand(1, 10),
            'title' => $title,
            'subtitle' => Str::limit($this->faker->realText(300, 3), 190),
            'content_raw' => implode("\n\n", $this->faker->paragraphs(mt_rand(7, 16))),
            'meta_description' => "Meta for $title",
            'is_sticky' => $this->faker->boolean,
            'published_at' => $this->faker->dateTimeBetween('-1 Month', '+3 days'),
            'type' => $this->faker->randomElement(['blog', 'post', 'wiki', 'tutorial', 'book']),

        ];
    }
}
