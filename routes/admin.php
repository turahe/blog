<?php

Route::get('/', \App\Http\Controllers\Admin\AdminController::class)->name('dashboard');
Route::resource('posts', \App\Http\Controllers\Admin\PostController::class)->except('show');
Route::resource('pages', \App\Http\Controllers\Admin\PageController::class)->except('show');
//Route::resource('users', )->only(['index', 'edit', 'update']);
Route::resource('comments', \App\Http\Controllers\Admin\CommentController::class)->only(['index', 'edit', 'update', 'destroy']);
Route::resource('categories', \App\Http\Controllers\Admin\CategoryController::class);
Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
Route::resource('permissions', \App\Http\Controllers\Admin\PermissionController::class);
Route::resource('roles', \App\Http\Controllers\Admin\RoleController::class);
