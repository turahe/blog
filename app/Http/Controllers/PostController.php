<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

/**
 * Class PostController.
 */
final class PostController extends Controller
{
    /**
     * Show all blog.
     *
     * @param Request $request
     * @return View
     */
    public function index(Request $request)
    {
        $posts = $this->queryAll($request);

        $blogs = $posts
            ->where('type', 'blog')
            ->all();

        $latest = $posts->take(10);

        $featured = $posts->where('is_sticky', true);

        $getPost = $posts->random();

        $layout = 'blog.index';

        return view($layout, [
            'blogs' => $blogs,
            'posts' => $posts,
            'featured' => $featured,
            'latest'=> $latest,
            'getPost' => $getPost,
        ]);
    }

    /**
     * Show blog by slug.
     *
     * @param Request $request
     * @param string $slug
     * @return View
     */
    public function show(Request $request, string $slug): View
    {
        $posts = $this->queryAll($request);
        $blog = $posts->where('slug', $slug)->first();

        $related = $posts->where('category_id', $blog->category->id)
            ->except($blog->id);
        $latest = $posts->take(10);

        $layout = $blog ? $blog->layout : 'blog.show.default';

        return view($layout, [
            'blog' => $blog,
            'related' => $related,
            'latest' => $latest,
        ]);
    }

    /**
     * @return Response
     */
    public function rss(): Response
    {
        $posts = Cache::remember('feed-posts', now()->addHour(), fn () => Post::latest()->limit(20)->get());

        return response()->view('posts_feed.index', [
            'posts' => $posts,
        ], 200)->header('Content-Type', 'text/xml');
    }

    /**
     * @param Request $request
     * @return mixed
     */
    private function queryAll(Request $request)
    {
        $query = Post::where('published_at', '<=', now())
            ->where('is_draft', 0)
            ->orderBy('published_at', 'desc')
            ->where('type', 'blog')
            ->with(['category', 'media'])->get();

        if ($request->has('query') && $request->input('query') != '') {
            $query = Post::search($request->input('query'));
        }

        if (\App::environment('production')) {
            return Cache::remember('posts', now()->addHour(), fn () => $query);
        }

        return $query;
    }
}
