<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use Tests\TestCase;

class PostFeatureTest extends TestCase
{
    /** @test  */
    public function it_can_show_the_blog_and_all_attribute()
    {
        Category::factory(2)->create();
        $category_id = $this->faker->randomElement(\DB::table('categories')->pluck('id')->toArray());
//
        Post::factory(10)->create([
            'category_id' => $category_id,
            'type' => 'blog',
        ]);

        $post = Post::where('type', 'blog')->firstOrFail();

        $this->get(route('blog.detail', $post->slug))
            ->assertStatus(200)
            ->assertSee("{$post->title}")
            ->assertSee("{$post->publish}")
            ->assertSee("{$post->url}");
    }
}
