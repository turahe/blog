<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

use App\Models\Tag;
use App\Models\Post;
use App\Models\Media;
use Illuminate\Database\Seeder;

/**
 * Class TagsTableSeeder.
 */
class TagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        if (App::environment(['local', 'staging', 'testing'])) {
            factory(Tag::class, 10)->create();

            $tags = Tag::all();
            $post = Post::all();
            $image = Media::all();

            self::taggable($post, $tags);
            self::taggable($image, $tags);
        }
    }

    /**
     * @param $model
     * @param $tags
     */
    private static function taggable($model, $tags): void
    {
        $model->each(function ($post) use ($tags) {
            $post->tags()->attach(
                $tags->random(rand(1, 9))->pluck('id')->toArray()
            );
        });
    }
}
