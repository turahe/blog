<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('parent_id')->nullable();

            $table->string('slug')->unique();
            $table->string('title');
            $table->string('subtitle', 255)->nullable();
            $table->text('description')->nullable();
            $table->text('content_raw');
            $table->text('content_html');

            $table->string('is_draft')->default(false);
            $table->string('is_sticky')->default(false);
            $table->unsignedBigInteger('order_column')->nullable();
            $table->string('type');

            $table->timestamp('published_at');
            $table->string('layout')->default('default');
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');

            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('cascade');

            $table->foreign('parent_id')
                ->references('id')
                ->on('posts');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts');
    }
}
