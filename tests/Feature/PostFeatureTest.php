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
        factory(Category::class, 2)->create();
        $category = $this->faker->randomElement(\DB::table('categories')->pluck('id')->toArray());
//
        factory(Post::class, 10)->create([
            'category_id' => $category,
            'type' => 'blog'
        ]);

        $post = Post::where('type', 'blog')->firstOrFail();

        $this->get(route('blog.detail', $post->slug))
            ->assertStatus(200)
            ->assertSee("{$post->title}")
            ->assertSee("{$post->publish}")
            ->assertSee("{$post->url}");
    }
}
