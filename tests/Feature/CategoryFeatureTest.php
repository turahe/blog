<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use Tests\TestCase;

class CategoryFeatureTest extends TestCase
{
    /** @test  */
    public function it_can_show_the_category_and_posts_with_it()
    {
        factory(Category::class, 2)->create()->each(function (Category $category) {
            factory(Post::class, 10)->make()->each(function (Post $post) use ($category) {
                $category->posts()->save($post);
            });
        });

        $category = Category::all()->first();
        $post = Post::where('category_id', $category->id)->firstOrFail();

        $this
            ->get(route('category.detail', $category->slug))
            ->assertStatus(200)
            ->assertSee("{$category->title}")
            ->assertSee("{$post->title}")
            ->assertSee("{$post->publish}")
            ->assertSee("{$post->url}")
            ->assertSee("{$post->subtitle}");
    }
}
