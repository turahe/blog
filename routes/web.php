<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/manifest.json', 'ManifestController@manifestJson');
Route::get('/offline', 'ManifestController@offline');

Route::get('rss', 'PostController@rss');
//static pages
Route::get('contact', 'ContactUsController@contactUs');
Route::post('contact', 'ContactUsController@store');
Route::get('/privacy', [\App\Http\Controllers\PostController::class, 'page'])->defaults('post', 'privacy-and-policy');
Route::get('/about', [\App\Http\Controllers\PostController::class, 'page'])->defaults('post', 'about-me');

Route::get('/', [\App\Http\Controllers\PostController::class, 'index'])->name('home');
Route::get('blog/{slug}', [\App\Http\Controllers\PostController::class, 'show'])->name('blog.detail');
Route::get('book/{slug}', [\App\Http\Controllers\PostController::class, 'show'])->name('book.detail');
Route::get('category/{category}', \App\Http\Controllers\CategoryController::class)->name('category.detail');

Route::get('newsletter-subscriptions/unsubscribe', 'NewsletterSubscriptionController@unsubscribe')
    ->name('newsletter-subscriptions.unsubscribe');
Route::post('newsletter-subscriptions', 'NewsletterSubscriptionController@store');

Auth::routes(['verify' => true]);

Route::prefix('auth')->group(function () {
    Route::get('{provider}', 'Auth\AuthController@redirectToProvider')->name('auth.provider');
    Route::get('{provider}/callback', 'Auth\AuthController@handleProviderCallback');
});
