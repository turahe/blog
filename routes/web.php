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
Route::get('/privacy', 'PostController@page')->defaults('post', 'privacy-and-policy');
Route::get('/about', 'PostController@page')->defaults('post', 'about-me');

Route::get('/', 'PostController@index')->name('home');
Route::get('blog/{slug}', 'PostController@show');
Route::get('book/{slug}', 'PostController@show');
Route::get('category/{category}', 'CategoryController');

Route::get('newsletter-subscriptions/unsubscribe', 'NewsletterSubscriptionController@unsubscribe')
    ->name('newsletter-subscriptions.unsubscribe');
Route::post('newsletter-subscriptions', 'NewsletterSubscriptionController@store');

Auth::routes(['verify' => true]);

Route::prefix('auth')->group(function () {
    Route::get('{provider}', 'Auth\AuthController@redirectToProvider')->name('auth.provider');
    Route::get('{provider}/callback', 'Auth\AuthController@handleProviderCallback');
});
