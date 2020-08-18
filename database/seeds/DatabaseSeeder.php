<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

use Illuminate\Database\Seeder;

/**
 * Class DatabaseSeeder.
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            PermissionsTableSeeder::class,
            RolesTableSeeder::class,
            UsersTableSeeder::class,
            ProfilesTableSeeder::class,
            SocialsTableSeeder::class,
            CategoriesTableSeeder::class,
            PostsTableSeeder::class,
            TagsTableSeeder::class,
            //            LikesTableSeeder::class,
            ContactsUsTableSeeder::class,
            NewsletterSubscriptionTableSeeder::class,

        ]);
    }
}
