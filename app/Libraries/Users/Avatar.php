<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Users;

/**
 * Class Avatar.
 */
class Avatar
{
    /**
     * @param $model
     * @return null|string
     */
    public static function get($model)
    {
        if (empty($model->file)) {
            if (! empty($model->name)) {
                return 'https://avatars.dicebear.com/v2/initials/'.preg_replace('/[^a-z0-9 _.-]+/i', '', $model->name).'.svg';
            }

            return null;
        }

        return $model->file->url;
    }
}
