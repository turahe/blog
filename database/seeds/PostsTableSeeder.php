<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

use App\Models\Like;
use App\Models\Post;
use App\Models\Rate;
use App\Models\Comment;
use App\Models\Category;
use Illuminate\Database\Seeder;

/**
 * Class PostsTableSeeder.
 */
class PostsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Schema::disableForeignKeyConstraints();
        Post::truncate();

        factory(Category::class, 2)->create()->each(function (Category $category) {
            factory(Post::class, 10)->make()->each(function (Post $post) use ($category) {
                $category->posts()->save($post);

                $post->addMediaFromUrl('http://placeimg.com/1920/1920/any')
                    //                    ->preservingOriginal()
                    ->withResponsiveImages()
                    ->usingName($post->title)
                    ->toMediaCollection('images');

                $post->comments()->saveMany(factory(Comment::class, mt_rand(1, 10))->make());
                $post->rates()->saveMany(factory(Rate::class, 3)->make());
                $post->likes()->saveMany(factory(Like::class, mt_rand(1, 20))->make());
            });
        });
        Schema::enableForeignKeyConstraints();
    }
}
