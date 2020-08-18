<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

use App\Models\Permission;
use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

/**
 * Class PermissionsTableSeeder.
 */
class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $defaultPermission = self::defaultPermissions();

        foreach ($defaultPermission as $name => $description) {
            Permission::create([
                'name' => $name,
                'description' => $description,
            ]);
        }
    }

    /**
     * @return array
     */
    private static function defaultPermissions()
    {
        return [
            'view_user' => 'user can view user profile',
            'add_user' => 'user can add new user',
            'store_user' => 'user can store new user',
            'edit_user' => 'user can edit user profile',
            'update_user' => 'user can update new user',
            'delete_user' => 'user can delete user',

            'view_role' => ' user can view role',
            'add_role' => 'user can add role',
            'edit_role' => 'user can edit role',
            'delete_role' => 'user can delete role',

            'view_post' => 'user can view post',
            'add_post' => 'user can add post',
            'edit_post' => 'user can edit post',
            'delete_post' => 'user can delete post',
        ];
    }
}
