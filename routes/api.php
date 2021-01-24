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

Route::middleware(['auth:api', 'verified', 'throttle:3'])->group(function () {
    // Comments
    Route::delete('comments/{comment}', [\App\Http\Controllers\Api\CommentController::class, 'destroy'])->name('comments.destroy');
    Route::post('posts/{post}/comments', [\App\Http\Controllers\Api\PostCommentController::class, 'store'])->name('posts.comments');

    // Posts
    Route::apiResource('posts', \App\Http\Controllers\Api\PostController::class);
    Route::post('/posts/{post}/likes', [\App\Http\Controllers\Api\PostLikeController::class, 'store'])->name('posts.likes.store');
    Route::delete('/posts/{post}/likes', [\App\Http\Controllers\Api\PostLikeController::class, 'destroy'])->name('posts.likes.destroy');

    // Users
    Route::apiResource('users', \App\Http\Controllers\Api\UserController::class)->only('update');

    // Media
//        Route::apiResource('media', 'MediaController')->only(['store', 'destroy']);
});

Route::post('/authenticate', [\App\Http\Controllers\Api\Auth\AuthenticateController::class, 'authenticate'])->name('authenticate');

// Comments
//    Route::apiResource('posts.comments', function (App\Models\Post $post) {
//        return $post->id;
//    });
Route::apiResource('posts.comments', \App\Http\Controllers\Api\PostCommentController::class)->only('index');
Route::apiResource('users.comments', \App\Http\Controllers\Api\UserCommentController::class)->only('index');
Route::apiResource('comments', \App\Http\Controllers\Api\CommentController::class)->only(['index', 'show']);

// Posts
Route::apiResource('posts', \App\Http\Controllers\Api\PostController::class)->only(['index', 'show']);
Route::apiResource('categories', \App\Http\Controllers\Api\CategoryController::class)->only(['index', 'show']);
Route::apiResource('tags', \App\Http\Controllers\Api\TagController::class)->only(['index', 'show']);
Route::apiResource('users.posts', \App\Http\Controllers\Api\UserPostController::class)->only('index');

// Users
Route::apiResource('users', \App\Http\Controllers\Api\UserController::class)->only(['index', 'show']);

// Media
//    Route::apiResource('media', 'MediaController')->only('index');
