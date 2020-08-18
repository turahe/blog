<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    5/7/20, 8:24 PM
 *  @name          Controller.php
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

/**
 * Class Controller.
 */
abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Controller constructor.
     */
    public function __construct()
    {
        $this->middleware('auth');
        //$this->middleware(['auth','permission:dashboard_access']);
    }

    /**
     * @param bool $permission
     */
    public function checkPermission($permission = false)
    {
        if ($permission) {
            if (! Auth::id() or ! Auth::user()->hasPermissionTo($permission)) {
                abort(403);
            }
        }
    }

    /**
     * @param $permission
     * @return bool
     */
    public function hasPermission($permission)
    {
        return Auth::user()->hasPermissionTo($permission);
    }
}
