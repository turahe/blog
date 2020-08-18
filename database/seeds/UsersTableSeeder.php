<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

use Carbon\Carbon;
use App\Models\User;
use App\Models\Social;
use App\Models\Profile;
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
        $users = self::defaultUser();

        foreach ($users as $index => $user) {
            User::updateOrCreate([
                'name' => strtolower($user['name']),
                'email' => $user['email'],
                'email_verified_at' => Carbon::now(),
                'password' => bcrypt('secret'),
                'remember_token' => Str::random(10),
                'api_token' => Str::random(32),
                'registered_at' => now(),
            ])->assignRole('admin')
                ->addMedia(storage_path('contents/assets/img/users/user-'.$index.'.png'))
                ->preservingOriginal()
                ->withResponsiveImages()
                ->usingName($user['name'])
                ->toMediaCollection('images');
        }

        if (App::environment(['local', 'staging', 'testing'])) {
            factory(User::class, 100)->create()->each(function ($user) {
                $user->profile()->save(factory(Profile::class)->make());
                $user->socials()->saveMany(factory(Social::class, mt_rand(3, 5))->make());
            });
        }
    }

    /**
     * Seed default users.
     *
     * @return array
     */
    protected static function defaultUser()
    {
        return [

            [
                'name' => 'Nur Wachid',
                'email' => 'wachid@outlook.com',

            ],
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
            ],
            [
                'name' => 'User',
                'email' => 'user@example.com',
            ],
            [
                'name' => 'Costumer Service',
                'email' => 'costumer-service@example.com',
            ],
            [
                'name' => 'manager',
                'email' => 'manager@example.com',
            ],
            [
                'name' => 'Master',
                'email' => 'master@example.com',
            ],
            [
                'name' => 'Administrator',
                'email' => 'administrator@example.com',
            ],
            [
                'name' => 'Agent',
                'email' => 'agent@example.com',
            ],
            [
                'name' => 'no replay',
                'email' => 'noreplay@example.com',
            ],
            [
                'name' => 'Dev',
                'email' => 'dev@example.com',
            ],
            [
                'name' => 'Developer',
                'email' => 'developer@example.com',
            ],
            [
                'name' => 'Guest',
                'email' => 'guest@example.com',
            ],
            [
                'name' => 'User Manager',
                'email' => 'user.manager@example.com',
            ],
            [
                'name' => 'Media',
                'email' => 'media@example.com',
            ],
            [
                'name' => 'Role',
                'email' => 'role@example.com',
            ],
            [
                'name' => 'Permission',
                'email' => 'permission@example.com',
            ],
            [
                'name' => 'Email',
                'email' => 'email@example.com',
            ],
        ];
    }
}
