<?php

namespace App\Providers;

use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use App\Models\Category;
use App\Observers\PostObserver;
use App\Observers\UserObserver;
use App\Observers\CommentObserver;
use App\Observers\CategoryObserver;
use Illuminate\Support\ServiceProvider;

/**
 * Class ObserverServiceProvider.
 */
class ObserverServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
//        Category::observe(CategoryObserver::class);
//        Post::observe(PostObserver::class);
//        User::observe(UserObserver::class);
//        Comment::observe(CommentObserver::class);
//        Media::observe(MediaObserver::class);
    }
}
