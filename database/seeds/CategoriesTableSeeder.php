<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

use App\Models\Category;
use Illuminate\Database\Seeder;
use App\Libraries\Post\MarkdownParse\YamlFrontMatter;

/**
 * Class CategoriesTableSeeder.
 */
class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @param Category $category
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist
     * @throws \Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig
     * @return void
     */
    public function run()
    {
        $categories = self::defaultCategories();

        foreach ($categories as $index => $category) {
            $content = YamlFrontMatter::parse($category);
            $image = storage_path("contents/assets/img/categories/{$content->image}");

            Category::updateOrCreate([
                'parent_id' => 1,
                'order_column' => $index,
                'title' => $content->title,
                'subtitle' => is_string($content->subtitle) ? $content->subtitle : $content->subtitle,
                'description' => $content->body(),
            ])->addMedia($image)
                ->usingName($content->title)
                ->preservingOriginal()
                ->withResponsiveImages()
                ->toMediaCollection('images');
        }
    }

    protected static function defaultCategories()
    {
        $path = 'contents/_pages/categories';
        $contents = dirToArray(storage_path($path));
        $data = [];
        foreach ($contents as $key => $content) {
            $data[] = file_get_contents(storage_path($path.DIRECTORY_SEPARATOR.$content));
        }

        return  $data;
    }
}
