<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

use App\Models\Profile;
use App\Models\Social;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Class UsersTableSeeder.
 */
class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
//        Schema::disableForeignKeyConstraints();
//        User::truncate();

            User::updateOrCreate([
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'email_verified_at' => now(),
                'password' => bcrypt('secret'),
                'remember_token' => Str::random(10),
                'api_token' => Str::random(32),
                'registered_at' => now(),
            ])->assignRole('admin');

        if (App::environment(['local', 'staging', 'testing'])) {
            factory(User::class, 100)->create()->each(function ($user) {
                $user->profile()->save(factory(Profile::class)->make());
                $user->socials()->saveMany(factory(Social::class, mt_rand(3, 5))->make());
            });
        }
//        Schema::enableForeignKeyConstraints();
    }
}
