<?php
/**
 * This file is part of the jagopedia package.
 *
 *  For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         wachid
 *  @copyright      Copyright (c) wachid 2017-2019.
 */
if (! function_exists('set_active')) {

    /**
     * Menambahkan CSS class active Pada Menu Sesuai Route yang di Akses di Laravel 5.
     *
     * https://medium.com/laravel-indonesia/menambahkan-css-class-active-pada-menu-sesuai-route-yang-di-akses-di-laravel-5-d0d35e91a7fd
     *
     *
     * @param $uri
     * @param string $output
     * @return string
     */
    function set_active($uri, $output = 'active')
    {
        if (is_array($uri)) {
            foreach ($uri as $u) {
                if (Route::is($u)) {
                    return $output;
                }
            }
        } else {
            if (Route::is($uri)) {
                return $output;
            }
        }
    }
}

if (! function_exists('svg')) {

    /**
     * SVG helper.
     *
     * @param $src
     * @return bool|string
     */
    function svg($src): string
    {
        return file_get_contents(resource_path('assets/icons/'.$src.'.svg'));
    }
}

if (! function_exists('reading_time')) {
    /**
     * Returns an estimated reading time in a string
     * idea from @link http://briancray.com/posts/estimated-reading-time-web-design/.
     * @param string $content the content to be read
     * @return string          estimated read time eg. 1 minute, 30 seconds
     */
    function reading_time($content)
    {
        $word_count = str_word_count(strip_tags($content));

        $minutes = floor($word_count / 200);
        $seconds = floor($word_count % 200 / (200 / 60));

        $str_minutes = ($minutes == 1) ? 'minute' : 'minutes';
        $str_seconds = ($seconds == 1) ? 'second' : 'seconds';

        if ($minutes == 0) {
            return "{$seconds} {$str_seconds}";
        }

        return "{$minutes} {$str_minutes}, {$seconds} {$str_seconds}";
    }
}

if (! function_exists('dirToArray')) {

    /**
     * @param $dir
     * @return array
     */
    function dirToArray($dir)
    {
        $result = [];

        $cdir = scandir($dir);
        foreach ($cdir as $key => $value) {
            if (! in_array($value, ['.', '..'])) {
                if (is_dir($dir.DIRECTORY_SEPARATOR.$value)) {
                    $result[$value] = dirToArray($dir.DIRECTORY_SEPARATOR.$value);
                } else {
                    $result[] = $value;
                }
            }
        }

        return $result;
    }
}

if (! function_exists('is_php')) {
    /**
     * is_php.
     *
     * Determines if the current version of PHP is equal to or greater than the supplied value
     *
     * @param    string
     *
     * @return    bool    TRUE if the current version is $version or higher
     */
    function is_php($version)
    {
        static $_is_php;
        $version = (string) $version;

        if (! isset($_is_php[$version])) {
            $_is_php[$version] = version_compare(PHP_VERSION, $version, '>=');
        }

        return $_is_php[$version];
    }
}
if (! function_exists('is_really_writable')) {
    /**
     * is_really_writable.
     *
     * Tests for file writability
     *
     * is_writable() returns TRUE on Windows servers when you really can't write to
     * the file, based on the read-only attribute. is_writable() is also unreliable
     * on Unix servers if safe_mode is on.
     *
     * @link    https://bugs.php.net/bug.php?id=54709
     *
     * @param    string
     *
     * @return    bool
     */
    function is_really_writable($file)
    {
        // If we're on a Unix server with safe_mode off we call is_writable
        if (DIRECTORY_SEPARATOR === '/' && (is_php('5.4') || ! ini_get('safe_mode'))) {
            return is_writable($file);
        }

        /* For Windows servers and safe_mode "on" installations we'll actually
         * write a file then read it. Bah...
         */
        if (is_dir($file)) {
            $file = rtrim($file, '/').'/'.md5(mt_rand());
            if (($fp = @fopen($file, 'ab')) === false) {
                return false;
            }

            fclose($fp);
            @chmod($file, 0777);
            @unlink($file);

            return true;
        }
        if (! is_file($file) || ($fp = @fopen($file, 'ab')) === false) {
            return false;
        }

        fclose($fp);

        return true;
    }
}
