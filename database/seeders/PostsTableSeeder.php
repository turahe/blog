<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 * @author         Nur Wachid
 * @copyright      Copyright (c) Turahe 2020.
 */

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
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
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileCannotBeAdded
     */
    public function run()
    {
        Category::factory(2)->create()->each(function (Category $category) {
            Post::factory(10)->make()->each(function (Post $post) use ($category) {
                $category->posts()->save($post);

                $post->addMediaFromUrl('http://placeimg.com/1920/1920/any')
                    ->preservingOriginal()
                    ->withResponsiveImages()
                    ->usingName($post->title)
                    ->toMediaCollection('images');

                $post->comments()->saveMany(Comment::factory(mt_rand(1, 10))->make());
            });
        });
    }
}
