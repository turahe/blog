<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers;

use App\Models\Category;

/**
 * Class CategoryController.
 */
class CategoryController extends Controller
{
    /**
     * @param Category $category
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Category $category)
    {
        $layout = $category ? $category->layout : 'blog.categories.index';

        return response()->view('blog.categories.single', [
            'category' => $category,
            'posts' => $category->posts()->with('media')->get(),
        ]);
    }
}
