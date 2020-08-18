<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;

/**
 * Class RolesTableSeeder.
 */
class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Role::updateOrCreate([
            'name' => Role::ROLE_ADMIN,
            'description' => 'Hak akses super sekali',
        ])->syncPermissions(Permission::all());

        Role::updateOrCreate([
            'name' => Role::ROLE_EDITOR,
            'description' => 'Edit all posts',
        ])->syncPermissions(Permission::all());

        Role::updateOrCreate([
            'name' => Role::ROLE_AUTHOR,
            'description' => 'Edit all posts',
        ])->syncPermissions(Permission::all());

        Role::updateOrCreate([
            'name' => Role::ROLE_GUEST,
            'description' => 'Pengguna biasa',
        ])->syncPermissions(['view_user', 'edit_user']);
    }
}
