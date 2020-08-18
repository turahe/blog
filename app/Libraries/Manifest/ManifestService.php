<?php
/**
 * For the full copyright and license information, please view the LICENSE
 *  file that was distributed with this source code.
 *
 *  @author         Nur Wachid
 *  @copyright      Copyright (c) Turahe 2020.
 */

namespace App\Libraries\Manifest;

/**
 * Class ManifestService.
 */
class ManifestService
{
    /**
     * @return array
     */
    public function generate(): array
    {
        $basicManifest = [
            'name' => config('blog.manifest.name'),
            'short_name' => config('blog.manifest.short_name'),
            'start_url' => asset(config('blog.manifest.start_url')),
            'display' => config('blog.manifest.display'),
            'theme_color' => config('blog.manifest.theme_color'),
            'background_color' => config('blog.manifest.background_color'),
            'orientation' =>  config('blog.manifest.orientation'),
            'status_bar' =>  config('blog.manifest.status_bar'),
            //            'splash' =>  config('blog.manifest.splash')
        ];

        foreach (config('blog.manifest.icons') as $size => $file) {
            $fileInfo = pathinfo($file['path']);
            $basicManifest['icons'][] = [
                'src' => url($file['path']),
                'type' => 'image/'.$fileInfo['extension'],
                'sizes' => $size,
                'purpose' => $file['purpose'],
            ];
        }

        foreach (config('blog.manifest.custom') as $tag => $value) {
            $basicManifest[$tag] = $value;
        }

        return $basicManifest;
    }
}
