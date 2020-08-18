<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Api;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;

/**
 * Class PostLikeController.
 */
class PostLikeController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @param Post $post
     * @return Model
     */
    public function store(Request $request, Post $post)
    {
        return $post->like();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Post $post
     * @return Response
     */
    public function destroy(Post $post)
    {
        return $post->dislike();
    }
}
