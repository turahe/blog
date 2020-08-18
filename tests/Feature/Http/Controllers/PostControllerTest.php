<?php

namespace Tests\Feature\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testIndex()
    {
//        $turahe = factory(User::class)->states('turahe')->create();

        $post = factory(Post::class)->create();
//        factory(Post::class, 2)->create();
//        factory(Comment::class, 3)->create(['post_id' => $post->id]);

        $this->get('/')
            ->assertOk()
            ->assertSee('Latest posts')
            ->assertSee($post->title)
            ->assertSee($post->published_at)
            ->assertSee('3')
            ->assertSee('Turahe');
    }
}
