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

Route::get('/manifest.json', [\App\Http\Controllers\ManifestController::class, 'manifestJson']);
Route::get('/offline', [\App\Http\Controllers\ManifestController::class, 'offline']);

Route::get('rss', [\App\Http\Controllers\PostController::class, 'rss']);
//static pages
Route::get('contact', [\App\Http\Controllers\ContactUsController::class, 'contactUs']);
Route::post('contact', [\App\Http\Controllers\ContactUsController::class, 'store']);
Route::get('/privacy', [\App\Http\Controllers\PostController::class, 'page'])->defaults('post', 'privacy-and-policy');
Route::get('/about', [\App\Http\Controllers\PostController::class, 'page'])->defaults('post', 'about-me');

Route::get('/', [\App\Http\Controllers\PostController::class, 'index'])->name('home');
Route::get('blog/{slug}', [\App\Http\Controllers\PostController::class, 'show'])->name('blog.detail');
Route::get('book/{slug}', [\App\Http\Controllers\PostController::class, 'show'])->name('book.detail');
Route::get('category/{category}', \App\Http\Controllers\CategoryController::class)->name('category.detail');

Route::get('newsletter-subscriptions/unsubscribe', [\App\Http\Controllers\NewsletterSubscriptionController::class, 'unsubscribe'])
    ->name('newsletter-subscriptions.unsubscribe');
Route::post('newsletter-subscriptions', [\App\Http\Controllers\NewsletterSubscriptionController::class, 'store']);

Auth::routes(['verify' => true]);

Route::prefix('auth')->group(function () {
    Route::get('{provider}', [\App\Http\Controllers\Auth\AuthController::class, 'redirectToProvider'])->name('auth.provider');
    Route::get('{provider}/callback', [\App\Http\Controllers\Auth\AuthController::class, 'handleProviderCallback']);
});
