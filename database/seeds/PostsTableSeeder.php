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
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\Libraries\Post\MarkdownParse\YamlFrontMatter;

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
        Model::unguard();

        $posts = self::defaultPost();

        foreach ($posts as  $post) {
            $content = YamlFrontMatter::parse($post);
            $collection = is_string($content->colection) ? $content->colection : 'images';
            $post = Post::updateOrCreate([
                'user_id' => 1,
                'category_id' => $content->category,
                'title' => $content->title,
                'content' => (new App\Libraries\Post\Markdown)->generate($content->body()),
                'subtitle' => is_string($content->subtitle) ? $content->subtitle : null,
                'meta_description' => is_string($content->meta_description) ? $content->meta_description : null,
                'is_draft' => is_string($content->draft) ? $content->draft : false,
                'is_sticky' => is_string($content->is_sticky) ? $content->is_sticky : false,
                'published_at' => now(),
                'type' => $content->type,
            ]);
            try {
                $post->addMedia(storage_path('app/public/img/posts/'.$content->image))
                    ->preservingOriginal()
                    ->withResponsiveImages()
                    ->usingName($content->title)
                    ->toMediaCollection($collection);
            } catch (\Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist $e) {
                $e->getMessage();
            } catch (\Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig $e) {
                $e->getMessage();
            }

            if (App::environment(['local', 'staging', 'testing'])) {
                $post->comments()->saveMany(factory(Comment::class, mt_rand(1, 10))->make());
                $post->rates()->saveMany(factory(Rate::class, 3)->make());
                $post->likes()->saveMany(factory(Like::class, mt_rand(1, 20))->make());
            }
        }
    }

    /**
     * Seed default Posts.
     *
     * @return array
     */
    protected static function defaultPost()
    {
        $path = 'contents/_posts';
        $contents = dirToArray(storage_path($path));
        $data = [];
        foreach ($contents as $key => $content) {
            $data[] = file_get_contents(storage_path($path.DIRECTORY_SEPARATOR.$content));
        }

        return  $data;
    }
}
