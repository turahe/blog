<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    5/8/20, 7:27 PM
 *  @name          ActivityInterface.php
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Activity;

interface ActivityInterface
{
    /**
     * @param $logModel
     * @param $changes
     * @param $request
     * @return bool
     */
    public function logCreatedActivity($logModel, $changes, $request);

    /**
     * @param $list
     * @param $before
     * @param $list_changes
     * @return bool
     */
    public function logUpdatedActivity($list, $before, $list_changes);

    /**
     * @param $list
     * @param $changeLogs
     * @return bool
     */
    public function logDeletedActivity($list, $changeLogs);

    /**
     * @param $user
     * @return bool
     */
    public function logLoginDetails($user);

    /**
     * @param $model
     * @return mixed
     */
    public function unsetAttributes($model);
}
