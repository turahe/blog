<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});

Route::prefix('v1')->namespace('Api')->group(function () {
    Route::middleware(['auth:api', 'verified', 'throttle:3'])->group(function () {
        // Comments
        Route::apiResource('comments', 'CommentController')->only('destroy');
        Route::apiResource('posts.comments', 'PostCommentController')->only('store');

        // Posts
        Route::apiResource('posts', 'PostController')->only(['update', 'store', 'destroy']);
        Route::post('/posts/{post}/likes', 'PostLikeController@store')->name('posts.likes.store');
        Route::delete('/posts/{post}/likes', 'PostLikeController@destroy')->name('posts.likes.destroy');

        // Users
        Route::apiResource('users', 'UserController')->only('update');

        // Media
//        Route::apiResource('media', 'MediaController')->only(['store', 'destroy']);
    });

    Route::post('/authenticate', 'Auth\AuthenticateController@authenticate')->name('authenticate');

    // Comments
//    Route::apiResource('posts.comments', function (App\Models\Post $post) {
//        return $post->id;
//    });
    Route::apiResource('posts.comments', 'PostCommentController')->only('index');
    Route::apiResource('users.comments', 'UserCommentController')->only('index');
    Route::apiResource('comments', 'CommentController')->only(['index', 'show']);

    // Posts
    Route::apiResource('posts', 'PostController')->only(['index', 'show']);
    Route::apiResource('categories', 'CategoryController')->only(['index', 'show']);
    Route::apiResource('tags', 'TagController')->only(['index', 'show']);
    Route::apiResource('users.posts', 'UserPostController')->only('index');

    // Users
    Route::apiResource('users', 'UserController')->only(['index', 'show']);

    // Media
//    Route::apiResource('media', 'MediaController')->only('index');
});
