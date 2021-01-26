<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Admin;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;

/**
 * Class AdminController.
 */
final class AdminController extends Controller
{
    /**
     * Show the application admin dashboard.
     */
    public function __invoke()
    {
        return view('admin.dashboard.index', [
            'comments' =>  Comment::latest()->get(),
            'posts' => Post::latest()->get(),
            'users' => User::latest()->get(),
        ]);
    }
}
