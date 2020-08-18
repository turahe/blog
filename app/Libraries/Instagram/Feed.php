<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @modified    5/17/20, 5:40 AM
 *  @name          Feed
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Instagram;

use Instagram;

class Feed
{
    /**
     * @param string $username
     * @throws Instagram\Exception\InstagramCacheException
     * @throws Instagram\Exception\InstagramException
     * @throws \GuzzleHttp\Exception\GuzzleException
     * @return Instagram\Hydrator\Component\Feed
     */
    public static function instagram(string $username): Instagram\Hydrator\Component\Feed
    {
        $path = storage_path('app/public/instagram/');
        $cache = new Instagram\Storage\CacheManager($path);
        $api = new Instagram\Api($cache);
        $api->setUserName($username);

        $feed = $api->getFeed();

        return $feed;
    }
}
