<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Http\Controllers\Admin;

/**
 * Class ShowDashboard.
 */
final class ShowDashboard extends Controller
{
    /**
     * Show the application admin dashboard.
     */
    public function __invoke()
    {
        $phpsettings = ini_get_all();
        // remove sensitive information
        unset(
            $phpsettings['extension_dir'],
            $phpsettings['sendmail_path'],
            $phpsettings['url_rewriter.tags'],
            $phpsettings['mysqli.default_socket'],
            $phpsettings['opcache.lockfile_path'],
            $phpsettings['pdo_mysql.default_socket'],
            $phpsettings['xdebug.trace_output_dir']
        );

        ob_start();
        phpinfo();
        $contents = ob_get_contents();
        ob_end_clean();

        // the name attribute "module_Zend Optimizer" of an anker-tag is not xhtml valide,
        // so replace it with "module_Zend_Optimizer"
        $phpinfo = (str_replace(
            'module_Zend Optimizer',
            'module_Zend_Optimizer',
            preg_replace('%^.*<body>(.*)</body>.*$%ms', '$1', $contents)
        ));

//        $phpinfo = str_replace('<table>', '<table class="table table-bordered table-striped">', $phpinfo);

        return response()->json($phpsettings);

//        return view('admin.dashboard.index', [
//            'comments' =>  Comment::lastWeek()->get(),
//            'posts' => Post::lastWeek()->get(),
//            'users' => User::lastWeek()->get(),
//        ]);
    }
}
